import { Global } from '@emotion/react';
import React, { FC } from 'react';

// Fonts
import InterBoldSvg from '@extension/fonts/Inter/Inter-Bold.svg';
import InterBoldTtf from '@extension/fonts/Inter/Inter-Bold.ttf';
import InterBoldWoff from '@extension/fonts/Inter/Inter-Bold.woff';
import InterBoldWoff2 from '@extension/fonts/Inter/Inter-Bold.woff2';
import InterRegularSvg from '@extension/fonts/Inter/Inter-Regular.svg';
import InterRegularTtf from '@extension/fonts/Inter/Inter-Regular.ttf';
import InterRegularWoff from '@extension/fonts/Inter/Inter-Regular.woff';
import InterRegularWoff2 from '@extension/fonts/Inter/Inter-Regular.woff2';

const Fonts: FC = () => (
  <Global
    styles={`
      /* latin */
      @font-face {
        font-family: 'Inter - Bold';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url(${InterBoldTtf}) format('truetype'),
         url(${InterBoldWoff2}) format('woff2'),
         url(${InterBoldWoff}) format('woff'),
         url(${InterBoldSvg}#Inter-Bold') format('svg');
      }
      /* latin */
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url(${InterRegularTtf}) format('truetype'),
         url(${InterRegularWoff2}) format('woff2'),
         url(${InterRegularWoff}) format('woff'),
         url(${InterRegularSvg}#Inter-Regular') format('svg');
      }
      `}
  />
);

export default Fonts;
