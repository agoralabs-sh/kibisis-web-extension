import {
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { ChangeEvent, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoEye, IoEyeOff } from 'react-icons/io5';

// Errors
import { BaseExtensionError } from '../../errors';

// Components
import IconButton from '../IconButton';

// Hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import useSubTextColor from '../../hooks/useSubTextColor';

interface IProps {
  error: BaseExtensionError | null;
  hint: string | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const PasswordInput: FC<IProps> = ({
  error,
  hint,
  onChange,
  value,
}: IProps) => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const [show, setShow] = useState<boolean>(false);
  const handleShowHideClick = () => {
    setShow(!show);
  };

  return (
    <VStack alignItems="flex-start" w="full">
      <HStack alignItems="flex-end" justifyContent="space-between" w="full">
        <Text color={error ? 'red.300' : defaultTextColor} textAlign="left">
          {t<string>('labels.password')}
        </Text>
        {error && (
          <Text color="red.300" fontSize="xs" textAlign="right">
            {error.message}
          </Text>
        )}
      </HStack>
      <InputGroup size="md">
        <Input
          focusBorderColor={error ? 'red.300' : 'primary.500'}
          isInvalid={!!error}
          onChange={onChange}
          placeholder={t<string>('placeholders.enterPassword')}
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
      {hint && (
        <Text color={subTextColor} fontSize="xs" textAlign="left">
          {hint}
        </Text>
      )}
    </VStack>
  );
};

export default PasswordInput;
