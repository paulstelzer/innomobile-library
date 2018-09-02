import * as Queue from 'async-promise-queue';
import { exec } from 'child_process';
import * as fs from 'fs-extra';
import { merge } from 'lodash';
import { cpus } from 'os';
import * as path from 'path';

import { DEST_PATHS, ROOT_PATH } from '../build/helpers';
import { Logger } from '../logger';

// tslint:disable-next-line:no-var-requires
const MAIN_PACKAGE_JSON = require('../../package.json');
const VERSION = MAIN_PACKAGE_JSON.version;
const FLAGS = '--access public';

const DIST = path.resolve(ROOT_PATH, 'dest/@innomobile');

const PACKAGES = [];

/*
const PLUGIN_PEER_DEPENDENCIES = {
  "@angular/common": "^6.0.0",
  "@angular/core": "^6.0.0"
};*/

function mergePackageJsonContent(original) {
  return merge(original, {
    version: VERSION,
    author: 'Paul Stelzer',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'https://github.com/paulstelzer/innomobile-library.git'
    }
  });
}

function writePackageJson(data: any, dir: string) {
  const filePath = path.resolve(dir, 'package.json');
  fs.writeJSONSync(filePath, data);
  PACKAGES.push(dir);
}

function prepare() {
  // write plugin package.json files
  DEST_PATHS.forEach((pluginPath: string) => {
    const pluginName = pluginPath.split(/[\/\\]+/).slice(-2)[0];
    const pluginPackageJson = require(pluginPath);
    const packageJsonContents = mergePackageJsonContent(pluginPackageJson);
    const dir = path.resolve(DIST, pluginName);
    writePackageJson(packageJsonContents, dir);
  });
}

async function publish(ignoreErrors = false) {
  Logger.profile('Publishing');
  // upload 1 package per CPU thread at a time
  const worker = Queue.async.asyncify((pkg: any) =>
    new Promise<any>((resolve, reject) => {
      exec(`npm publish ${pkg} ${FLAGS}`, (err, stdout) => {
        if (stdout) {
          Logger.verbose(stdout.trim());
          resolve(stdout);
        }
        if (err) {
          if (!ignoreErrors) {
            if (
              err.message.includes(
                'You cannot publish over the previously published version'
              )
            ) {
              Logger.verbose('Ignoring duplicate version error.');
              return resolve();
            }
            reject(err);
          }
        }
      });
    })
  );

  try {
    await Queue(worker, PACKAGES, cpus().length);
    Logger.info('Done publishing!');
  } catch (e) {
    Logger.error('Error publishing!');
    Logger.error(e);
  }
  Logger.profile('Publishing');
}

prepare();
publish();