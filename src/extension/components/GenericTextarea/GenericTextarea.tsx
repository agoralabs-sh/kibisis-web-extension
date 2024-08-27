import { Text, Textarea, VStack } from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import React, { type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { randomBytes } from 'tweetnacl';

// components
import Label from '@extension/components/Label';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

const GenericTextarea: FC<IProps> = ({
  charactersRemaining,
  error,
  id,
  label,
  required = false,
  validate,
  ...textAreaProps
}) => {
  const { t } = useTranslation();
  // hooks
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  // misc
  const _id = id || encodeBase64URLSafe(randomBytes(6));

  return (
    <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
      <Label
        error={error}
        inputID={_id}
        label={label}
        px={DEFAULT_GAP - 2}
        required={required}
      />

      {/*textarea*/}
      <Textarea
        {...textAreaProps}
        borderRadius="md"
        focusBorderColor={error ? 'red.300' : primaryColor}
        id={_id}
        isInvalid={!!error}
        w="full"
      />

      {/*character limit*/}
      {typeof charactersRemaining === 'number' && (
        <Text
          color={charactersRemaining >= 0 ? subTextColor : 'red.300'}
          fontSize="xs"
          px={DEFAULT_GAP - 2}
          textAlign="right"
          w="full"
        >
          {t<string>('captions.charactersRemaining', {
            amount: charactersRemaining,
          })}
        </Text>
      )}
    </VStack>
  );
};

export default GenericTextarea;
