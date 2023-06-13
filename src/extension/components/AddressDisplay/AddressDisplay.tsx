import {
  HStack,
  Icon,
  ResponsiveValue,
  StackProps,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import * as CSS from 'csstype';
import React, { FC } from 'react';
import { IoWalletOutline } from 'react-icons/io5';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// Selectors
import {
  useSelectAccounts,
  useSelectPreferredBlockExplorer,
} from '@extension/selectors';

// Services
import { AccountService } from '@extension/services';

// Theme
import { theme } from '@extension/theme';

// Types
import { IAccount, IAccountInformation, INetwork } from '@extension/types';

// Utils
import { ellipseAddress } from '@extension/utils';

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
  const accountInformation: IAccountInformation | null = account
    ? AccountService.extractAccountInformationForNetwork(account, network)
    : null;
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
          <Text color={color || defaultTextColor} fontSize={fontSize}>
            {accountInformation?.name ||
              ellipseAddress(
                AccountService.convertPublicKeyToAlgorandAddress(
                  account.publicKey
                ),
                {
                  end: 10,
                  start: 10,
                }
              )}
          </Text>
        </HStack>
      </Tooltip>
    );
  }

  return (
    <Tooltip aria-label={ariaLabel} label={address}>
      <Text color={color || defaultTextColor} fontSize={fontSize}>
        {ellipseAddress(address, {
          end: 10,
          start: 10,
        })}
      </Text>
    </Tooltip>
  );
};

export default AddressDisplay;
