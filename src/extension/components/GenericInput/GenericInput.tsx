import {
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { randomBytes } from 'tweetnacl';

// components
import InformationIcon from '@extension/components/InformationIcon';
import Label from '@extension/components/Label';

// constants
import { DEFAULT_GAP, INPUT_HEIGHT } from '@extension/constants';

// hooks
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

const GenericInput: FC<IProps> = ({
  charactersRemaining,
  error,
  id,
  informationText,
  label,
  required = false,
  validate,
  ...inputProps
}) => {
  const { t } = useTranslation();
  // hooks
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  // misc
  const _id = id || encodeBase64URLSafe(randomBytes(6));

  return (
    <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
      {/*label*/}
      <Label
        error={error}
        inputID={_id}
        label={label}
        px={DEFAULT_GAP - 2}
        required={required}
      />

      {/*input*/}
      <InputGroup size="md">
        <Input
          {...inputProps}
          borderRadius="full"
          focusBorderColor={error ? 'red.300' : primaryColor}
          id={_id}
          isInvalid={!!error}
          h={INPUT_HEIGHT}
          w="full"
        />

        {informationText && (
          <InputRightElement h={INPUT_HEIGHT}>
            <Stack alignItems="center" h={INPUT_HEIGHT} justifyContent="center">
              <InformationIcon
                ariaLabel="Information icon"
                tooltipLabel={informationText}
              />
            </Stack>
          </InputRightElement>
        )}
      </InputGroup>

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

export default GenericInput;
