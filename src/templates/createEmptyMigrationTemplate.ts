export function createEmptyMigrationTemplate(
  fileName: string,
  createdAt: Date,
  ext: string,
): string {
  if (ext === '.ts') {
    return `import { Client } from '@elastic/elasticsearch';
import { MigrationInterface } from 'elasticsearch-index-migrator';

export class ${fileName}${createdAt.getTime()} implements MigrationInterface {
  getName(): string {
    return '${fileName}-${createdAt.getTime()}';
  }

  getCreatedAt(): Date {
    return new Date('${createdAt.toISOString()}');
  }

  async up(client: Client): Promise<void> {
    return;
  }
}
`;
  }

  return `const { Client } = require('elastic/elasticsearch');

export class ${fileName}${createdAt.getTime()} {
  /**
   * @return {string}
   */
  getName() {
    return '${fileName}-${createdAt.getTime()}';
  }

  /**
   * @return {Date}
   */
  getCreatedAt() {
    return new Date('${createdAt.toISOString()}');
  }

  /**
   * @param {Client} client
   *
   * @return {void}
   */
  async up(client) {
    return;
  }
}`;
}
