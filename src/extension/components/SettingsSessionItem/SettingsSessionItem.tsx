import {
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoEllipsisVerticalOutline,
  IoUnlinkOutline,
  IoWalletOutline,
} from 'react-icons/io5';

// components
import NetworkBadge from '@extension/components/NetworkBadge';
import IconButton from '@extension/components/IconButton';
import SessionAvatar from '@extension/components/SessionAvatar';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useItemBorderColor from '@extension/hooks/useItemBorderColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const SettingsSessionItem: FC<IProps> = ({
  item,
  network,
  onDisconnect,
  onSelect,
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const itemBorderColor = useItemBorderColor();
  const subTextColor: string = useSubTextColor();
  // handlers
  const handleOnDisconnectClick = () => onDisconnect(item.id);
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
      {/*icon*/}
      <SessionAvatar
        name={item.appName}
        iconUrl={item.iconUrl || undefined}
        size="sm"
      />

      {/*details*/}
      <VStack
        alignItems="flex-start"
        flexGrow={1}
        justifyContent="space-evenly"
        spacing={DEFAULT_GAP / 3}
      >
        <HStack
          justifyContent="space-between"
          spacing={DEFAULT_GAP / 2}
          w="full"
        >
          {/*name*/}
          <Tooltip label={item.appName}>
            <Text
              color={defaultTextColor}
              fontSize="md"
              maxW={400}
              noOfLines={1}
              textAlign="left"
            >
              {item.appName}
            </Text>
          </Tooltip>

          {/*network*/}
          <NetworkBadge network={network} size="sm" />
        </HStack>

        <HStack
          justifyContent="space-between"
          spacing={DEFAULT_GAP / 2}
          w="full"
        >
          {/*description*/}
          <Tooltip label={item.description}>
            <Text
              color={subTextColor}
              fontSize="sm"
              maxW={400}
              noOfLines={1}
              textAlign="left"
            >
              {item.description}
            </Text>
          </Tooltip>

          {/*creation date*/}
          <Text
            color={subTextColor}
            fontSize="sm"
            maxW={400}
            noOfLines={1}
            textAlign="left"
          >
            {new Date(item.createdAt).toLocaleString()}
          </Text>
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
                as={IoWalletOutline}
                boxSize={calculateIconSize()}
                color={defaultTextColor}
              />
            }
            minH={DEFAULT_GAP * 2}
            onClick={handleOnSelectClick}
          >
            {t<string>('labels.manage')}
          </MenuItem>

          <MenuItem
            color={defaultTextColor}
            fontSize="sm"
            icon={
              <Icon
                as={IoUnlinkOutline}
                boxSize={calculateIconSize()}
                color={defaultTextColor}
              />
            }
            minH={DEFAULT_GAP * 2}
            onClick={handleOnDisconnectClick}
          >
            {t<string>('labels.disconnect')}
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
};

export default SettingsSessionItem;
