import * as Listr from 'listr';

import { getPackages, publishPackage } from '../helper/helpers';

async function publish() {
    const index = process.argv.indexOf('--package');

    let pack = null;
    if (index >= 0 && process.argv[index + 1]) {
        pack = process.argv[index + 1];
    }

    const tasks = [];

    // Add all packages to publish
    getPackages(pack).forEach((name: string) => {
      tasks.push(publishPackage(name));
    });

    const listr = new Listr(tasks);
    await listr.run();
}

publish();
