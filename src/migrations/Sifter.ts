import { Migration } from '@lib/migrations/MigrationInterface';

export function isMigration(obj: unknown): obj is Migration {
  return (
    typeof obj === 'function' &&
    typeof obj.prototype?.getName === 'function' &&
    typeof obj.prototype?.up === 'function'
  );
}

type ObjectToAnalyse = Readonly<{
  fileName: string;
  objectClass: unknown;
}>;

export type SifterResult = Readonly<{
  fileName: string;
  objectClass: Migration;
}>;

export class Sifter {
  execute(objects: readonly ObjectToAnalyse[]): readonly SifterResult[] {
    const migrations: SifterResult[] = [];

    for (const object of objects) {
      if (!isMigration(object.objectClass)) {
        throw new Error(`Got non a migration file ${object.fileName}`);
      }

      migrations.push({
        objectClass: object.objectClass,
        fileName: object.fileName,
      });
    }

    return migrations;
  }
}
