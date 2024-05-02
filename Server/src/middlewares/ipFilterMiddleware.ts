import { Request, Response, NextFunction } from 'express';

const allowedIPs: string[] = process.env.ALLOWED_IPS?.split(',').map(ip => ip.trim()) || [];

export const ipFilterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const forwardedIps = req.headers['x-forwarded-for'] ? (req.headers['x-forwarded-for'] as string).split(',')[0].trim() : null;
    const clientIp = req.ip || forwardedIps || req.socket.remoteAddress;

    if (allowedIPs.includes(clientIp as string)) {
        next();
    } else {
        res.status(403).send('Access Denied: Your IP is not allowed');
    }
};
