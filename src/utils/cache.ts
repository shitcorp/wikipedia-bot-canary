import ioredis from 'ioredis';
import Redis from 'ioredis-mock';

export default process.env.NODE_ENV.toLowerCase() === 'testing'
  ? new Redis()
  : new ioredis({
      port: Number(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST
    });
