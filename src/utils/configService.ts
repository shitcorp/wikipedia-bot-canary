import { ZClient, logger } from '.';

class configService {
  constructor() {}
  async getConfig(id: string) {
    if (ZClient.isConnected !== true) {
      logger.debug('[CONFIG SERVICE.getConfig] Zookeeper client not connected yet, retying in 1 second');
      setTimeout(() => this.getConfig(id), 1000);
    }
    if (ZClient.getClient().exists(ZClient.getApplicationPath() + '/configs/' + id, false)) {
      const conf = await ZClient.getClient().get(ZClient.getApplicationPath() + '/configs/' + id, false);
      return JSON.parse(conf[1].toString());
    } else return null;
  }
  async setConfig(id: string, value: string) {
    // TODO: get current config, check what version it was created with and validate it against
    // TODO: the schema for that version, then update the config with the schema of the new version

    const nodeExists = await ZClient.exists(ZClient.getApplicationPath() + '/configs/' + id);

    if (nodeExists) return await ZClient.getClient().set(ZClient.getApplicationPath() + '/configs/' + id, value, -1);

    try {
      ZClient.getClient().mkdirp(ZClient.getApplicationPath() + '/configs/' + id, (err, res: boolean) => {
        if (res === true && err === null)
          return ZClient.getClient().set(ZClient.getApplicationPath() + '/configs/' + id, value, -1);
      });
    } catch (e) {
      logger.debug(e);
    }
  }

  async deleteConfig(id: string): Promise<boolean> {
    try {
      const delres = await ZClient.getClient().delete_(ZClient.getApplicationPath() + '/configs/' + id, -1);
      return delres;
    } catch (e) {
      logger.debug(e);
      return false;
    }
  }
}

export default new configService();
