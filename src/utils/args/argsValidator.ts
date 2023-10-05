import { Command, commands } from '@lib/commands';
import { RawOptions } from '@lib/utils/args/argumentsParser';

type CliOptions = {
  readonly command: Command;
  readonly migrationsDir: string;
  readonly migrationName: string | undefined;
  readonly migrationFileExtension: string | undefined;
  readonly filePatterns: readonly string[];
};

/**
 * @throws ArgsValidatorException
 */
export function argsValidator(args: RawOptions): asserts args is CliOptions {
  const { migrationsDir, command, migrationFileExtension } = args;

  if (migrationsDir === undefined) {
    throw new Error(
      'The `migrationDir` option is required. Please specify a filePatterns `migrationDir=<migrationDir>`',
    );
  }

  if (
    migrationFileExtension !== undefined &&
    migrationFileExtension !== 'js' &&
    migrationFileExtension !== 'ts'
  ) {
    throw new Error(
      `Unknown value "${migrationFileExtension}" for the \`migrationExtension\` arg. Available values are "js" or "ts"`,
    );
  }

  const availableCommandValues = Object.keys(commands);

  if (
    command === undefined ||
    availableCommandValues.includes(command) === false
  ) {
    throw new Error(
      `Unknown value "${command}" for the \`command\` arg. Available values are ${availableCommandValues.join(
        ',',
      )}`,
    );
  }
}
