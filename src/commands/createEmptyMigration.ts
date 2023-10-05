import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { Options } from '@lib/container';
import { createEmptyMigrationTemplate } from '@lib/templates/createEmptyMigrationTemplate';
import { assertIsDirExists } from '@lib/utils/sources/assertIsDirExists';
import { isFileExists } from '@lib/utils/sources/isFileExists';

export async function createEmptyMigration(options: Options): Promise<void> {
  await assertIsDirExists(options.migrationsDir);

  if (options.migrationName === undefined) {
    throw new Error(
      'The `migrationName` option should be provided to create an empty migration',
    );
  }
  const currentDate = new Date();
  const ext = options.migrationFileExtension
    ? `.${options.migrationFileExtension}`
    : '.ts';

  const migrationFileName = `${currentDate.getTime()}-${resolve(
    options.migrationsDir,
    options.migrationName,
  )}${ext}`;

  if ((await isFileExists(migrationFileName)) === true) {
    throw new Error(
      `"A migration file named "${migrationFileName}" already exists.`,
    );
  }

  await writeFile(
    migrationFileName,
    createEmptyMigrationTemplate(options.migrationName, currentDate, ext),
  );
}
