import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  if (req.originalUrl.startsWith('/api')) {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).render('public/error', { message: 'Something went wrong' });
  }
}
