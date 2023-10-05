import { stat } from 'node:fs/promises';

export async function isFileExists(path: string): Promise<boolean> {
  try {
    await stat(path);

    return true;
  } catch (error: unknown) {
    return false;
  }
}
