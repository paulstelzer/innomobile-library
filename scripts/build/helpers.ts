import * as fs from 'fs-extra';
import * as path from 'path';

export const ROOT_PATH = path.resolve(__dirname, '../../');

export const PLUGINS_ROOT = path.join(ROOT_PATH, 'libs/@innomobile/');
export const PLUGIN_PATHS = fs.readdirSync(PLUGINS_ROOT).map(d => path.join(PLUGINS_ROOT, d, 'package.json'));

export const DEST_ROOT = path.join(ROOT_PATH, 'dest/@innomobile/');
export const DEST_PATHS = fs.readdirSync(PLUGINS_ROOT).map(d => path.join(DEST_ROOT, d, 'package.json'));