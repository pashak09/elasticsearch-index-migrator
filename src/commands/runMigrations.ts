import { Container, Options } from '@lib/container';
import { Migrator } from '@lib/Migrator';
import { LoggerInterface } from '@lib/services/Logger';

export async function runMigrations(
  options: Options,
  logger: LoggerInterface,
): Promise<void> {
  const container = new Container();

  container.useLogger(logger);
  await container.init(options);

  await container.getService(Migrator).execute();
}
