import { Global } from '@emotion/react';
import React, { FC } from 'react';

// Fonts
import AnonymousProBoldSvg from '@extension/fonts/AnonymousPro/AnonymousPro-Bold.svg';
import AnonymousProBoldTtf from '@extension/fonts/AnonymousPro/AnonymousPro-Bold.ttf';
import AnonymousProBoldWoff from '@extension/fonts/AnonymousPro/AnonymousPro-Bold.woff';
import AnonymousProBoldWoff2 from '@extension/fonts/AnonymousPro/AnonymousPro-Bold.woff2';
import AnonymousProRegularSvg from '@extension/fonts/AnonymousPro/AnonymousPro-Regular.svg';
import AnonymousProRegularTtf from '@extension/fonts/AnonymousPro/AnonymousPro-Regular.ttf';
import AnonymousProRegularWoff from '@extension/fonts/AnonymousPro/AnonymousPro-Regular.woff';
import AnonymousProRegularWoff2 from '@extension/fonts/AnonymousPro/AnonymousPro-Regular.woff2';

const Fonts: FC = () => (
  <Global
    styles={`
      /* latin */
      @font-face {
        font-family: 'AnonymousPro - Bold';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url(${AnonymousProBoldTtf}) format('truetype'),
         url(${AnonymousProBoldWoff2}) format('woff2'),
         url(${AnonymousProBoldWoff}) format('woff'),
         url(${AnonymousProBoldSvg}#AnonymousPro-Bold') format('svg');
      }
      /* latin */
      @font-face {
        font-family: 'AnonymousPro';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url(${AnonymousProRegularTtf}) format('truetype'),
         url(${AnonymousProRegularWoff2}) format('woff2'),
         url(${AnonymousProRegularWoff}) format('woff'),
         url(${AnonymousProRegularSvg}#AnonymousPro-Regular') format('svg');
      }
      `}
  />
);

export default Fonts;
