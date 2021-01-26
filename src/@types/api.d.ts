import { Request, Response } from 'express';
import { Command } from './cmd';

interface APIRoute {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'ALL';
  route: (
    req: Request,
    res: Response,
    commands: Map<string, Command>,
  ) => Promise<void>;
}
