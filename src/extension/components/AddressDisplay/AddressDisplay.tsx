import { HStack, Icon, ResponsiveValue, Text, Tooltip } from '@chakra-ui/react';
import * as CSS from 'csstype';
import React, { FC } from 'react';
import { IoWalletOutline } from 'react-icons/io5';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// selectors
import { useSelectAccounts } from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// theme
import { theme } from '@extension/theme';

// types
import { IAccount, INetwork } from '@extension/types';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';

interface IProps {
  address: string;
  ariaLabel?: string;
  color?: ResponsiveValue<CSS.Property.Color>;
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  network: INetwork;
}

const AddressDisplay: FC<IProps> = ({
  address,
  ariaLabel,
  color,
  fontSize = 'sm',
  network,
}: IProps) => {
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const account: IAccount | null =
    accounts.find(
      (value) =>
        AccountService.convertPublicKeyToAlgorandAddress(value.publicKey) ===
        address
    ) || null;
  const getIconSize: () => number = () => {
    switch (fontSize) {
      case 'xs':
        return 2;
      case 'sm':
        return 3;
      case 'md':
        return 4;
      case 'xl':
      default:
        return 6;
    }
  };

  if (account) {
    return (
      <Tooltip aria-label={ariaLabel} label={address}>
        <HStack
          backgroundColor={textBackgroundColor}
          borderRadius={theme.radii['3xl']}
          px={2}
          py={1}
          spacing={1}
        >
          <Icon
            as={IoWalletOutline}
            color={color || defaultTextColor}
            h={getIconSize()}
            w={getIconSize()}
          />
          {account.name ? (
            <Text
              color={color || defaultTextColor}
              fontSize={fontSize}
              maxW={160}
              noOfLines={1}
            >
              {account.name}
            </Text>
          ) : (
            <Text color={color || defaultTextColor} fontSize={fontSize}>
              {ellipseAddress(
                AccountService.convertPublicKeyToAlgorandAddress(
                  account.publicKey
                )
              )}
            </Text>
          )}
        </HStack>
      </Tooltip>
    );
  }

  return (
    <Tooltip aria-label={ariaLabel} label={address}>
      <Text color={color || defaultTextColor} fontSize={fontSize}>
        {ellipseAddress(address)}
      </Text>
    </Tooltip>
  );
};

export default AddressDisplay;
