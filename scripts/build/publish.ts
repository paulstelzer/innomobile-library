import * as Listr from 'listr';

import { getPackages, preparePackage, publishPackage } from '../helper/helpers';
import { runChangelog } from '../helper/changelog';

async function publish() {
    let releaseType = 'patch';
    if (process.argv.indexOf('minor')) {
        releaseType = 'minor';
    } else if (process.argv.indexOf('major')) {
        releaseType = 'major';
    }

    const tasks = [];

    // Step 1: Run changelog and git
    tasks.push(runChangelog(releaseType));

    // Step 2: Add all packages to publish
    getPackages('core').forEach(name => {
        // tasks.push(publishPackage(name));
    });

    const listr = new Listr(tasks);
    await listr.run();
}

publish();
