import { Global } from '@emotion/react';
import React, { FC } from 'react';

// Fonts
import SourceCodeProBoldSvg from '@extension/fonts/SourceCodePro/SourceCodePro-Bold.svg';
import SourceCodeProBoldTtf from '@extension/fonts/SourceCodePro/SourceCodePro-Bold.ttf';
import SourceCodeProBoldWoff from '@extension/fonts/SourceCodePro/SourceCodePro-Bold.woff';
import SourceCodeProBoldWoff2 from '@extension/fonts/SourceCodePro/SourceCodePro-Bold.woff2';
import SourceCodeProRegularSvg from '@extension/fonts/SourceCodePro/SourceCodePro-Regular.svg';
import SourceCodeProRegularTtf from '@extension/fonts/SourceCodePro/SourceCodePro-Regular.ttf';
import SourceCodeProRegularWoff from '@extension/fonts/SourceCodePro/SourceCodePro-Regular.woff';
import SourceCodeProRegularWoff2 from '@extension/fonts/SourceCodePro/SourceCodePro-Regular.woff2';

const Fonts: FC = () => (
  <Global
    styles={`
      /* latin */
      @font-face {
        font-family: 'SourceCodePro - Bold';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url(${SourceCodeProBoldTtf}) format('truetype'),
         url(${SourceCodeProBoldWoff2}) format('woff2'),
         url(${SourceCodeProBoldWoff}) format('woff'),
         url(${SourceCodeProBoldSvg}#SourceCodePro-Bold') format('svg');
      }
      /* latin */
      @font-face {
        font-family: 'SourceCodePro';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url(${SourceCodeProRegularTtf}) format('truetype'),
         url(${SourceCodeProRegularWoff2}) format('woff2'),
         url(${SourceCodeProRegularWoff}) format('woff'),
         url(${SourceCodeProRegularSvg}#SourceCodePro-Regular') format('svg');
      }
      `}
  />
);

export default Fonts;
