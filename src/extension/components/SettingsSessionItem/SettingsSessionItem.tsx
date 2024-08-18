import { HStack, Text, Tooltip, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoUnlinkOutline, IoWalletOutline } from 'react-icons/io5';

// components
import NetworkBadge from '@extension/components/NetworkBadge';
import OverflowMenu from '@extension/components/OverflowMenu';
import SessionAvatar from '@extension/components/SessionAvatar';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useItemBorderColor from '@extension/hooks/useItemBorderColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

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
      <OverflowMenu
        context={item.id}
        items={[
          {
            icon: IoWalletOutline,
            label: t<string>('labels.manage'),
            onSelect: handleOnSelectClick,
          },
          {
            icon: IoUnlinkOutline,
            label: t<string>('labels.disconnect'),
            onSelect: handleOnSelectClick,
          },
        ]}
      />
    </HStack>
  );
};

export default SettingsSessionItem;
