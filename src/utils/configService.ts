import { ZClient, logger } from '.';

class configService {
  async getConfig(id: string) {
    if (ZClient.isConnected !== true) {
      logger.debug('Zookeeper client not connected yet, retying in 1 second');
      setTimeout(() => this.getConfig(id), 1000);
    }
    if (ZClient.exists(ZClient.getApplicationPath() + '/' + id))
      return ZClient.getClient().get(ZClient.getApplicationPath() + '/' + id, false);
    else return null;
  }
}

export default new configService();
