import { ROOT_PATH, PLUGIN_PATHS } from "../build/helpers";
import { Logger } from "../logger";

import * as Queue from 'async-promise-queue';
import { exec } from 'child_process';

import { cpus } from 'os';

const PACKAGES = [];

function prepare() {
    // write plugin package.json files
    PLUGIN_PATHS.forEach((pluginPath: string) => {
        const pluginName = pluginPath.split(/[\/\\]+/).slice(-2)[0];
        PACKAGES.push(pluginName);
    });
}

async function build(ignoreErrors = false) {
    Logger.profile('Building');
    
    // upload 1 package per CPU thread at a time
    const worker = Queue.async.asyncify((pkg: any) =>
        new Promise<any>((resolve, reject) => {
            exec(
                `ng run @innomobile/${pkg}:build:production`,
                {
                    cwd: ROOT_PATH
                },
                (err, stdout) => {
                    console.log('Run', `ng run @innomobile/${pkg}:build:production`);
                    if (stdout) {
                        Logger.verbose(stdout.trim());
                        resolve(stdout);
                    }
                    if (err) {
                        if (!ignoreErrors) {
                            reject(err);
                        }
                    }
                });
        })
    );

    try {
        await Queue(worker, PACKAGES, cpus().length);
        Logger.info('Done building!');
    } catch (e) {
        Logger.error('Error building!');
        Logger.error(e);
    }
    Logger.profile('Building');
}

prepare();
build();