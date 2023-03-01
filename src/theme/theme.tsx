import { extendTheme } from '@chakra-ui/react';
import { Dict } from '@chakra-ui/utils';

const theme: Dict = extendTheme({
  breakpoints: {
    sm: '40em',
    md: '52em',
    lg: '64em',
    xl: '80em',
  },
  colors: {
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
  },
  fonts: {
    heading: 'Outfit - Bold',
    body: 'Outfit',
  },
});

export default theme;
