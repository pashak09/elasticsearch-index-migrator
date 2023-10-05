import { ExecutedMigration } from '@lib/indexes/ExecutedMigration';
import { MigrationInterface } from '@lib/migrations/MigrationInterface';
import { MigrationsExecutor } from '@lib/migrations/MigrationsExecutor';
import { ExecutedMigrationRepository } from '@lib/repositories/ExecutedMigrationRepository';
import { IndexCreator } from '@lib/services/IndexCreator';
import { LoggerInterface } from "@lib/services/Logger";

export class Runner {
  constructor(
    private readonly indexCreator: IndexCreator,
    private readonly logger: LoggerInterface,
    private readonly executedMigrationRepository: ExecutedMigrationRepository,
    private readonly migrationsExecutor: MigrationsExecutor,
  ) {}

  async run(migrations: readonly MigrationInterface[]): Promise<void> {
    if (migrations.length === 0) {
      return;
    }

    const isIndexExists =
      await this.executedMigrationRepository.checkIndexExists();

    if (isIndexExists === false) {
      this.logger.info(
        'There is no index to store migration data found. Creating a new one',
      );

      await this.indexCreator.createIndex(ExecutedMigration);
    }

    await this.migrationsExecutor.execute(migrations);

    this.logger.info('Done');
  }
}
