import { basename, resolve } from 'node:path';

import { glob } from 'glob';

type ImportResult = Readonly<{
  fileName: string;
  objectClass: unknown;
}>;

export class FileLoader {
  async import(
    rootDir: string,
    filePatterns: readonly string[],
  ): Promise<readonly ImportResult[]> {
    const files = await this.matchGlob(rootDir, filePatterns);

    return Promise.all(
      files.map(async (path: string): Promise<ImportResult> => {
        return {
          fileName: basename(path),
          objectClass: Object.values(await import(path))[0] ?? {},
        };
      }),
    );
  }

  private async matchGlob(
    rootDir: string,
    filePatterns: readonly string[],
  ): Promise<string[]> {
    return glob(
      filePatterns.map((pattern: string): string => resolve(rootDir, pattern)),
      {
        windowsPathsNoEscape: true,
      },
    );
  }
}
