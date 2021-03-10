import { logger } from '../../utils';
import request from 'centra';

const headers = {
  'User-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
  Accept: 'application/json',
  'X-Auth-Token': '',
};

const setToken = (authToken: string): void => {
  headers['X-Auth-Token'] = authToken;
};

const req = async (
  route: string,
  method: string,
  body: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const fetch = request(route, method);
  fetch.reqHeaders = headers;
  const res = await fetch.body(body).send();

  if (res.statusCode === undefined) {
    logger.error('Wiki request status code is undefined');

    // Sentry.addBreadcrumb({
    //   category: 'request',
    //   message: 'Wiki request status code is undefined',
    //   level: Sentry.Severity.Error,
    // });

    // return internal server error
    return { status: 500 };
  }

  if (res.statusCode >= 200 && res.statusCode < 300) {
    try {
      return res.json;
    } catch {
      return { status: res.statusCode };
    }
  } else if (
    res.statusCode >= 400 &&
    res.statusCode < 500
  ) {
    logger.info(res.statusCode);
  } else {
    logger.warning(
      `reattempting, status code: ${res.statusCode}`,
    );
    return await req(route, method, body);
  }

  return;
};

const get = async (route: string): Promise<void> =>
  await req(route, 'GET', '');

const post = async (
  route: string,
  body: unknown,
): Promise<void> => await req(route, 'POST', body);

const patch = async (
  route: string,
  body: unknown,
): Promise<void> => await req(route, 'PATCH', body);

const put = async (
  route: string,
  body: unknown,
): Promise<void> => await req(route, 'PUT', body);

const del = async (route: string): Promise<void> =>
  await req(route, 'DELETE', '');

export default {
  setToken,
  get,
  post,
  patch,
  put,
  delete: del,
};
