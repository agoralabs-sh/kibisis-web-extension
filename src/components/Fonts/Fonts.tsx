import { Global } from '@emotion/react';
import React, { FC } from 'react';

// Fonts
import OutfitBoldSvg from '../../fonts/Outfit/Outfit-Bold.svg';
import OutfitBoldTtf from '../../fonts/Outfit/Outfit-Bold.ttf';
import OutfitBoldWoff from '../../fonts/Outfit/Outfit-Bold.woff';
import OutfitBoldWoff2 from '../../fonts/Outfit/Outfit-Bold.woff2';
import OutfitRegularSvg from '../../fonts/Outfit/Outfit-Regular.svg';
import OutfitRegularTtf from '../../fonts/Outfit/Outfit-Regular.ttf';
import OutfitRegularWoff from '../../fonts/Outfit/Outfit-Regular.woff';
import OutfitRegularWoff2 from '../../fonts/Outfit/Outfit-Regular.woff2';

const Fonts: FC = () => (
  <Global
    styles={`
      /* latin */
      @font-face {
        font-family: 'Outfit - Bold';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url(${OutfitBoldTtf}) format('truetype'),
         url(${OutfitBoldWoff2}) format('woff2'),
         url(${OutfitBoldWoff}) format('woff'),
         url(${OutfitBoldSvg}#Outfit-Bold') format('svg');
      }
      /* latin */
      @font-face {
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url(${OutfitRegularTtf}) format('truetype'),
         url(${OutfitRegularWoff2}) format('woff2'),
         url(${OutfitRegularWoff}) format('woff'),
         url(${OutfitRegularSvg}#Outfit-Regular') format('svg');
      }
      `}
  />
);

export default Fonts;
