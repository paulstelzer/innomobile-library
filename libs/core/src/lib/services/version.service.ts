import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class VersionService {

    constructor() { }

    /** Compare Versions */
    compareVersions(v1, v2) {
        const patch = /-([0-9A-Za-z-.]+)/;

        function split(v) {
            const temp = v.replace(/^v/, '').split('.');
            const arr = temp.splice(0, 2);
            arr.push(temp.join('.'));
            return arr;
        }

        function tryParse(v) {
            return isNaN(Number(v)) ? v : Number(v);
        }

        const s1 = split(v1);
        const s2 = split(v2);

        for (let i = 0; i < 3; i++) {
            const n1 = parseInt(s1[i] || 0, 10);
            const n2 = parseInt(s2[i] || 0, 10);

            if (n1 > n2) { return 1; }
            if (n2 > n1) { return -1; }
        }

        if ([s1[2], s2[2]].every(patch.test.bind(patch))) {
            const p1 = patch.exec(s1[2])[1].split('.').map(tryParse);
            const p2 = patch.exec(s2[2])[1].split('.').map(tryParse);

            for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
                if (p1[i] === undefined || typeof p2[i] === 'string' && typeof p1[i] === 'number') { return -1; }
                if (p2[i] === undefined || typeof p1[i] === 'string' && typeof p2[i] === 'number') { return 1; }

                if (p1[i] > p2[i]) { return 1; }
                if (p2[i] > p1[i]) { return -1; }
            }
        } else if ([s1[2], s2[2]].some(patch.test.bind(patch))) {
            return patch.test(s1[2]) ? -1 : 1;
        }

        return 0;
    }
}
