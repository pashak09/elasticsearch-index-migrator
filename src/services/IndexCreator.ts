import { Client } from '@elastic/elasticsearch';
import { Document } from '@lib/indexes/IndexDocumentInterface';
import { IndexMapper } from '@lib/services/IndexMapper';
import { IndexNameResolver } from '@lib/services/IndexNameResolver';

export class IndexCreator {
  constructor(
    private readonly indexMapper: IndexMapper,
    private readonly indexNameResolver: IndexNameResolver,
    private readonly elasticsearchClient: Client,
  ) {}

  async createIndex(indexName: Document): Promise<void> {
    const result = await this.elasticsearchClient.indices.create({
      index: this.indexNameResolver.resolve(indexName),
      mappings: {
        dynamic: 'strict',
        properties: this.indexMapper.getDocumentFiledMapping(indexName),
      },
    });

    if (result.acknowledged === false) {
      throw new Error(
        'Elasticsearch server failed to acknowledge the index creation request',
      );
    }
  }
}
