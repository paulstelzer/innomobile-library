
import { BranchIoAnalytics } from '@ionic-native/branch-io/ngx';

/**
 * Share a link with Branch.io
 */
export interface BranchShareOptions {

    /**
     * Subject of sharing message
     */
    subject: string;

    /**
     * Text of sharing message
     */
    message: string;

    /**
     * Important for iOS
     */
    canonicalIdentifier: string;

    /**
     * Branch.io content metadata to send with link
     */
    contentMetadata: {
        [x: string]: any;
    };
    /**
     * Branch.io analytics data
     */
    analytics: BranchIoAnalytics;
    /**
     * PWA only: If branch fails to create the link
     */
    defaultLink?: string;

    /**
     * OG data like image, title, description
     */
    ogData?: {
        [x: string]: any;
    };
    /**
     * For Web: What should happen after creating the link - define the ShareScreen
     * @param subject Subject of the message
     * @param message Message
     * @param defaultLink Default link if branch fails
     */
    openShareScreen?(subject, message, defaultLink): any;
}
