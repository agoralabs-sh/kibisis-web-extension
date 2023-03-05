import { HStack, IconButton, Input, InputGroup, InputRightElement, Text, VStack } from '@chakra-ui/react';
import zxcvbn from 'zxcvbn';
import React, { ChangeEvent, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoEye, IoEyeOff } from 'react-icons/io5';

// Components
import StrengthMeter from '../StrengthMeter';

// Utils
import { validate } from './utils';

interface IProps {
  onChange: (value: string, score: number) => void;
  score: number;
  value: string;
}

const CreatePasswordInput: FC<IProps> = ({ onChange, score, value }: IProps) => {
  const { t } = useTranslation();
  const [show, setShow] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(value.length > 0 ? validate(value, score, t) : null);
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    const newScore: number = value.length <= 0 ? -1 : zxcvbn(value).score;
    const error: string | null = validate(value, newScore, t);

    // update the local state
    setError(error);

    onChange(value, newScore);
  };
  const handleShowHideClick = () => {
    setShow(!show);
  };

  return (
    <VStack>
      <HStack alignItems="flex-end" justifyContent="space-between" w="full">
        <Text color={error ? 'red.300' : 'gray.500'} textAlign="left">{t<string>('labels.password')}</Text>
        <Text color="red.300" fontSize="xs" textAlign="right">{error}</Text>
      </HStack>
      <InputGroup size="md">
        <Input
          focusBorderColor={error ? 'red.300' : 'primary.500'}
          isInvalid={!!error}
          onChange={handleOnChange}
          placeholder={t<string>('placeholders.enterPassword')}
          type={show ? 'text' : 'password'}
          value={value}
        />
        <InputRightElement>
          <IconButton
            aria-label="Eye open and closed"
            colorScheme="gray"
            icon={show ? <IoEye /> : <IoEyeOff />}
            onClick={handleShowHideClick}
            size="sm"
            variant="solid"
          />
        </InputRightElement>
      </InputGroup>
      <Text color="gray.400" fontSize="xs" textAlign="left">{t<string>('captions.passwordScoreInfo')}</Text>
      <StrengthMeter score={score} />
    </VStack>

  );
}

export default CreatePasswordInput;

