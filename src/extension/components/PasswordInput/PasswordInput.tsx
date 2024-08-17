import {
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  MutableRefObject,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { IoEye, IoEyeOff } from 'react-icons/io5';

// components
import IconButton from '@extension/components/IconButton';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

const PasswordInput: FC<IProps> = ({
  disabled,
  error,
  hint,
  inputRef,
  onKeyUp,
  onChange,
  value,
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  // state
  const [show, setShow] = useState<boolean>(false);
  // misc
  const inputId: string = 'password-input';
  // handlers
  const handleShowHideClick = () => {
    setShow(!show);
  };

  return (
    <VStack alignItems="flex-start" w="full">
      <HStack alignItems="flex-end" justifyContent="space-between" w="full">
        {/*label*/}
        <Text
          as={'label'}
          color={error ? 'red.300' : defaultTextColor}
          htmlFor={inputId}
          textAlign="left"
        >
          {t<string>('labels.password')}
        </Text>

        {/*error*/}
        {error && (
          <Text color="red.300" fontSize="xs" textAlign="right">
            {error}
          </Text>
        )}
      </HStack>

      {/*input*/}
      <InputGroup size="md">
        <Input
          autoComplete="current-password"
          focusBorderColor={error ? 'red.300' : primaryColor}
          id={inputId}
          isDisabled={disabled}
          isInvalid={!!error}
          name="password"
          onChange={onChange}
          onKeyUp={onKeyUp}
          placeholder={t<string>('placeholders.enterPassword')}
          ref={inputRef}
          type={show ? 'text' : 'password'}
          value={value}
        />

        <InputRightElement>
          <IconButton
            aria-label="Eye open and closed"
            icon={show ? IoEye : IoEyeOff}
            onClick={handleShowHideClick}
            size="sm"
            variant="ghost"
          />
        </InputRightElement>
      </InputGroup>

      {/*info*/}
      {hint && (
        <Text color={subTextColor} fontSize="xs" textAlign="left">
          {hint}
        </Text>
      )}
    </VStack>
  );
};

export default PasswordInput;
