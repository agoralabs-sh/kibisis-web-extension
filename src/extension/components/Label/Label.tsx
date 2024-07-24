import { HStack, Text } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// types
import type { IProps } from './types';

const Label: FC<IProps> = ({ error, inputID, label, required = false }) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();

  return (
    <HStack alignItems="flex-end" justifyContent="space-between" w="full">
      {/*label*/}
      <Text
        as={'label'}
        color={error ? 'red.300' : defaultTextColor}
        fontSize="xs"
        htmlFor={inputID}
        textAlign="left"
      >
        {`${label}${required ? '' : ` ${t<string>('labels.optional')}`}`}
      </Text>

      {/*error*/}
      {error && (
        <Text color="red.300" fontSize="xs" textAlign="right">
          {error}
        </Text>
      )}
    </HStack>
  );
};

export default Label;
