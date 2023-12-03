import { Input, InputGroup, Text, VStack } from '@chakra-ui/react';
import React, { ChangeEvent, FC, FocusEvent } from 'react';
import { useTranslation } from 'react-i18next';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

interface IProps {
  disabled?: boolean;
  error: string | null;
  label?: string;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const AddressInput: FC<IProps> = ({
  disabled,
  error,
  label,
  onBlur,
  onChange,
  value,
}: IProps) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();

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
          onBlur={onBlur}
          onChange={onChange}
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
