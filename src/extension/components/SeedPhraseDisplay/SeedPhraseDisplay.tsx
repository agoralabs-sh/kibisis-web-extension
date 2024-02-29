import { Code, Grid, GridItem } from '@chakra-ui/react';
import React, { FC } from 'react';

// types
import type { IProps } from './types';

const SeedPhraseDisplay: FC<IProps> = ({ seedPhrase }) => {
  return (
    <Grid gap={2} templateColumns="repeat(3, 1fr)" w="full">
      {seedPhrase.split(' ').map((value, index, array) => {
        if (index >= array.length - 1) {
          return (
            <GridItem
              colEnd={2}
              colStart={2}
              key={`create-new-account-page-mnemonic-phrase-item-${index}`}
            >
              <Code w="full">{value}</Code>
            </GridItem>
          );
        }

        return (
          <GridItem
            key={`create-new-account-page-mnemonic-phrase-item-${index}`}
          >
            <Code w="full">{value}</Code>
          </GridItem>
        );
      })}
    </Grid>
  );
};

export default SeedPhraseDisplay;
