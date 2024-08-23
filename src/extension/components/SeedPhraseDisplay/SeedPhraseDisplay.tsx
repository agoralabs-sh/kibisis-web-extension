import { Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import React, { type FC } from 'react';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// types
import type { IProps } from './types';

const SeedPhraseDisplay: FC<IProps> = ({ _context, seedPhrase }) => {
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const textBackgroundColor = useTextBackgroundColor();

  return (
    <Grid gap={DEFAULT_GAP / 3} templateColumns="repeat(3, 1fr)" w="full">
      {seedPhrase.split(' ').map((value, index, array) => {
        const node = (
          <HStack
            alignItems="center"
            backgroundColor={textBackgroundColor}
            borderRadius="full"
            px={DEFAULT_GAP / 3}
            py={1}
            spacing={DEFAULT_GAP / 3}
            w="full"
          >
            {/*numbering*/}
            <Text as="b" color={defaultTextColor} fontSize="xs">
              {index + 1}
            </Text>

            {/*word*/}
            <Text color={defaultTextColor} fontSize="sm">
              {value}
            </Text>
          </HStack>
        );

        if (index >= array.length - 1) {
          return (
            <GridItem
              colEnd={2}
              colStart={2}
              key={`${_context}-seed-phrase-display-item-${index}`}
            >
              {node}
            </GridItem>
          );
        }

        return (
          <GridItem key={`${_context}-seed-phrase-display-item-${index}`}>
            {node}
          </GridItem>
        );
      })}
    </Grid>
  );
};

export default SeedPhraseDisplay;
