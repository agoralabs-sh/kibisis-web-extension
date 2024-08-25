import {
  Box,
  Heading,
  HStack,
  Input,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useOutsideClick,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkOutline, IoCloseOutline } from 'react-icons/io5';

// components
import IconButton from '@extension/components/IconButton';

// constants
import {
  ACCOUNT_NAME_BYTE_LIMIT,
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
} from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// theme
import { theme } from '@extension/theme';

// types
import type { IProps } from './types';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';

const EditableAccountNameField: FC<IProps> = ({
  address,
  name,
  isEditing,
  isLoading,
  onCancel,
  onSubmitChange,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  const textBackgroundColor = useTextBackgroundColor();
  // state
  const [charactersRemaining, setCharactersRemaining] = useState<number>(
    ACCOUNT_NAME_BYTE_LIMIT - new TextEncoder().encode(name || '').byteLength
  );
  const [value, setValue] = useState<string | null>(name);
  // misc
  const reset = () => {
    setCharactersRemaining(
      ACCOUNT_NAME_BYTE_LIMIT - new TextEncoder().encode(name || '').byteLength
    );
    setValue(name);
  };
  // handlers
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    onCancel();

    // clean up
    reset();
  };
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const valueAsBytes = new TextEncoder().encode(
      event.target.value
    ).byteLength;

    setCharactersRemaining(ACCOUNT_NAME_BYTE_LIMIT - valueAsBytes);
    setValue(event.target.value);
  };
  const handleOnKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmitClick();
    }
  };
  const handleSubmitClick = () => {
    if (charactersRemaining < 0) {
      return;
    }

    onSubmitChange(value && value.length > 0 ? value : null);

    // clean up
    reset();
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  // if clicking outside, cancel the edit
  useOutsideClick({
    ref: containerRef,
    handler: handleClose,
  });

  if (isLoading) {
    return (
      <Skeleton>
        <Heading color={defaultTextColor} size="md" textAlign="left">
          {faker.random.alphaNumeric(12).toUpperCase()}
        </Heading>
      </Skeleton>
    );
  }

  if (!isEditing) {
    if (name) {
      return (
        <Tooltip aria-label="Name of account" label={name}>
          <Heading
            color={defaultTextColor}
            maxW={400}
            noOfLines={1}
            size="md"
            textAlign="left"
          >
            {name}
          </Heading>
        </Tooltip>
      );
    }

    return (
      <Heading color={defaultTextColor} size="md" textAlign="left">
        {ellipseAddress(address, { end: 4, start: 4 })}
      </Heading>
    );
  }

  return (
    <VStack position="relative" ref={containerRef} w="full" zIndex={1}>
      {/*character limit caption*/}
      <Stack
        bottom="calc(100% + var(--chakra-space-2))"
        position="absolute"
        right={DEFAULT_GAP / 3}
      >
        <Text
          color={charactersRemaining >= 0 ? subTextColor : 'red.300'}
          fontSize="xs"
          textAlign="right"
          w="full"
        >
          {t<string>('captions.charactersRemaining', {
            amount: charactersRemaining,
          })}
        </Text>
      </Stack>

      {/*/input*/}
      <Input
        focusBorderColor={primaryColor}
        onChange={handleOnChange}
        onKeyUp={handleOnKeyUp}
        p={DEFAULT_GAP / 3}
        placeholder={t<string>('placeholders.enterANameForYourAccount')}
        ref={inputRef}
        size="md"
        type="text"
        value={value || ''}
      />

      {/*controls*/}
      <HStack
        position="absolute"
        right={0}
        top="calc(100% + var(--chakra-space-2))"
      >
        {/*submit*/}
        <Box
          bg={BODY_BACKGROUND_COLOR}
          borderRadius={theme.radii['md']}
          boxShadow="lg"
        >
          <IconButton
            _hover={{ backgroundColor: buttonHoverBackgroundColor }}
            aria-label="Confirm rename account"
            bg={textBackgroundColor}
            icon={IoCheckmarkOutline}
            onClick={handleSubmitClick}
            size="sm"
            type="submit"
            variant="ghost"
          />
        </Box>

        {/*cancel*/}
        <Box
          bg={BODY_BACKGROUND_COLOR}
          borderRadius={theme.radii['md']}
          boxShadow="lg"
        >
          <IconButton
            _hover={{ backgroundColor: buttonHoverBackgroundColor }}
            aria-label="Cancel rename account"
            bg={textBackgroundColor}
            icon={IoCloseOutline}
            onClick={handleCancelClick}
            size="sm"
            variant="ghost"
          />
        </Box>
      </HStack>
    </VStack>
  );
};

export default EditableAccountNameField;
