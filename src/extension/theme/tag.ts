import { tagAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tagAnatomy.keys);
const Tag = defineMultiStyleConfig({
  sizes: {
    xs: definePartsStyle({
      container: defineStyle({
        px: 1,
        py: 0.5,
      }),
      label: defineStyle({
        fontSize: '0.5rem',
        p: 0,
      }),
    }),
  },
});

export default Tag;
