import { Icon, IconProps } from '@chakra-ui/react';
import { sanitize } from 'dompurify';
import React, { ReactElement } from 'react';

/**
 * Creates a Chakra UI icon from a data URI svg string, base64 encoded or not.
 * @param {string} dataUri - the svg data URI to parse.
 * @param {IconProps} props - [optional] icon props to pass to the parsed icon.
 * @returns {ReactElement | null} the SVG data URI parsed as a Chakra UI icon or null if it failed to parse the data URI.
 * @see {@link https://chakra-ui.com/docs/components/icon#creating-your-custom-icons}
 */
export default function createIconFromDataUri(
  dataUri: string,
  props?: IconProps
): ReactElement | null {
  let data: string | undefined;
  let document: Document;
  let parser: DOMParser;
  let svg: string;
  let viewBox: string | undefined;

  if (dataUri.indexOf('data:') !== 0) {
    return null;
  }

  if (dataUri.indexOf(',') < 0) {
    return null;
  }

  data = dataUri.split(',').pop();

  if (!data) {
    return null;
  }

  const [mimeType, encoding] = dataUri
    .substring('data:'.length, dataUri.indexOf(','))
    .split(';');

  if (mimeType !== 'image/svg+xml') {
    return null;
  }

  if (encoding === 'base64') {
    data = window.atob(data);
  }

  parser = new DOMParser();
  svg = decodeURIComponent(data);
  document = parser.parseFromString(
    sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } }),
    mimeType
  ); // sanitize for any nastiness
  viewBox =
    document.getElementsByTagName('svg').item(0)?.getAttribute('viewBox') ||
    undefined;

  return (
    <Icon viewBox={viewBox} {...props}>
      {Array.from(document.getElementsByTagName('path')).map((value, index) => (
        <path
          d={value.getAttribute('d') || undefined}
          fill="currentColor"
          key={`path-${index}`}
        />
      ))}
    </Icon>
  );
}
