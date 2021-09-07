import {
  BadRequestException,
  Injectable,
  Logger,
  LogLevel,
} from '@nestjs/common';

@Injectable()
export class ConfigurableLogger extends Logger {
  public logLevels: LogLevel[] = ['log', 'error', 'warn'];
  public static servicesWithLoggers: Map<string, LogLevel[]> = new Map();

  constructor(public readonly context: string) {
    super();
    ConfigurableLogger.servicesWithLoggers.set(context, this.logLevels);
  }
  getLoggingLevel() {
    return ConfigurableLogger.logLevels;
  }
  servicesWithLogger() {
    const jsonObject = {};
    ConfigurableLogger.servicesWithLoggers.forEach((value, key) => {
      jsonObject[key] = value;
    });
    return jsonObject;
  }

  setLoggingLevel(context: string, newLogLevels: LogLevel[] | string) {
    if (ConfigurableLogger.servicesWithLoggers.has(context)) {
      if (typeof newLogLevels === 'string') {
        let oldLevels = ConfigurableLogger.servicesWithLoggers.get(context);
        const found = oldLevels.findIndex((v) => v === newLogLevels);
        if (found == -1) {
          oldLevels.push(newLogLevels as LogLevel);
        } else {
          delete oldLevels[found];
          oldLevels = oldLevels.filter(Boolean);
        }
        newLogLevels = oldLevels;
      }
      ConfigurableLogger.servicesWithLoggers.set(context, newLogLevels);
      return ConfigurableLogger.servicesWithLoggers.get(context);
    } else {
      throw new BadRequestException(context + ' not found');
    }
  }

  log(message: any): void {
    if (this.logLevels.includes('log')) super.log.apply(this, [message]);
  }

  warn(message: any): void {
    if (this.logLevels.includes('warn')) super.warn.apply(this, [message]);
  }

  error(message: any): void {
    if (this.logLevels.includes('error')) super.error.apply(this, [message]);
  }

  debug(message: any): void {
    if (this.logLevels.includes('debug')) super.debug.apply(this, [message]);
  }

  verbose(message: any): void {
    if (this.logLevels.includes('verbose'))
      super.verbose.apply(this, [message]);
  }
}
