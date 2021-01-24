import { Request, Response } from 'express';

export const route = {
  name: 'name',
  method: 'Method',
  route: async (
    req: Request,
    res: Response,
    commands: Map<string, any>,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ): Promise<void> => {},
};
