import { dirname } from "path";
import { fileURLToPath } from "url";

/**
 * @module fs
 * @deprecated This module is set for deprecation.
 */

import fs from "fs-extra";
const {
  appendFileSync,
  copySync,
  ensureFileSync,
  ensureDirSync,
  existsSync,
  readFileSync,
  readJSONSync,
  removeSync,
  renameSync,
  writeFileSync,
  writeJsonSync,
} = fs;
export {
  appendFileSync,
  copySync,
  ensureDirSync,
  ensureFileSync,
  existsSync,
  readFileSync,
  readJSONSync,
  removeSync,
  renameSync,
  writeFileSync,
  writeJsonSync,
};

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const rewriteFileSync = (
  path: string,
  search: string,
  replace: string
) => {
  if (!existsSync(path)) return;

  const file = readFileSync(path).toString();
  writeFileSync(path, file.replaceAll(search, replace));
};
