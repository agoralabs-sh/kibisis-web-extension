import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
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
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// utils
import { isPhrasesEmpty } from './utils';
import { DEFAULT_GAP } from '@extension/constants';

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
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  // states
  const [currentFocusIndex, setCurrentFocusIndex] = useState<number>(0);
  // handlers
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
    let text: string = event.clipboardData.getData('text');

    event.preventDefault();

    text = text.replaceAll(',', ' '); // replace commas with whitespace

    // split the phrases by whitespace
    newPhrases = text
      .replace(/\s+/g, ' ') // only allow a single whitespace between each word
      .split(' '); // split by single whitespace

    onChange(phrases.map((value, index) => newPhrases[index] || value));
  };
  const handleResetClick = () => onChange(phrases.map(() => ''));

  return (
    <VStack>
      <HStack alignItems="center" minH={8} spacing={DEFAULT_GAP / 3} w="full">
        {/*label*/}
        <HStack alignItems="flex-end" justifyContent="space-between" w="full">
          <Text
            color={error ? 'red.300' : defaultTextColor}
            fontSize="sm"
            textAlign="left"
          >
            {t<string>('labels.seedPhrase')}
          </Text>

          <Text color="red.300" fontSize="xs" textAlign="right">
            {error}
          </Text>
        </HStack>

        <Spacer />

        {/*reset button*/}
        {!isPhrasesEmpty(phrases) && (
          <Button
            _hover={{
              bg: buttonHoverBackgroundColor,
            }}
            aria-label="Reset the phrases"
            borderRadius={0}
            onClick={handleResetClick}
            size="sm"
            variant="ghost"
          >
            {t<string>('buttons.reset')}
          </Button>
        )}
      </HStack>

      {/*inputs*/}
      <Grid gap={2} templateColumns="repeat(3, 1fr)" w="full">
        {phrases.map((value, index, array) => {
          const input: ReactNode = (
            <InputGroup size="md">
              <InputLeftElement
                color={subTextColor}
                pointerEvents="none"
                width={5}
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
                pb={4}
                pl={5}
                pr={3}
                pt={4}
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
