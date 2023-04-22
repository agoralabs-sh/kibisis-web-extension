import { HStack, Icon, Text, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoWalletOutline } from 'react-icons/io5';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// Selectors
import { useSelectAccounts } from '@extension/selectors';

// Theme
import { theme } from '@extension/theme';

// Types
import { IAccount } from '@extension/types';

// Utils
import { ellipseAddress } from '@extension/utils';

interface IProps {
  address: string;
  ariaLabel?: string;
  label: string;
}

const SignTxnsAddressItem: FC<IProps> = ({
  address,
  ariaLabel,
  label,
}: IProps) => {
  const accounts: IAccount[] = useSelectAccounts();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const account: IAccount | null =
    accounts.find((value) => value.address === address) || null;

  return (
    <HStack justifyContent="space-between" spacing={2} w="full">
      <Text color={defaultTextColor} fontSize="xs">
        {label}
      </Text>
      <Tooltip aria-label={ariaLabel} label={address}>
        {account ? (
          <HStack
            backgroundColor={textBackgroundColor}
            borderRadius={theme.radii['3xl']}
            px={2}
            py={1}
            spacing={1}
          >
            <Icon as={IoWalletOutline} color={subTextColor} h={2} w={2} />
            <Text color={subTextColor} fontSize="xs">
              {account.name ||
                ellipseAddress(account.address, {
                  end: 10,
                  start: 10,
                })}
            </Text>
          </HStack>
        ) : (
          <Text color={subTextColor} fontSize="xs">
            {ellipseAddress(address, {
              end: 10,
              start: 10,
            })}
          </Text>
        )}
      </Tooltip>
    </HStack>
  );
};

export default SignTxnsAddressItem;
