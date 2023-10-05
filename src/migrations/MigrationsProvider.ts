import { FileLoader } from '@lib/FileLoader';
import { MigrationInterface } from '@lib/migrations/MigrationInterface';
import { Sifter, SifterResult } from '@lib/migrations/Sifter';

type Options = Readonly<{
  migrationsDir: string;
  filePatterns: readonly string[];
}>;

export interface MigrationsProviderInterface {
  provide(): Promise<readonly MigrationInterface[]>;
}

const DEFAULT_FILE_PATTERNS = ['*.ts', '*.js'];

export class MigrationsProvider implements MigrationsProviderInterface {
  constructor(
    private readonly fileLoader: FileLoader,
    private readonly sifter: Sifter,
    private readonly options: Options,
  ) {}

  /**
   * @throws Error
   */
  async provide(): Promise<readonly MigrationInterface[]> {
    const files = await this.fileLoader.import(
      this.options.migrationsDir,
      this.options.filePatterns.length > 0
        ? this.options.filePatterns
        : DEFAULT_FILE_PATTERNS,
    );

    return this.sifter
      .execute(files)
      .map((sifterResult: SifterResult): MigrationInterface => {
        const loadedMigration = new sifterResult.objectClass();

        if (typeof loadedMigration.getName() !== 'string') {
          throw new Error(
            `getName method in ${sifterResult.fileName} file should return a string`,
          );
        }

        if (!(loadedMigration.getCreatedAt() instanceof Date)) {
          throw new Error(
            `getCreatedAt method in ${sifterResult.fileName} file should return a Date`,
          );
        }

        return loadedMigration;
      });
  }
}
