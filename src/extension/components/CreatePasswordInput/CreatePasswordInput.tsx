import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import zxcvbn from 'zxcvbn';
import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  MutableRefObject,
  useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { IoEye, IoEyeOff, IoOpenOutline } from 'react-icons/io5';

// components
import IconButton from '@extension/components/IconButton';
import StrengthMeter from '@extension/components/StrengthMeter';

// constants
import { STRONG_PASSWORD_POLICY_LINK } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// utils
import { validate } from './utils';

interface IProps {
  disabled?: boolean;
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  label?: string;
  onChange: (value: string, score: number) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
  score: number;
  value: string;
}

const CreatePasswordInput: FC<IProps> = ({
  disabled,
  inputRef,
  label,
  onChange,
  onKeyUp,
  score,
  value,
}: IProps) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // state
  const [show, setShow] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(
    value.length > 0 ? validate(value, score, t) : null
  ); // misc
  const inputId: string = 'create-password-input';
  // handlers
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    const newScore: number = value.length <= 0 ? -1 : zxcvbn(value).score;
    const error: string | null = validate(value, newScore, t);

    // update the local state
    setError(error);

    onChange(value, newScore);
  };
  const handleShowHideClick = () => setShow(!show);

  return (
    <VStack w="full">
      <HStack alignItems="flex-end" justifyContent="space-between" w="full">
        {/*label*/}
        <Text
          as={'label'}
          color={error ? 'red.300' : defaultTextColor}
          htmlFor={inputId}
          textAlign="left"
        >
          {label || t<string>('labels.password')}
        </Text>

        <Text color="red.300" fontSize="xs" textAlign="right">
          {error}
        </Text>
      </HStack>

      {/*input*/}
      <InputGroup size="md">
        <Input
          autoComplete="new-password"
          disabled={disabled}
          focusBorderColor={error ? 'red.300' : primaryColor}
          id={inputId}
          isInvalid={!!error}
          onChange={handleOnChange}
          onKeyUp={onKeyUp}
          placeholder={t<string>('placeholders.enterPassword')}
          ref={inputRef}
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

      {/*strong password policy*/}
      <Text color={subTextColor} fontSize="xs" textAlign="left">
        <Trans i18nKey="captions.passwordScoreInfo">
          To conform with our{' '}
          <Button
            as={Link}
            colorScheme={primaryColorScheme}
            fontSize="xs"
            href={STRONG_PASSWORD_POLICY_LINK}
            rightIcon={<IoOpenOutline />}
            target="_blank"
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
  );
};

export default CreatePasswordInput;
