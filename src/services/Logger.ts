export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LoggerInterface {
  error(message: string): void;

  warn(message: string): void;

  info(message: string): void;

  debug(message: string): void;
}

export class Logger implements LoggerInterface {
  constructor(private readonly logLevel: LogLevel) {}

  error(message: string): void {
    this.log(LogLevel.ERROR, message);
  }

  warn(message: string): void {
    this.log(LogLevel.WARN, message);
  }

  info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  debug(message: string): void {
    this.log(LogLevel.DEBUG, message);
  }

  private log(level: LogLevel, message: string): void {
    if (level > this.logLevel) {
      return;
    }

    const levelString = LogLevel[level].toUpperCase();
    const logEntry = `${new Date().toISOString()} [${levelString}] ${message}`;

    if (level <= LogLevel.WARN) {
      // eslint-disable-next-line no-console
      console.error(logEntry);

      return;
    }

    // eslint-disable-next-line no-console
    console.log(logEntry);
  }
}
