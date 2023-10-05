import { Client } from '@elastic/elasticsearch';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import {
  ExecutedMigration,
  MigrationDocumentSource,
} from '@lib/indexes/ExecutedMigration';
import { IndexNameResolver } from '@lib/services/IndexNameResolver';

export class ExecutedMigrationRepository {
  private readonly indexName: string;

  constructor(
    private readonly elasticsearchClient: Client,
    indexNameResolver: IndexNameResolver,
  ) {
    this.indexName = indexNameResolver.resolve(ExecutedMigration);
  }

  async checkIndexExists(): Promise<boolean> {
    return this.elasticsearchClient.indices.exists({
      index: this.indexName,
    });
  }

  async findAllExecutedMigrations(): Promise<readonly ExecutedMigration[]> {
    const results =
      await this.elasticsearchClient.search<MigrationDocumentSource>({
        index: this.indexName,
        size: 10000,
      });

    return results.hits.hits.map(
      (hit: SearchHit<MigrationDocumentSource>): ExecutedMigration => {
        if (hit._source === undefined) {
          throw new Error('Elasticsearch returned hit without _source');
        }

        return ExecutedMigration.createFromJSON({
          ...hit._source,
          _id: hit._id,
        });
      },
    );
  }
}
