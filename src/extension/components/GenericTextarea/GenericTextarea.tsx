import { Text, Textarea, VStack } from '@chakra-ui/react';
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
import Label from '@extension/components/Label';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

// utils
import validateInput from '@extension/utils/validateInput';

const GenericTextarea: FC<IProps> = ({
  characterLimit,
  error,
  id,
  label,
  onBlur,
  onChange,
  onError,
  required = false,
  validate,
  ...textAreaProps
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
  const handleOnBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
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
  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
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
      <Label
        error={error}
        inputID={_id}
        label={label}
        px={DEFAULT_GAP - 2}
        required={required}
      />

      {/*textarea*/}
      <Textarea
        resize="vertical"
        {...textAreaProps}
        borderRadius="md"
        focusBorderColor={error ? 'red.300' : primaryColor}
        id={_id}
        isInvalid={!!error}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
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
