export default class Logger {
  private _logger: any;

  constructor(logger: any) {
    this._logger = logger;
  }

  public info(message: string) {
    this._logger.info(message);
  }

  public warn(message: string) {
    this._logger.warn(message);
  }

  public error(message: string) {
    this._logger.error(message);
  }
}
