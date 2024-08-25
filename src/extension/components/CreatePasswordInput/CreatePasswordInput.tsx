import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import { randomBytes } from 'tweetnacl';
import zxcvbn from 'zxcvbn';
import React, { type ChangeEvent, type FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { IoEye, IoEyeOff, IoOpenOutline } from 'react-icons/io5';

// components
import IconButton from '@extension/components/IconButton';
import Label from '@extension/components/Label';
import StrengthMeter from '@extension/components/StrengthMeter';

// constants
import {
  DEFAULT_GAP,
  INPUT_HEIGHT,
  STRONG_PASSWORD_POLICY_LINK,
} from '@extension/constants';

// hooks
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

// utils
import { validate } from './utils';

const CreatePasswordInput: FC<IProps> = ({
  disabled,
  id,
  inputRef,
  label,
  onChange,
  onKeyUp,
  score,
  value,
}) => {
  const { t } = useTranslation();
  // hooks
  const primaryColor = usePrimaryColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // state
  const [show, setShow] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(
    value.length > 0 ? validate(value, score, t) : null
  ); // misc
  const _id = id || encodeBase64URLSafe(randomBytes(6));
  // handlers
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const newScore = value.length <= 0 ? -1 : zxcvbn(value).score;
    const error = validate(value, newScore, t);

    // update the local state
    setError(error);

    onChange(value, newScore);
  };
  const handleShowHideClick = () => setShow(!show);

  return (
    <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
      {/*label*/}
      <Label
        error={error}
        inputID={_id}
        label={label || t<string>('labels.password')}
        px={DEFAULT_GAP - 2}
        required={true}
      />

      {/*input*/}
      <InputGroup size="md">
        <Input
          autoComplete="new-password"
          borderRadius="full"
          focusBorderColor={error ? 'red.300' : primaryColor}
          h={INPUT_HEIGHT}
          id={_id}
          isDisabled={disabled}
          isInvalid={!!error}
          onChange={handleOnChange}
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
