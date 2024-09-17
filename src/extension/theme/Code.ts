import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const Code = defineStyleConfig({
  variants: {
    subtle: defineStyle({
      fontFamily: 'SourceCodePro',
    }),
  },
});

export default Code;
