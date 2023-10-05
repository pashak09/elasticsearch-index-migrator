import { estypes } from '@elastic/elasticsearch';
import { IndexFiledMappingMap } from '@lib/indexes';
import { Document } from '@lib/indexes/IndexDocumentInterface';

export type DocumentFieldMapping = Record<
  estypes.PropertyName,
  estypes.MappingProperty
>;

export class IndexMapper {
  constructor(private readonly indexFiledMappingMap: IndexFiledMappingMap) {}

  getDocumentFiledMapping(document: Document): DocumentFieldMapping {
    const mapping = this.indexFiledMappingMap[document.name];

    if (mapping === undefined) {
      throw new Error(
        `Cannot find mapping fields for a document "${document.name}"`,
      );
    }

    return mapping();
  }
}
