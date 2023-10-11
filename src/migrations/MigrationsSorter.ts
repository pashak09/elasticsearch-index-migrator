import { ExecutedMigration } from '@lib/indexes/ExecutedMigration';
import { MigrationInterface } from '@lib/migrations/MigrationInterface';
import { ExecutedMigrationRepository } from '@lib/repositories/ExecutedMigrationRepository';
import { MigrationNameParser } from '@lib/services/MigrationNameParser';

export class MigrationsSorter {
  constructor(
    private readonly executedMigrationRepository: ExecutedMigrationRepository,
    private readonly migrationCreatedAtParser: MigrationNameParser,
  ) {}

  async getPendingMigrations(
    migrations: readonly MigrationInterface[],
  ): Promise<readonly MigrationInterface[]> {
    const executedMigrations =
      //todo handle records over 1k
      await this.executedMigrationRepository.findAllExecutedMigrations();

    const mapper: Record<string, ExecutedMigration> = {};

    executedMigrations.forEach((executedMigration: ExecutedMigration): void => {
      mapper[executedMigration.name] = executedMigration;
    });

    return migrations
      .filter(
        (migration: MigrationInterface): boolean =>
          mapper[migration.getName()] === undefined,
      )
      .sort((a: MigrationInterface, b: MigrationInterface): number => {
        return (
          this.migrationCreatedAtParser.parse(a.getName()).createdAt.getTime() -
          this.migrationCreatedAtParser.parse(b.getName()).createdAt.getTime()
        );
      });
  }
}
