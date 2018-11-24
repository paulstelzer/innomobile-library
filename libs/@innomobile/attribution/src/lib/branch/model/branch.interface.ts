
import { BranchIoAnalytics } from '@ionic-native/branch-io/ngx';

export interface BranchShareOptions {
    subject: string;
    message: string;
    canonicalIdentifier: string;
    contentMetadata: {
        [x: string]: any;
    };
    analytics: BranchIoAnalytics;
    defaultLink?: string;
    ogData?: {
        [x: string]: any;
    };
    openShareScreen?(subject, message, defaultLink): any;
}
