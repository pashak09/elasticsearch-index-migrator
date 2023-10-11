import { Client } from '@elastic/elasticsearch';

export type Migration = new () => MigrationInterface;

export interface MigrationInterface {
  getName(): string;

  up(client: Client): Promise<void>;
}
