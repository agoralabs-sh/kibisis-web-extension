import { Tag, TagLabel, TagLeftIcon, Text, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoWalletOutline } from 'react-icons/io5';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

// types
import type { IAccount } from '@extension/types';
import type { IProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
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
        convertPublicKeyToAVMAddress(
          AccountRepository.decode(value.publicKey)
        ) === address
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
              convertPublicKeyToAVMAddress(
                AccountRepository.decode(account.publicKey)
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
