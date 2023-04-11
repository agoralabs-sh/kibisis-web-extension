import { extendTheme } from '@chakra-ui/react';
import { Dict } from '@chakra-ui/utils';
import { StepsTheme as Steps } from 'chakra-ui-steps';

// Themes
import Tag from './tag';

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
    primary: {
      50: '#8bb7ff',
      100: '#74a8ff',
      200: '#5d99ff',
      300: '#4588ff',
      400: '#2b77ff',
      500: '#0364ff',
      600: '#0256de',
      700: '#0248be',
      800: '#013b9e',
      900: '#012e80',
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
  },
  components: {
    Steps,
    Tag,
  },
  fonts: {
    heading: 'Outfit - Bold',
    body: 'Outfit',
  },
});

export default theme;
