import {
  Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, {
  ChangeEvent,
  ClipboardEvent,
  FC,
  ReactNode,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

interface IProps {
  disabled?: boolean;
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
  const primaryColor: string = usePrimaryColor();
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
          {t<string>('labels.seedPhrase')}
        </Text>
        <Text color="red.300" fontSize="xs" textAlign="right">
          {error}
        </Text>
      </HStack>
      <Grid gap={2} templateColumns="repeat(3, 1fr)" w="full">
        {phrases.map((value, index, array) => {
          const input: ReactNode = (
            <InputGroup size="md">
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
                focusBorderColor={error ? 'red.300' : primaryColor}
                isInvalid={!!error}
                onChange={handleOnChange(index)}
                onFocus={handleOnFocus(index)}
                onPaste={handleOnPaste}
                pl="1.75rem"
                type="text"
                value={value}
              />
            </InputGroup>
          );

          if (index >= array.length - 1) {
            return (
              <GridItem
                colEnd={2}
                colStart={2}
                key={`enter-mnemonic-phrase-input-phrase-input-item-${index}`}
              >
                {input}
              </GridItem>
            );
          }

          return (
            <GridItem
              key={`enter-mnemonic-phrase-input-phrase-input-item-${index}`}
            >
              {input}
            </GridItem>
          );
        })}
      </Grid>
    </VStack>
  );
};

export default EnterMnemonicPhraseInput;
