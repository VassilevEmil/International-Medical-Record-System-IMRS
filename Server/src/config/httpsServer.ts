import https from 'https';
import fs from 'fs';
import { Application } from 'express';
import 'dotenv/config';

export const setupHttpsServer = (app: Application) => {
    const privateKeyPath = process.env.PRIVATE_KEY_PATH || './certs/private.key';
    const certificatePath = process.env.CERTIFICATE_PATH || './certs/certificate.crt';  

    if (!fs.existsSync(privateKeyPath) || !fs.existsSync(certificatePath)) {
        console.error('TLS certificate or key not found. Ensure server.key and server.cert are present.');
        process.exit(1);
    }

    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    const certificate = fs.readFileSync(certificatePath, 'utf8');
    const credentials = { key: privateKey, cert: certificate };

    const httpsServer = https.createServer({
        ...credentials,
        requestCert: true,
        rejectUnauthorized: false,
    }, app);

    const PORT = process.env.PORT || 3000;
    httpsServer.listen(PORT, () => {
        console.log(`HTTPS Server running on port ${PORT}`);
    });

    httpsServer.on('error', (error) => {
        console.error('HTTPS Server failed to start:', error);
    });
};