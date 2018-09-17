import * as fs from 'fs-extra';
import * as path from 'path';
import * as Listr from 'listr';
import * as execa from 'execa';
import { merge } from 'lodash';

// tslint:disable-next-line:no-var-requires
export const MAIN_PACKAGE_JSON = require('../../package.json');
export const VERSION = MAIN_PACKAGE_JSON.version;

export const ROOT_PATH = path.resolve(__dirname, '../../');

export const PLUGINS_ROOT = path.join(ROOT_PATH, 'libs/@innomobile/');
export const PLUGIN_PATHS = fs.readdirSync(PLUGINS_ROOT).map(d => path.join(PLUGINS_ROOT, d, 'package.json'));

export const DEST_ROOT = path.join(ROOT_PATH, 'dest/@innomobile/');
export const DEST_PATHS = fs.readdirSync(DEST_ROOT).map(d => path.join(DEST_ROOT, d, 'package.json'));

export function getPackages(returnOnly: string = null) {
    let PACKAGES = [];

    // write plugin package.json files
    PLUGIN_PATHS.forEach((pluginPath: string) => {
        const pluginName = pluginPath.split(/[\/\\]+/).slice(-2)[0];
        PACKAGES.push(pluginName);
    });
    PACKAGES = PACKAGES.filter(element => element !== 'core');
    PACKAGES.unshift('core');

    if (returnOnly) {
        const index = PACKAGES.indexOf(returnOnly);
        if (index >= 0) {
            PACKAGES = [];
            PACKAGES.push(returnOnly);
        }
    }

    return PACKAGES;
}

export function publishPackage(name) {
    const projectTasks = [];

    projectTasks.push({
        title: `Add Version`,
        task: async () => {
            changeJson(name);
        }
    });

    projectTasks.push({
        title: `Publish package`,
        task: async () => {
            const folder = path.join(DEST_ROOT, name);

            try {
                await execa('npm', ['publish'], { cwd: folder });
            } catch (error) {
                throw new Error(`Could not publish ${name}`);
            }

        }
    });

    return {
        title: `[@innomobile/${name}]`,
        task: () => new Listr(projectTasks)
    };
}

export function preparePackage(name) {
    const projectTasks = [];

    projectTasks.push({
        title: `Build package`,
        task: async () => {
            try {
                const data = await execa.shell(`ng run @innomobile/${name}:build:production`, { cwd: ROOT_PATH });
            } catch (error) {
                throw new Error(`Could not build ${name}`);
            }
        }
    });

    return {
        title: `[@innomobile/${name}]`,
        task: () => new Listr(projectTasks)
    };
}

export function changeJson(name) {
    const packageJsonPath = path.join(DEST_ROOT, name, 'package.json');
    const packageJson = fs.readJSONSync(packageJsonPath);
    const packageJsonContents = mergePackageJsonContent(packageJson, VERSION);
    return fs.writeJSONSync(packageJsonPath, packageJsonContents);
}

function mergePackageJsonContent(original, version) {
    return merge(original, {
        version: version,
        author: 'Paul Stelzer',
        license: 'MIT',
        repository: {
            type: 'git',
            url: 'https://github.com/paulstelzer/innomobile-library.git'
        }
    });
}
