import { DocumentFieldMapping } from '@lib/services/IndexMapper';

export function executedMigrationFiledMapping(): DocumentFieldMapping {
  return {
    id: { type: 'keyword' },
    executedAt: { type: 'date' },
    createdAt: { type: 'date' },
    name: { type: 'keyword' },
  };
}
