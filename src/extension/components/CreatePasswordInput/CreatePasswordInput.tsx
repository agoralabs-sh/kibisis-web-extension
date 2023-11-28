import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import zxcvbn from 'zxcvbn';
import React, { ChangeEvent, FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { IoEye, IoEyeOff } from 'react-icons/io5';

// components
import DocumentModal from '@extension/components/DocumentModal';
import IconButton from '@extension/components/IconButton';
import StrengthMeter from '@extension/components/StrengthMeter';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// utils
import { validate } from './utils';

interface IProps {
  disabled?: boolean;
  label?: string;
  onChange: (value: string, score: number) => void;
  score: number;
  value: string;
}

const CreatePasswordInput: FC<IProps> = ({
  disabled,
  label,
  onChange,
  score,
  value,
}: IProps) => {
  const { t } = useTranslation();
  const { isOpen, onClose, onOpen } = useDisclosure();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  const subTextColor: string = useSubTextColor();
  // state
  const [show, setShow] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(
    value.length > 0 ? validate(value, score, t) : null
  );
  // handlers
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    const newScore: number = value.length <= 0 ? -1 : zxcvbn(value).score;
    const error: string | null = validate(value, newScore, t);

    // update the local state
    setError(error);

    onChange(value, newScore);
  };
  const handleOpenStrongPasswordPolicy = () => onOpen();
  const handleShowHideClick = () => setShow(!show);

  return (
    <>
      <DocumentModal
        documentName="strong_password_policy"
        isOpen={isOpen}
        onClose={onClose}
        title={t<string>('titles.strongPasswordPolicy')}
      />
      <VStack>
        <HStack alignItems="flex-end" justifyContent="space-between" w="full">
          <Text color={error ? 'red.300' : defaultTextColor} textAlign="left">
            {label || t<string>('labels.password')}
          </Text>

          <Text color="red.300" fontSize="xs" textAlign="right">
            {error}
          </Text>
        </HStack>

        <InputGroup size="md">
          <Input
            disabled={disabled}
            focusBorderColor={error ? 'red.300' : primaryColor}
            isInvalid={!!error}
            onChange={handleOnChange}
            placeholder={t<string>('placeholders.enterPassword')}
            type={show ? 'text' : 'password'}
            value={value}
          />
          <InputRightElement>
            <IconButton
              aria-label="Eye open and closed"
              disabled={disabled}
              icon={show ? IoEye : IoEyeOff}
              onClick={handleShowHideClick}
              size="sm"
              variant="ghost"
            />
          </InputRightElement>
        </InputGroup>

        <Text color={subTextColor} fontSize="xs" textAlign="left">
          <Trans i18nKey="captions.passwordScoreInfo">
            To conform with our{' '}
            <Button
              colorScheme={primaryColorScheme}
              fontSize="xs"
              onClick={handleOpenStrongPasswordPolicy}
              variant="link"
            >
              Strong Password Policy
            </Button>
            , you are required to use a sufficiently strong password. Password
            must be at least 8 characters.
          </Trans>
        </Text>

        <StrengthMeter score={score} />
      </VStack>
    </>
  );
};

export default CreatePasswordInput;
