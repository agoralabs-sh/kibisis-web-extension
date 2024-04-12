/**
 * Utility function to extract the favicon URL.
 * @returns {string} the favicon URL or null if no favicon is found.
 * @see {@link https://stackoverflow.com/a/16844961}
 */
export default function extractFaviconUrl(): string | null {
  const links: HTMLCollectionOf<HTMLElementTagNameMap['link']> =
    document.getElementsByTagName('link');
  const iconUrls: string[] = [];

  for (const link of Array.from(links)) {
    const rel: string | null = link.getAttribute('rel');
    let href: string | null;
    let origin: string;

    // if the link is not an icon; a favicon, ignore
    if (!rel || !rel.toLowerCase().includes('icon')) {
      continue;
    }

    href = link.getAttribute('href');

    // if there is no href attribute there is no url
    if (!href) {
      continue;
    }

    // if it is an absolute url, just use it
    if (
      href.toLowerCase().indexOf('https:') === 0 ||
      href.toLowerCase().indexOf('http:') === 0
    ) {
      iconUrls.push(href);

      continue;
    }

    // if is an absolute url without a protocol,add the protocol
    if (href.toLowerCase().indexOf('//') === 0) {
      iconUrls.push(`${window.location.protocol}${href}`);

      continue;
    }

    // whats left is relative urls
    origin = `${window.location.protocol}//${window.location.host}`;

    // if there is no forward slash prepended, the favicon is relative to the page
    if (href.indexOf('/') === -1) {
      href = window.location.pathname
        .split('/')
        .map((value, index, array) =>
          !href || index < array.length - 1 ? value : href
        ) // replace the current path with the href
        .join('/');
    }

    iconUrls.push(`${origin}${href}`);
  }

  return (
    iconUrls.find((value) => value.match(/\.(jpg|jpeg|png|gif)$/i)) || // favour image files over ico
    iconUrls[0] ||
    null
  );
}
