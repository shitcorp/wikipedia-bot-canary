/* eslint @typescript-eslint/no-unused-vars: 0 */

import { Request, Response } from 'express';
import { Command } from '../../../../@types/cmd';
import { APIRoute } from '../../../../@types/api';

export const route: APIRoute = {
  name: 'name',
  method: 'ALL',
  route: async (
    req,
    res,
    commands,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) => {},
};
