import { Client } from '@elastic/elasticsearch';
import { MigrationInterface } from '@lib/migrations/MigrationInterface';
import { MigrationSaver } from '@lib/migrations/MigrationSaver';
import { MigrationsSorter } from '@lib/migrations/MigrationsSorter';
import { Logger } from '@lib/services/Logger';

export class MigrationsExecutor {
  constructor(
    private readonly migrationSaver: MigrationSaver,
    private readonly migrationsSorter: MigrationsSorter,
    private readonly elasticsearchClient: Client,
    private readonly logger: Logger,
  ) {}

  async execute(migrations: readonly MigrationInterface[]): Promise<void> {
    const pendingMigrations =
      await this.migrationsSorter.getPendingMigrations(migrations);

    if (pendingMigrations.length === 0) {
      this.logger.info('No migrations to run');

      return;
    }

    for (const pendingMigration of pendingMigrations) {
      await pendingMigration.up(this.elasticsearchClient);
      await this.migrationSaver.save(pendingMigration);

      this.logger.info(`Execute migration ${pendingMigration.getName()}`);
    }
  }
}
