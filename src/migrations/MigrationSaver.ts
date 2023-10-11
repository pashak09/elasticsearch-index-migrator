import { randomUUID } from 'crypto';

import { Client } from '@elastic/elasticsearch';
import { ExecutedMigration } from '@lib/indexes/ExecutedMigration';
import { MigrationInterface } from '@lib/migrations/MigrationInterface';
import { IndexNameResolver } from '@lib/services/IndexNameResolver';
import { MigrationNameParser } from '@lib/services/MigrationNameParser';

export class MigrationSaver {
  constructor(
    private readonly elasticsearchClient: Client,
    private readonly indexNameResolver: IndexNameResolver,
    private readonly migrationNameParser: MigrationNameParser,
  ) {}

  async save(migration: MigrationInterface): Promise<void> {
    const executedMigration = new ExecutedMigration({
      name: migration.getName(),
      executedAt: new Date(),
      createdAt: this.migrationNameParser.parse(migration.getName()).createdAt,
      id: randomUUID(),
    });

    const indexResult = await this.elasticsearchClient.index({
      id: executedMigration.getId(),
      index: this.indexNameResolver.resolve(ExecutedMigration),
      document: executedMigration.toJSON(),
    });

    if (indexResult.result !== 'created' && indexResult.result !== 'updated') {
      throw new Error(`Unexpected save response result: ${indexResult.result}`);
    }
  }
}
