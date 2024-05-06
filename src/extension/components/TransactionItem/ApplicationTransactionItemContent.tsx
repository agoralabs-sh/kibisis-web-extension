import { HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IApplicationTransaction } from '@extension/types';
import type { IProps } from './types';

const ApplicationTransactionItemContent: FC<
  IProps<IApplicationTransaction>
> = ({ transaction }) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();

  return (
    <>
      <VStack
        alignItems="flex-start"
        justifyContent="center"
        spacing={2}
        w="full"
      >
        {/*type*/}
        <Text color={defaultTextColor} fontSize="sm">
          {t<string>('headings.transaction', { context: transaction.type })}
        </Text>

        <HStack
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          w="full"
        >
          {/*app id*/}
          <Text color={subTextColor} fontSize="xs">
            {transaction.applicationId}
          </Text>

          {/*completed date*/}
          {transaction.completedAt && (
            <Text color={subTextColor} fontSize="xs">
              {new Date(transaction.completedAt).toLocaleString()}
            </Text>
          )}
        </HStack>
      </VStack>
    </>
  );
};

export default ApplicationTransactionItemContent;
