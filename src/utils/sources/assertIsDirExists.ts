import fs from 'node:fs/promises';

/**
 * @throws Error
 */
export async function assertIsDirExists(path: string): Promise<void> {
  try {
    const stats = await fs.stat(path);

    if (stats.isDirectory() === true) {
      return;
    }
  } catch (error: unknown) {
    throw new Error(`Dir ${path} doesn't exist`);
  }

  throw new Error(`${path} is not a dir`);
}
