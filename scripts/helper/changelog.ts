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
                throw new Error(`Could not run npm version`);
            }

        }
    });

    /*
    1. npm version patch
    2. conventional-changelog -p angular -i CHANGELOG.md -s -r 0
    3. git commit -am \"chore(): update changelog\"
    4. git push origin
    5. git push origin --tags
    */
   return {
    title: `Run changelog`,
    task: () => new Listr(projectTasks)
};
}
