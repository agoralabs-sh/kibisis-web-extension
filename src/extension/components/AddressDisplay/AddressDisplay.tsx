import { Tag, TagLabel, TagLeftIcon, Text, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoWalletOutline } from 'react-icons/io5';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { IAccount } from '@extension/types';
import type { IProps } from './types';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';

const AddressDisplay: FC<IProps> = ({
  accounts,
  address,
  ariaLabel,
  colorScheme,
  size = 'sm',
}) => {
  // selectors
  const colorMode = useSelectSettingsColorMode();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const defaultColorScheme = useColorModeValue('gray', 'whiteAlpha');
  // misc
  const account: IAccount | null =
    accounts.find(
      (value) =>
        AccountService.convertPublicKeyToAlgorandAddress(value.publicKey) ===
        address
    ) || null;

  if (account) {
    return (
      <Tag
        borderRadius="full"
        colorScheme={colorScheme || 'gray'}
        size={size}
        variant={colorMode === 'dark' ? 'solid' : 'subtle'}
      >
        <TagLeftIcon as={IoWalletOutline} />

        {account.name ? (
          <TagLabel>{account.name}</TagLabel>
        ) : (
          <TagLabel>
            {ellipseAddress(
              AccountService.convertPublicKeyToAlgorandAddress(
                account.publicKey
              )
            )}
          </TagLabel>
        )}
      </Tag>
    );
  }

  return (
    <Tooltip aria-label={ariaLabel} label={address}>
      <Text
        color={
          colorScheme
            ? `${colorScheme || defaultColorScheme}.500`
            : defaultTextColor
        }
        fontSize={size}
      >
        {ellipseAddress(address)}
      </Text>
    </Tooltip>
  );
};

export default AddressDisplay;
