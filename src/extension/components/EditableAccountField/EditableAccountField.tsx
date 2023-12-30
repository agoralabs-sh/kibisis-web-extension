import {
  Box,
  Heading,
  HStack,
  Input,
  Skeleton,
  Tooltip,
  useOutsideClick,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkOutline, IoCloseOutline } from 'react-icons/io5';

// components
import IconButton from '@extension/components/IconButton';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// utils
import { ellipseAddress } from '@extension/utils';

interface IProps {
  address: string;
  isEditing: boolean;
  isLoading: boolean;
  name: string | null;
  onCancel: () => void;
  onSubmitChange: (value: string | null) => void;
}

const EditableAccountField: FC<IProps> = ({
  address,
  name,
  isEditing,
  isLoading,
  onCancel,
  onSubmitChange,
}: IProps) => {
  const { t } = useTranslation();
  const containerRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);
  const inputRef: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  // hooks
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  // state
  const [value, setValue] = useState<string>(name || address);
  // handlers
  const handleCancelClick = () => onCancel();
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);
  const handleOnKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmitChange(value);
    }
  };
  const handleSubmitClick = () =>
    onSubmitChange(value && value.length > 0 ? value : null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  // if clicking outside, cancel the edit
  useOutsideClick({
    ref: containerRef,
    handler: onCancel,
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
    <VStack position="relative" ref={containerRef} w="full" zIndex={0}>
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
        value={value}
      />

      {/*controls*/}
      <HStack
        position="absolute"
        right={0}
        top="calc(100% + var(--chakra-space-2))"
        zIndex={1}
      >
        {/*submit*/}
        <Box bg={BODY_BACKGROUND_COLOR} boxShadow="lg">
          <IconButton
            _hover={{ backgroundColor: buttonHoverBackgroundColor }}
            aria-label="Confirm rename account"
            bg={textBackgroundColor}
            boxShadow="lg"
            icon={IoCheckmarkOutline}
            onClick={handleSubmitClick}
            size="sm"
            type="submit"
            variant="ghost"
          />
        </Box>

        {/*cancel*/}
        <Box bg={BODY_BACKGROUND_COLOR} boxShadow="lg">
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

export default EditableAccountField;
