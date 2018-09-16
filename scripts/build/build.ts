import * as Listr from 'listr';

import { getPackages, preparePackage } from '../helper/helpers';

async function buildPackages() {
    const index = process.argv.indexOf('--package');

    let pack = null;
    if (index >= 0 && process.argv[index + 1]) {
        pack = process.argv[index + 1];
    }

    const tasks = [];

    // Add packages
    getPackages(pack).forEach(name => {
        tasks.push(preparePackage(name));
    });

    const listr = new Listr(tasks);
    await listr.run();
}

buildPackages();
