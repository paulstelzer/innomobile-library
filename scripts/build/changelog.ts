import * as Listr from 'listr';

import { getPackages, publishPackage } from '../helper/helpers';
import { runChangelog } from '../helper/changelog';

async function publish() {
    const index = process.argv.indexOf('--release');

    let releaseType = 'patch';
    if (index >= 0 && process.argv[index + 1]) {
        const value = process.argv[index + 1];
        if (value === 'minor' || value === 'major') {
            releaseType = value;
        }
    }

    const tasks = [];

    // Run changelog and git
    tasks.push(runChangelog(releaseType));

    const listr = new Listr(tasks);
    await listr.run();
}

publish();
