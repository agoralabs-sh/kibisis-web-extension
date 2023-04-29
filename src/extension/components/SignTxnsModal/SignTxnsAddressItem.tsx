import { HStack, StackProps, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import AddressDisplay from '@extension/components/AddressDisplay';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';

// Constants
import { MODAL_ITEM_HEIGHT } from '@extension/constants';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Selectors
import {
  useSelectAccounts,
  useSelectPreferredBlockExplorer,
} from '@extension/selectors';

// Services
import { AccountService } from '@extension/services';

// Types
import { IAccount, IExplorer, INetwork } from '@extension/types';

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
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const preferredExplorer: IExplorer | null = useSelectPreferredBlockExplorer();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const explorer: IExplorer | null =
    network.explorers.find((value) => value.id === preferredExplorer?.id) ||
    network.explorers[0] ||
    null; // get the preferred explorer, if it exists in the networks, otherwise get the default one
  const account: IAccount | null =
    accounts.find(
      (value) =>
        AccountService.convertPublicKeyToAlgorandAddress(value.publicKey) ===
        address
    ) || null;

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
      <HStack spacing={0}>
        <AddressDisplay
          address={address}
          ariaLabel={ariaLabel}
          color={subTextColor}
          fontSize="xs"
          network={network}
        />

        {/*open in explorer button*/}
        {!account && explorer && (
          <OpenTabIconButton
            size="xs"
            tooltipLabel={t<string>('captions.openOn', {
              name: explorer.canonicalName,
            })}
            url={`${explorer.baseUrl}${explorer.accountPath}/${address}`}
          />
        )}
      </HStack>
    </HStack>
  );
};

export default SignTxnsAddressItem;
