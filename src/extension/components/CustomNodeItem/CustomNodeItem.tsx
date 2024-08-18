import {
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoEllipsisVerticalOutline,
  IoEyeOutline,
  IoTrashOutline,
} from 'react-icons/io5';

// components
import NetworkBadge from '@extension/components/NetworkBadge';
import IconButton from '@extension/components/IconButton';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useItemBorderColor from '@extension/hooks/useItemBorderColor';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const CustomNodeItem: FC<IProps> = ({
  item,
  isDisabled = false,
  network,
  onRemove,
  onSelect,
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const itemBorderColor = useItemBorderColor();
  // handlers
  const handleOnRemoveClick = () => onRemove(item.id);
  const handleOnSelectClick = () => onSelect(item.id);

  return (
    <HStack
      borderBottomColor={itemBorderColor}
      borderBottomStyle="solid"
      borderBottomWidth="1px"
      m={0}
      p={DEFAULT_GAP - 2}
      spacing={DEFAULT_GAP / 3}
      w="full"
    >
      {/*details*/}
      <VStack
        alignItems="flex-start"
        flexGrow={1}
        justifyContent="space-evenly"
        spacing={DEFAULT_GAP / 3}
      >
        <HStack justifyContent="space-between" spacing={1} w="full">
          {/*name*/}
          <Tooltip label={item.name}>
            <Text
              color={defaultTextColor}
              fontSize="md"
              maxW={400}
              noOfLines={1}
              textAlign="left"
            >
              {item.name}
            </Text>
          </Tooltip>

          {/*network*/}
          <NetworkBadge network={network} size="sm" />
        </HStack>

        <HStack justifyContent="flex-end" spacing={DEFAULT_GAP / 3} w="full">
          {/*disabled*/}
          {isDisabled && (
            <Tag colorScheme="red" size="sm" variant="solid">
              <TagLabel>{t<string>('labels.disabled')}</TagLabel>
            </Tag>
          )}

          {/*algod*/}
          <Tag colorScheme="green" size="sm" variant="solid">
            <TagLabel>algod</TagLabel>
            <TagRightIcon as={IoCheckmarkCircleOutline} />
          </Tag>

          {/*indexer*/}
          <Tag
            colorScheme={item.indexer ? 'green' : 'orange'}
            size="sm"
            variant="solid"
          >
            <TagLabel>indexer</TagLabel>
            <TagRightIcon
              as={
                item.indexer ? IoCheckmarkCircleOutline : IoCloseCircleOutline
              }
            />
          </Tag>
        </HStack>
      </VStack>

      {/*overflow menu*/}
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Overflow menu"
          icon={IoEllipsisVerticalOutline}
          variant="ghost"
        />

        <MenuList>
          <MenuItem
            color={defaultTextColor}
            fontSize="sm"
            icon={
              <Icon
                as={IoEyeOutline}
                boxSize={calculateIconSize()}
                color={defaultTextColor}
              />
            }
            minH={DEFAULT_GAP * 2}
            onClick={handleOnSelectClick}
          >
            {t<string>('labels.view')}
          </MenuItem>

          <MenuItem
            color={defaultTextColor}
            fontSize="sm"
            icon={
              <Icon
                as={IoTrashOutline}
                boxSize={calculateIconSize()}
                color={defaultTextColor}
              />
            }
            minH={DEFAULT_GAP * 2}
            onClick={handleOnRemoveClick}
          >
            {t<string>('labels.remove')}
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
};

export default CustomNodeItem;
