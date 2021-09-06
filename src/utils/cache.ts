import ioredis from 'ioredis';

export default new ioredis({
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST
});
