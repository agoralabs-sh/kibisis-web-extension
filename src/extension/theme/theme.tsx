import { extendTheme } from '@chakra-ui/react';
import { Dict } from '@chakra-ui/utils';
import { StepsTheme as Steps } from 'chakra-ui-steps';

// themes
import Code from './Code';
import Tag from './Tag';

const theme: Dict = extendTheme({
  breakpoints: {
    sm: '40em',
    md: '52em',
    lg: '64em',
    xl: '80em',
  },
  colors: {
    algorand: {
      50: '#000000',
      100: '#000000',
      200: '#000000',
      300: '#000000',
      400: '#1a1a1a',
      500: '#333333',
      600: '#4d4d4d',
      700: '#666666',
      800: '#ffffff',
      900: '#ffffff',
    },
    primaryDark: {
      50: '#F6E9FF',
      100: '#F2DEFF',
      200: '#EED3FF',
      300: '#E9C8FF',
      400: '#E5BDFF',
      500: '#E0B0FF', // mauve
      600: '#C875FF',
      700: '#AF37FF',
      800: '#9500F8',
      900: '#6F00BA',
    },
    primaryLight: {
      50: '#F59CFD',
      100: '#F16AFD',
      200: '#EC39FC',
      300: '#E707FB',
      400: '#BC03CD',
      500: '#8D029B', // mauveine
      600: '#7B0285',
      700: '#66026F',
      800: '#520159',
      900: '#3D0143',
    },
    voi: {
      50: '#d9c7f7',
      100: '#bb9af1',
      200: '#ac84ee',
      300: '#9d6deb',
      400: '#8e57e8',
      500: '#702ae2',
      600: '#591abf',
      700: '#4e17a9',
      800: '#441492',
      900: '#2f0e65',
    },
    walletConnect: {
      500: '#3B99FC',
    },
  },
  components: {
    Code,
    Steps,
    Tag: Tag,
  },
  styles: {
    global: {
      ['*']: {
        ['-ms-overflow-style']: 'none' /*  hide scrollbar for  ie and edge */,
        scrollbarWidth: 'none', // hide scrollbar for firefox
      },
      // hide scrollbar for chrome, brave, safari and opera
      ['*::-webkit-scrollbar']: {
        display: 'none',
      },
    },
  },
});

export default theme;
