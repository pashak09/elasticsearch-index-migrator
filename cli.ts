import { resolve } from 'node:path';

import { commands } from '@lib/commands';
import { Logger, LogLevel } from '@lib/services/Logger';
import { argsValidator } from '@lib/utils/args/argsValidator';
import { argumentsParser } from '@lib/utils/args/argumentsParser';

void (async (): Promise<void> => {
  const logger = new Logger(LogLevel.INFO);

  const args = argumentsParser();

  argsValidator(args);

  try {
    await commands[args.command](
      { ...args, migrationsDir: resolve(process.cwd(), args.migrationsDir) },
      logger,
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`${error.message}\n ${error.stack}`);

      process.exit(1);
    }

    throw error;
  }
})();
