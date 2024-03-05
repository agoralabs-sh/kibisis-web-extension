import { HStack, Icon, StackProps, Text, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoWalletOutline } from 'react-icons/io5';

// components
import OpenTabIconButton from '@extension/components/OpenTabIconButton';

// constants
import { MODAL_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// selectors
import {
  useSelectAccounts,
  useSelectPreferredBlockExplorer,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// theme
import { theme } from '@extension/theme';

// types
import { IAccount, IBlockExplorer, INetwork } from '@extension/types';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';

interface IProps extends StackProps {
  ariaLabel?: string;
  currentAddress: string;
  label: string;
  network: INetwork;
  newAddress: string;
}

const SignTxnsChangeAddressItem: FC<IProps> = ({
  ariaLabel,
  currentAddress,
  label,
  network,
  newAddress,
  ...stackProps
}: IProps) => {
  const { t } = useTranslation();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const preferredExplorer: IBlockExplorer | null =
    useSelectPreferredBlockExplorer();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const currentAccount: IAccount | null =
    accounts.find(
      (value) =>
        AccountService.convertPublicKeyToAlgorandAddress(value.publicKey) ===
        currentAddress
    ) || null;
  const newAccount: IAccount | null =
    accounts.find(
      (value) =>
        AccountService.convertPublicKeyToAlgorandAddress(value.publicKey) ===
        newAddress
    ) || null;
  const explorer: IBlockExplorer | null =
    network.blockExplorers.find(
      (value) => value.id === preferredExplorer?.id
    ) ||
    network.blockExplorers[0] ||
    null; // get the preferred explorer, if it exists in the networks, otherwise get the default one
  const renderAccount = (address: string, account: IAccount | null) => {
    return (
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
                ellipseAddress(
                  AccountService.convertPublicKeyToAlgorandAddress(
                    account.publicKey
                  ),
                  {
                    end: 4,
                    start: 4,
                  }
                )}
            </Text>
          </HStack>
        ) : (
          <HStack spacing={0}>
            <Tooltip aria-label={ariaLabel} label={address}>
              <Text color={subTextColor} fontSize="xs">
                {ellipseAddress(address, {
                  end: 4,
                  start: 4,
                })}
              </Text>
            </Tooltip>
            {explorer && (
              <OpenTabIconButton
                size="xs"
                tooltipLabel={t<string>('captions.openOn', {
                  name: explorer.canonicalName,
                })}
                url={`${explorer.baseUrl}${explorer.accountPath}/${address}`}
              />
            )}
          </HStack>
        )}
      </Tooltip>
    );
  };

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      minH={MODAL_ITEM_HEIGHT}
      spacing={2}
      w="full"
      {...stackProps}
    >
      <Text color={defaultTextColor} fontSize="xs">
        {label}
      </Text>
      <HStack spacing={2}>
        {currentAddress !== newAddress ? (
          <>
            {renderAccount(currentAddress, currentAccount)}
            <Text color={subTextColor} fontSize="xs">{`>`}</Text>
            {renderAccount(newAddress, newAccount)}
          </>
        ) : (
          renderAccount(currentAddress, currentAccount)
        )}
      </HStack>
    </HStack>
  );
};

export default SignTxnsChangeAddressItem;
