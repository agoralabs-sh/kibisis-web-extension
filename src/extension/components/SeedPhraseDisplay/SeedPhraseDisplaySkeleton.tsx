import { Code, Grid, GridItem, Skeleton } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, { FC } from 'react';

const SeedPhraseDisplaySkeleton: FC = () => {
  return (
    <Grid gap={2} templateColumns="repeat(3, 1fr)" w="full">
      {Array.from({ length: 25 }, (_, index) => {
        if (index >= 24) {
          return (
            <GridItem
              colEnd={2}
              colStart={2}
              key={`seed-phrase-display-skeleton-item-${index}`}
            >
              <Skeleton>
                <Code w="full">
                  {faker.random.alpha({ casing: 'lower', count: 8 })}
                </Code>
              </Skeleton>
            </GridItem>
          );
        }

        return (
          <GridItem key={`seed-phrase-display-skeleton-item-${index}`}>
            <Skeleton>
              <Code w="full">
                {faker.random.alpha({ casing: 'lower', count: 8 })}
              </Code>
            </Skeleton>
          </GridItem>
        );
      })}
    </Grid>
  );
};

export default SeedPhraseDisplaySkeleton;
