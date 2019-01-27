import { Kevast } from 'kevast';
import { KevastFile } from 'kevast-file';
import { resolve } from 'path';

export const STORE_FILENAME = '__STORE__.json';

const filePath = resolve(__dirname, '../', STORE_FILENAME);
const kevast = new Kevast(new KevastFile(filePath));

export interface File {
  origin: string;
  path: string;
  mimeType: string;
  hits: number;
}

export async function set(files: File | File[]) {
  if (!(files instanceof Array)) {
    files = [files];
  }
  const result = files.map((file) => ({
    key: file.path,
    value: JSON.stringify(file),
  }));
  await kevast.bulkSet(result);
}

export async function get(path: string): Promise<File | undefined> {
  const result = await kevast.get(path);
  if (result === undefined) {
    return result;
  } else {
    return JSON.parse(result);
  }
}

export async function remove(paths: string | string[]) {
  if (!(paths instanceof Array)) {
    paths = [paths];
  }
  await kevast.bulkRemove(paths);
}
