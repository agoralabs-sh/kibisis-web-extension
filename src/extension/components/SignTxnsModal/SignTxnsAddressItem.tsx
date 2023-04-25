import { HStack, Icon, StackProps, Text, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoWalletOutline } from 'react-icons/io5';

// Components
import OpenTabIconButton from '@extension/components/OpenTabIconButton';

// Constants
import { MODAL_ITEM_HEIGHT } from '@extension/constants';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// Selectors
import {
  useSelectAccounts,
  useSelectPreferredBlockExplorer,
} from '@extension/selectors';

// Theme
import { theme } from '@extension/theme';

// Types
import { IAccount, IExplorer, INetwork } from '@extension/types';

// Utils
import { ellipseAddress } from '@extension/utils';

interface IProps extends StackProps {
  address: string;
  ariaLabel?: string;
  label: string;
  network: INetwork;
}

const SignTxnsAddressItem: FC<IProps> = ({
  address,
  ariaLabel,
  label,
  network,
  ...stackProps
}: IProps) => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const accounts: IAccount[] = useSelectAccounts();
  const preferredExplorer: IExplorer | null = useSelectPreferredBlockExplorer();
  const explorer: IExplorer | null =
    network.explorers.find((value) => value.id === preferredExplorer?.id) ||
    network.explorers[0] ||
    null; // get the preferred explorer, if it exists in the networks, otherwise get the default one
  const account: IAccount | null =
    accounts.find((value) => value.address === address) || null;

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
      {account ? (
        <Tooltip aria-label={ariaLabel} label={address}>
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
        </Tooltip>
      ) : (
        <HStack spacing={0}>
          <Tooltip aria-label={ariaLabel} label={address}>
            <Text color={subTextColor} fontSize="xs">
              {ellipseAddress(address, {
                end: 10,
                start: 10,
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
    </HStack>
  );
};

export default SignTxnsAddressItem;
