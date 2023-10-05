import { executedMigrationFiledMapping } from '@lib/indexes/ExecutedMigrationFiledMapping';
import { DocumentFieldMapping } from '@lib/services/IndexMapper';

export type IndexFiledMappingMap = Record<string, () => DocumentFieldMapping>;

export const indexesMap: IndexFiledMappingMap = {
  ExecutedMigration: executedMigrationFiledMapping,
};
