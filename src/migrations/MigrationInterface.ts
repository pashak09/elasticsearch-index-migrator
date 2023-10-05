import { Client } from '@elastic/elasticsearch';

export type Migration = new () => MigrationInterface;

export interface MigrationInterface {
  getName(): string;
  getCreatedAt(): Date;

  up(client: Client): Promise<void>;
}
