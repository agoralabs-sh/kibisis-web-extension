import {
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import React, { ChangeEvent, ClipboardEvent, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import useSubTextColor from '../../hooks/useSubTextColor';

interface IProps {
  disabled: boolean;
  error: string | null;
  onChange: (phrases: string[]) => void;
  phrases: string[];
}

const EnterMnemonicPhraseInput: FC<IProps> = ({
  disabled,
  error,
  onChange,
  phrases,
}: IProps) => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const [currentFocusIndex, setCurrentFocusIndex] = useState<number>(0);
  const handleOnChange =
    (phrasesIndex: number) => (event: ChangeEvent<HTMLInputElement>) => {
      onChange(
        phrases.map((value, index) =>
          index === phrasesIndex ? event.target.value : value
        )
      );
    };
  const handleOnFocus = (index: number) => () => {
    setCurrentFocusIndex(index);
  };
  const handleOnPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    let newPhrases: string[];

    event.preventDefault();

    // split the phrases by whitespace
    newPhrases = event.clipboardData.getData('text').split(' ');

    onChange(phrases.map((value, index) => newPhrases[index] || value));
  };

  return (
    <VStack>
      <HStack alignItems="flex-end" justifyContent="space-between" w="full">
        <Text color={error ? 'red.300' : defaultTextColor} textAlign="left">
          {t<string>('labels.mnemonicPhrase')}
        </Text>
        <Text color="red.300" fontSize="xs" textAlign="right">
          {error}
        </Text>
      </HStack>
      <SimpleGrid columns={3} justifyItems="center" spacing={2}>
        {phrases.map((value, index) => (
          <InputGroup key={nanoid()} size="md">
            <InputLeftElement
              color={subTextColor}
              pointerEvents="none"
              width="1.75rem"
            >
              <Text color={subTextColor} fontSize="xs">
                {index + 1}
              </Text>
            </InputLeftElement>
            <Input
              autoFocus={currentFocusIndex === index}
              disabled={disabled}
              focusBorderColor={error ? 'red.300' : 'primary.500'}
              isInvalid={!!error}
              onChange={handleOnChange(index)}
              onFocus={handleOnFocus(index)}
              onPaste={handleOnPaste}
              pl="1.75rem"
              type="text"
              value={value}
            />
          </InputGroup>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default EnterMnemonicPhraseInput;
