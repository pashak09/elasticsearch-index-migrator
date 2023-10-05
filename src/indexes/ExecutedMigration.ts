import { IndexDocumentInterface } from '@lib/indexes/IndexDocumentInterface';
import { assertIsString } from '@lib/utils/TypeAsserter';

export type MigrationDocumentSource = {
  readonly _id: string;
  readonly executedAt: string;
  readonly createdAt: string;
  readonly name: string;
};

export type CreateArgs = {
  readonly id: string;
  readonly executedAt: Date;
  readonly createdAt: Date;
  readonly name: string;
};

export type MigrationDocumentSourceJSON = Omit<MigrationDocumentSource, '_id'>;

export class ExecutedMigration implements IndexDocumentInterface {
  readonly id: string;

  readonly executedAt: Date;

  readonly createdAt: Date;

  readonly name: string;

  constructor({ id, name, executedAt, createdAt }: CreateArgs) {
    this.id = id;
    this.name = name;
    this.executedAt = new Date(executedAt);
    this.createdAt = new Date(createdAt);
  }

  getId(): string {
    return this.id;
  }

  toJSON(): MigrationDocumentSourceJSON {
    return {
      name: this.name,
      executedAt: this.executedAt.toISOString(),
      createdAt: this.createdAt.toISOString(),
    };
  }

  static createFromJSON(json: MigrationDocumentSource): ExecutedMigration {
    const { _id: id, name, executedAt, createdAt } = json;

    assertIsString(id);
    assertIsString(name);
    assertIsString(executedAt);
    assertIsString(createdAt);

    return new ExecutedMigration({
      id,
      name,
      executedAt: new Date(executedAt),
      createdAt: new Date(createdAt),
    });
  }
}
