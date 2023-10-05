import { parseArgs } from 'node:util';

export type RawOptions = {
  readonly command: string | undefined;
  readonly migrationsDir: string | undefined;
  readonly migrationName: string | undefined;
  readonly migrationFileExtension: string | undefined;
  readonly filePatterns: readonly string[];
};

export function argumentsParser(): RawOptions {
  const {
    values: {
      migrationsDir,
      command,
      migrationName,
      filePatterns = [],
      migrationFileExtension,
    },
  } = parseArgs({
    options: {
      migrationsDir: {
        type: 'string',
      },
      filePatterns: {
        type: 'string',
        multiple: true,
      },
      migrationName: {
        type: 'string',
      },
      migrationFileExtension: {
        type: 'string',
      },
      command: {
        type: 'string',
      },
    },
  });

  return {
    filePatterns,
    migrationFileExtension,
    migrationsDir,
    migrationName,
    command,
  };
}
