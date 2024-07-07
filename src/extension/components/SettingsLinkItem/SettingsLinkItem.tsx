import {
  Button,
  HStack,
  Icon,
  Tag,
  TagLabel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { encode as encodeHex } from '@stablelib/hex';
import React, { FC } from 'react';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { hash } from 'tweetnacl';

// constants
import { DEFAULT_GAP, SETTINGS_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

// types
import type { IProps } from './types';

const SettingsLinkItem: FC<IProps> = ({ badges, icon, label, to }) => {
  // selectors
  const colorMode = useSelectSettingsColorMode();
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  // misc
  const iconSize = 6;
  const labelHash = encodeHex(hash(new TextEncoder().encode(label)), true);

  return (
    <Button
      _hover={{
        bg: buttonHoverBackgroundColor,
      }}
      as={Link}
      borderRadius={0}
      fontSize="md"
      h={SETTINGS_ITEM_HEIGHT}
      justifyContent="start"
      px={DEFAULT_GAP - 2}
      rightIcon={
        <Icon
          as={IoChevronForward}
          color={defaultTextColor}
          h={iconSize}
          w={iconSize}
        />
      }
      to={to}
      variant="ghost"
      w="full"
    >
      <HStack
        alignItems="center"
        justifyContent="flex-start"
        spacing={DEFAULT_GAP / 3}
        w="full"
      >
        <Icon as={icon} color={defaultTextColor} h={iconSize} w={iconSize} />

        <VStack alignItems="flex-start" justifyContent="space-evenly" w="full">
          {/*label*/}
          <Text color={defaultTextColor} fontSize="md">
            {label}
          </Text>

          {/*badges*/}
          {badges && (
            <HStack w="full">
              {badges.map(({ colorScheme, label }, index) => (
                <Tag
                  borderRadius="full"
                  colorScheme={colorScheme}
                  key={`settings-${labelHash.slice(0, 12)}-item-${index}`}
                  size="sm"
                  variant={colorMode === 'dark' ? 'solid' : 'outline'}
                >
                  <TagLabel>{label}</TagLabel>
                </Tag>
              ))}
            </HStack>
          )}
        </VStack>
      </HStack>
    </Button>
  );
};

export default SettingsLinkItem;
