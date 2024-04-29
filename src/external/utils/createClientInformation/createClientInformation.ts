// types
import type { IClientInformation } from '@common/types';

// utils
import extractFaviconURL from '@external/utils/extractFaviconURL';

/**
 * Convenience function create the client information content for the webpage.
 * * appName - uses the content of the "application-name" meta tag, if this doesn't exist, it falls back to the document title.
 * * description - uses the content of the "description" meta tag, if it exists.
 * * host - uses host of the web page.
 * * iconUrl - uses the favicon of the web page.
 * @returns {IClientInformation} the client information.
 */
export default function createClientInformation(): IClientInformation {
  return {
    appName:
      document
        .querySelector('meta[name="application-name"]')
        ?.getAttribute('content') || document.title,
    description:
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content') || null,
    host: `${window.location.protocol}//${window.location.host}`,
    iconUrl: extractFaviconURL(),
  };
}
