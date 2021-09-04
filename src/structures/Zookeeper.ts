import zookeeper from 'zookeeper';
import { logger } from '../utils';

export default class Zookeeper {
  private client: zookeeper;
  isConnected: boolean;
  applicationPath: string;

  constructor() {
    this.applicationPath = process.env.ZOOKEEPER_APPLICATION_PATH || '/wikibot-canary-dev-local';
    if (!this.applicationPath.startsWith('/')) this.applicationPath = '/' + this.applicationPath;

    const host = process.env.ZOOKEEPER_HOST || '127.0.0.1:2181';
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
      await this.addNewNode('dust');
      this.setData();
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
    if (this.exists(this.applicationPath)) return;
    try {
      this.client.create(this.applicationPath, '', zookeeper.constants.ZOO_CONTAINER);
    } catch (e) {
      logger.error(e);
    }
  }
  addNewNode(nodeName: string) {
    return new Promise((resolve, reject) => {
      try {
        this.client.mkdirp(this.applicationPath + '/' + nodeName, (err, res) => {
          if (err) reject(false);
          resolve(res);
        });
      } catch (e) {
        logger.error(e);
        reject(false);
      }
    });
  }
  async setData() {
    try {
      // const d = await this.client.get(this.applicationPath + '/test', false);
      // console.log(d);
      // const del = await this.client.delete_(this.applicationPath + '/test', 2);
      // console.log(del);
      const test = await this.exists(this.applicationPath);
      console.log(test);
    } catch (e) {
      logger.error(e);
    }
  }
  exists(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.a_exists(path, false, (res, err) => {
        if (res === 0) resolve(true);
        else reject(false);
      });
    });
  }
}
