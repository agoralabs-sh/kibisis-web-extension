import {
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import React, {
  type ChangeEvent,
  type FocusEvent,
  type FC,
  useState,
} from 'react';
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

// utils
import validateInput from '@extension/utils/validateInput';

const GenericInput: FC<IProps> = ({
  characterLimit,
  error,
  id,
  informationText,
  label,
  onBlur,
  onChange,
  onError,
  required = false,
  validate,
  ...inputProps
}) => {
  const { t } = useTranslation();
  // hooks
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  // state
  const [charactersRemaining, setCharactersRemaining] = useState<number | null>(
    characterLimit || null
  );
  // misc
  const _id = id || encodeBase64URLSafe(randomBytes(6));
  // handlers
  const handleOnBlur = (event: FocusEvent<HTMLInputElement>) => {
    onError &&
      onError(
        validateInput({
          characterLimit,
          field: label,
          t,
          required,
          validate,
          value: event.target.value,
        })
      );

    return onBlur && onBlur(event);
  };
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    let byteLength: number;

    // update the characters remaining
    if (characterLimit) {
      byteLength = new TextEncoder().encode(value).byteLength;

      setCharactersRemaining(characterLimit - byteLength);
    }

    onError &&
      onError(
        validateInput({
          characterLimit,
          field: label,
          t,
          required,
          validate,
          value,
        })
      );

    return onChange && onChange(event);
  };

  return (
    <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
      <Label error={error} inputID={_id} label={label} required={required} />

      {/*input*/}
      <InputGroup size="md">
        <Input
          {...inputProps}
          focusBorderColor={error ? 'red.300' : primaryColor}
          id={_id}
          isInvalid={!!error}
          h={INPUT_HEIGHT}
          onBlur={handleOnBlur}
          onChange={handleOnChange}
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
