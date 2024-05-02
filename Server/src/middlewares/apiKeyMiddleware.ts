import { Request, Response, NextFunction } from "express";

export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];

  if (apiKey === process.env.API_KEY) {
    console.log("Correct API Key");
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized access: Invalid API key' });
  }
}
