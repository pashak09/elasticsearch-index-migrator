import { createEmptyMigration } from '@lib/commands/createEmptyMigration';
import { runMigrations } from '@lib/commands/runMigrations';
import { Options } from '@lib/container';
import { LoggerInterface } from '@lib/services/Logger';

export type Command = 'createEmptyMigration' | 'runMigrations';

type CommandHandler = (
  options: Options,
  logger: LoggerInterface,
) => Promise<void>;

export const commands: Record<Command, CommandHandler> = {
  createEmptyMigration,
  runMigrations,
};
