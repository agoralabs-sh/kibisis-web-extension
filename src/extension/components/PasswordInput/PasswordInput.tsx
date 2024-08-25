import {
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import React, { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { randomBytes } from 'tweetnacl';

// components
import IconButton from '@extension/components/IconButton';
import Label from '@extension/components/Label';

// constants
import { DEFAULT_GAP, INPUT_HEIGHT } from '@extension/constants';

// hooks
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

const PasswordInput: FC<IProps> = ({
  disabled,
  error,
  hint,
  id,
  inputRef,
  onKeyUp,
  onChange,
  value,
}) => {
  const { t } = useTranslation();
  // hooks
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  // state
  const [show, setShow] = useState<boolean>(false);
  // misc
  const _id = id || encodeBase64URLSafe(randomBytes(6));
  // handlers
  const handleShowHideClick = () => setShow(!show);

  return (
    <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
      {/*label*/}
      <Label
        error={error}
        inputID={_id}
        label={t<string>('labels.password')}
        px={DEFAULT_GAP - 2}
        required={true}
      />

      {/*input*/}
      <InputGroup size="md">
        <Input
          autoComplete="current-password"
          borderRadius="full"
          focusBorderColor={error ? 'red.300' : primaryColor}
          h={INPUT_HEIGHT}
          id={_id}
          isDisabled={disabled}
          isInvalid={!!error}
          name="password"
          onChange={onChange}
          onKeyUp={onKeyUp}
          placeholder={t<string>('placeholders.enterPassword')}
          pr={DEFAULT_GAP * 2}
          ref={inputRef}
          type={show ? 'text' : 'password'}
          value={value}
          w="full"
        />

        <InputRightElement h={INPUT_HEIGHT}>
          <IconButton
            aria-label={t<string>('labels.showHidePassword')}
            borderRadius="full"
            disabled={disabled}
            icon={show ? IoEye : IoEyeOff}
            mr={DEFAULT_GAP / 3}
            onClick={handleShowHideClick}
            size="md"
            variant="ghost"
          />
        </InputRightElement>
      </InputGroup>

      {/*info*/}
      {hint && (
        <Text
          color={subTextColor}
          fontSize="xs"
          px={DEFAULT_GAP - 2}
          textAlign="left"
          w="full"
        >
          {hint}
        </Text>
      )}
    </VStack>
  );
};

export default PasswordInput;
