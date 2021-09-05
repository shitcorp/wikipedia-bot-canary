import { ZClient, logger } from '.';
import { Validator } from 'jsonschema';
import { version1 } from '../config/schemas';

class configService {
  validator: Validator;
  constructor() {
    this.validator = new Validator();
    const test = {
      version: 1,
      config: {
        lang: 'en'
      }
    };
    console.log(this.validator.validate(test, version1));
  }
  async getConfig(id: string) {
    if (ZClient.isConnected !== true) {
      logger.debug('Zookeeper client not connected yet, retying in 1 second');
      setTimeout(() => this.getConfig(id), 1000);
    }
    if (ZClient.getClient().exists(ZClient.getApplicationPath() + '/' + id, false)) {
      const conf = await ZClient.getClient().get(ZClient.getApplicationPath() + '/' + id, false);
      return JSON.parse(conf[1].toString());
    } else return null;
  }
  async setConfig(id: string, value: string) {
    // TODO: get current config, check what version it was created with and validate it against
    // TODO: the schema for that version, then update the config with the schema of the new version

    const nodeExists = await ZClient.exists(ZClient.getApplicationPath() + '/' + id);

    if (nodeExists) return await ZClient.getClient().set(ZClient.getApplicationPath() + '/' + id, value, -1);

    try {
      ZClient.getClient().mkdirp(ZClient.getApplicationPath() + '/' + id, (err, res: boolean) => {
        if (res === true && err === null)
          return ZClient.getClient().set(ZClient.getApplicationPath() + '/' + id, value, -1);
      });
    } catch (e) {
      logger.debug(e);
    }
  }

  async deleteConfig(id: string): Promise<boolean> {
    try {
      const delres = await ZClient.getClient().delete_(ZClient.getApplicationPath() + '/' + id, -1);
      return delres;
    } catch (e) {
      logger.debug(e);
      return false;
    }
  }
}

export default new configService();
