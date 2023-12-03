import { Input, InputGroup, Text, VStack } from '@chakra-ui/react';
import React, { ChangeEvent, FC, FocusEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// utils
import { validate } from './utils';

interface IProps {
  disabled?: boolean;
  label?: string;
  onChange: (value: string) => void;
  value: string;
}

const AddressInput: FC<IProps> = ({
  disabled,
  label,
  onChange,
  value,
}: IProps) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();
  // state
  const [error, setError] = useState<string | null>(
    value.length > 0 ? validate(value, t) : null
  );
  // handlers
  const handleOnBlur = (event: FocusEvent<HTMLInputElement>) => {
    const error: string | null = validate(event.target.value, t);

    // update the local state
    setError(error);
  };
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.value);

  return (
    <VStack alignItems="flex-start" w="full">
      <Text
        color={error ? 'red.300' : defaultTextColor}
        fontSize="sm"
        textAlign="left"
      >
        {label || t<string>('labels.address')}
      </Text>

      <InputGroup size="lg">
        <Input
          disabled={disabled}
          focusBorderColor={error ? 'red.300' : primaryColor}
          isInvalid={!!error}
          onBlur={handleOnBlur}
          onChange={handleOnChange}
          placeholder={t<string>('placeholders.enterAddress')}
          type="text"
          value={value}
        />
      </InputGroup>

      <Text color="red.300" fontSize="xs" textAlign="left">
        {error}
      </Text>
    </VStack>
  );
};

export default AddressInput;
