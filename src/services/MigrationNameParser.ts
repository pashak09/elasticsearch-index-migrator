type ParsedData = Readonly<{
  createdAt: Date;
  name: string;
}>;

export class MigrationNameParser {
  /**
   * @throws Error
   */
  parse(value: string): ParsedData {
    const [timestamp, name] = value.split('-');

    if (timestamp === undefined || name === undefined) {
      throw new Error(
        `The "${value}" value file must have a valid format "{timestamp}-migrationName. An example "1696532393970-Migration"`,
      );
    }

    if (
      Number.isNaN(parseInt(timestamp)) === true ||
      Number.isNaN(Date.parse(timestamp)) === true
    ) {
      throw new Error(
        `The first part of the "${value}" value should be a valid timestamp"`,
      );
    }

    return { createdAt: new Date(timestamp), name };
  }
}
