import zookeeper from 'zookeeper';
import { logger } from '../utils';

export default class Zookeeper {
  private client: zookeeper;
  isConnected: boolean;
  applicationPath: string;

  constructor() {
    this.applicationPath = process.env.ZOOKEEPER_APPLICATION_PATH || '/wikibot-canary-dev-local';
    if (!this.applicationPath.startsWith('/')) this.applicationPath = '/' + this.applicationPath;

    const host = process.env.ZOOKEEPER_HOST.includes(',')
      ? process.env.ZOOKEEPER_HOST.split(',')
      : process.env.ZOOKEEPER_HOST || '127.0.0.1:2181';
    const config = {
      connect: host,
      timeout: 5000,
      debug_level: zookeeper.constants.ZOO_LOG_LEVEL_WARN,
      host_order_deterministic: false
    };
    this.client = new zookeeper(config);

    this.client.on('close', () => {
      this.isConnected = false;
      logger.info(`session closed, id=${this.client.client_id}`);
      this.client = null;
    });

    this.client.on('connecting', () => {
      this.isConnected = false;
      logger.info(`session connecting, id=${this.client.client_id}`);
    });

    this.client.on('connect', async () => {
      this.isConnected = true;
      this.createRequiredPathes();
      this.addNewNode('someDir/test');
      logger.info(`session connected, id=${this.client.client_id}`);
    });

    this.client.init({});

    return this;
  }

  getClient(): zookeeper {
    return this.client;
  }

  getApplicationPath(): string {
    return this.applicationPath;
  }

  private createRequiredPathes() {
    if (this.client.exists(this.applicationPath, false)) return;
    try {
      this.client.create(this.applicationPath, '', zookeeper.constants.ZOO_CONTAINER);
    } catch (e) {
      logger.error(e);
    }
  }
  async addNewNode(nodeName: string) {
    try {
      return await this.client.mkdirp(this.applicationPath + '/' + nodeName, (err, res) => {
        void res;
        if (err) {
          logger.debug(err);
        }
      });
    } catch (e) {
      logger.debug(e);
      return false;
    }
  }
  async exists(path: string) {
    try {
      await this.client.exists(path, false);
      return true;
    } catch (e) {
      return false;
    }
  }
}
