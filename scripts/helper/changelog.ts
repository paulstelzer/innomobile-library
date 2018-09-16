import * as Listr from 'listr';
import * as execa from 'execa';

import { ROOT_PATH } from './helpers';

export function runChangelog(releaseType) {
    const projectTasks = [];

    projectTasks.push({
        title: `Run npm version`,
        task: async () => {
            try {
                await execa('npm', ['version', releaseType], { cwd: ROOT_PATH });
            } catch (error) {
                throw new Error(`Could not run npm version - check if everything is commited`);
            }

        }
    });

    projectTasks.push({
        title: `Create changelog`,
        task: async () => {
            try {
                await execa.shell('conventional-changelog -p angular -i CHANGELOG.md -s -r 0', { cwd: ROOT_PATH });
            } catch (error) {
                throw new Error(`Could not create changelog`);
            }

        }
    });

    projectTasks.push({
        title: `Commit changelog`,
        task: async () => {
            try {
                await execa.shell('git commit -am \"chore(): update changelog\"', { cwd: ROOT_PATH });
            } catch (error) {
                throw new Error(`Could not commit changelog`);
            }
        }
    });

    projectTasks.push({
        title: 'Push origin',
        task: () => execa.stdout('git', ['push', 'origin']).then(result => {
            if (result !== '') {
                throw new Error('Could not push origin');
            }
        })
    });

    projectTasks.push({
        title: 'Push origin tags',
        task: () => execa.stdout('git', ['push', 'origin', '--tags']).then(result => {
            if (result !== '') {
                throw new Error('Could not push origin');
            }
        })
    });

    return {
        title: `Run changelog`,
        task: () => new Listr(projectTasks)
    };
}
