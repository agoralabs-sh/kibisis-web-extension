import {
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
  type ChangeEvent,
  type ClipboardEvent,
  type FC,
  type ReactNode,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

// components
import Label from '@extension/components/Label';

// constants
import { DEFAULT_GAP, INPUT_HEIGHT } from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

// utils
import { isPhrasesEmpty } from './utils';

const SeedPhraseInput: FC<IProps> = ({
  _context,
  disabled,
  error,
  onChange,
  phrases,
}) => {
  const { t } = useTranslation();
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
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
      <HStack
        alignItems="center"
        minH={DEFAULT_GAP + 2}
        spacing={DEFAULT_GAP / 3}
        w="full"
      >
        {/*label*/}
        <Label
          error={error}
          label={t<string>('labels.seedPhrase')}
          pl={DEFAULT_GAP / 3}
          required={true}
        />

        <Spacer />

        {/*reset button*/}
        {!isPhrasesEmpty(phrases) && (
          <Button
            _hover={{
              bg: buttonHoverBackgroundColor,
            }}
            aria-label={t<string>('labels.resetSeedPhrase')}
            borderRadius="md"
            onClick={handleResetClick}
            size="sm"
            variant="ghost"
          >
            <Text color={subTextColor} fontSize="md">
              {t<string>('buttons.reset').toUpperCase()}
            </Text>
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
                h="full"
                pointerEvents="none"
                w={DEFAULT_GAP + 2}
              >
                <Text as="b" color={subTextColor} fontSize="sm">
                  {index + 1}
                </Text>
              </InputLeftElement>

              <Input
                autoFocus={currentFocusIndex === index}
                borderRadius="full"
                focusBorderColor={error ? 'red.300' : primaryColor}
                h={INPUT_HEIGHT}
                isDisabled={disabled}
                isInvalid={!!error}
                onChange={handleOnChange(index)}
                onFocus={handleOnFocus(index)}
                onPaste={handleOnPaste}
                pl={DEFAULT_GAP + 1}
                pr={DEFAULT_GAP / 2}
                py={DEFAULT_GAP - 2}
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
                key={`${_context}-seed-phrase-input-item-${index}`}
              >
                {input}
              </GridItem>
            );
          }

          return (
            <GridItem key={`${_context}-seed-phrase-input-item-${index}`}>
              {input}
            </GridItem>
          );
        })}
      </Grid>
    </VStack>
  );
};

export default SeedPhraseInput;
