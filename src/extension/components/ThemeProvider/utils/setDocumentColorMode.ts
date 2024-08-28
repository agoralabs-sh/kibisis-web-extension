import { ColorMode } from '@chakra-ui/react';

export default function setDocumentColorMode(colorMode: ColorMode): void {
  const darkClassName = 'chakra-ui-dark';
  const lightClassName = 'chakra-ui-light';

  // update the body tag
  switch (colorMode) {
    case 'dark':
      document.body.classList.add(darkClassName);
      document.body.classList.remove(darkClassName);
      break;
    case 'light':
    default:
      document.body.classList.add(lightClassName);
      document.body.classList.remove(lightClassName);

      break;
  }

  // update meta data
  document.documentElement.dataset.theme = colorMode;
  document.documentElement.style.colorScheme = colorMode;
}
