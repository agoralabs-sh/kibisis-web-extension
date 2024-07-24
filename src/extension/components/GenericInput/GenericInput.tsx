import { Input, InputGroup, Text, VStack } from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import React, { ChangeEvent, FC, useState } from 'react';
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

const GenericInput: FC<IProps> = ({
  characterLimit,
  error,
  id,
  label,
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
  const _validate = (value: string): string | null => {
    if (value.length <= 0 && required) {
      return t<string>('errors.inputs.required', { name: label });
    }

    if (validate) {
      return validate(value);
    }

    return null;
  };
  // handlers
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    let _charactersRemaining: number;
    let _error: string | null;
    let valueAsBytes: number;

    // clear error
    onError && onError(null);

    // validate any new errors
    _error = _validate(event.target.value);

    // update the character limit and add an error if the character limit is over
    if (characterLimit) {
      valueAsBytes = new TextEncoder().encode(event.target.value).byteLength;
      _charactersRemaining = characterLimit - valueAsBytes;

      setCharactersRemaining(_charactersRemaining);

      if (_charactersRemaining < 0 && !_error) {
        _error = t<string>('errors.inputs.tooLong');
      }
    }

    if (_error) {
      onError && onError(_error);
    }

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
          onChange={handleOnChange}
        />
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
