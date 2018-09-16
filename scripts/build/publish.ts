import * as Listr from 'listr';

import { getPackages, publishPackage } from '../helper/helpers';
import { runChangelog } from '../helper/changelog';

async function publish() {
    const index = process.argv.indexOf('--package');

    let releaseType = 'patch';
    if (index >= 0 && process.argv[index + 1]) {
        const value = process.argv[index + 1];
        if (value === 'minor' || value === 'major') {
            releaseType = value;
        }
    }

    const tasks = [];

    // Step 1: Run changelog and git
    tasks.push(runChangelog(releaseType));

    // Step 2: Add all packages to publish
    getPackages('core').forEach(name => {
        tasks.push(publishPackage(name));
    });

    const listr = new Listr(tasks);
    await listr.run();
}

publish();
