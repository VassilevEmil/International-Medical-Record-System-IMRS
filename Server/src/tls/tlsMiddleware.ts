import { Request, Response, NextFunction } from 'express';
import { TLSSocket } from 'tls';
import crypto from 'crypto';
import { isFingerprintValid } from '../mongo/controllers/tlsCertificatesController';

export async function validateClientCertificate(req: Request, res: Response, next: NextFunction) {
    if (req.socket instanceof TLSSocket) {
        // We dont check if authorized, because for development purposes we don't care if a CA is authorizing the certificate
        const clientCert = req.socket.getPeerCertificate(true); // Pass `true` to ensure even unauthorized certificates are retrieved
        
        if (clientCert && clientCert.raw) {
            const fingerprintSHA256 = crypto.createHash('sha256').update(Buffer.from(clientCert.raw)).digest('hex').toUpperCase();
            const fingerprintColonSeparated: string = fingerprintSHA256.match(/.{1,2}/g)!.join(':');

            try {
                const institutionName = await isFingerprintValid(fingerprintColonSeparated);

                if (institutionName) {
                    console.log(`Access granted to institution: ${institutionName}`);
                    next();
                } else {
                    res.status(403).send('Unauthorized: Your client certificate is not recognized.');
                }
            } catch (error) {
                console.error('Error during certificate validation:', error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            res.status(400).send('Client TLS certificate required.');
        }
    } else {
        res.status(403).send('A secure TLS connection is required.');
    }
}
