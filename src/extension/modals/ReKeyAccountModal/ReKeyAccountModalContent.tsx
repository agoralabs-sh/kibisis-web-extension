import { HStack, Text, VStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AddressInput from '@extension/components/AddressInput';
import InfoIconTooltip from '@extension/components/InfoIconTooltip';
import ModalAssetItem from '@extension/components/ModalAssetItem';
import ModalItem from '@extension/components/ModalItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IReKeyAccountModalContentProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';

const ReKeyAccountConfirmingModalContent: FC<
  IReKeyAccountModalContentProps
> = ({
  account,
  accountInformation,
  accounts,
  authAddress,
  authAddressError,
  network,
  onAuthAddressBlur,
  onAuthAddressChange,
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();

  return (
    <VStack flexGrow={1} spacing={DEFAULT_GAP / 2} w="full">
      <VStack px={DEFAULT_GAP} spacing={DEFAULT_GAP / 2} w="full">
        {/*descriptions*/}
        <Text color={defaultTextColor} fontSize="sm" textAlign="left" w="full">
          {t<string>('captions.reKeyAccount')}
        </Text>

        {/*account*/}
        <ModalItem
          flexGrow={1}
          label={`${t<string>('labels.account')}:`}
          value={
            <AddressDisplay
              accounts={accounts}
              address={convertPublicKeyToAVMAddress(account.publicKey)}
              ariaLabel="Re-keyed address"
              size="sm"
              network={network}
            />
          }
        />

        {/*current auth account*/}
        {accountInformation.authAddress && (
          <ModalItem
            flexGrow={1}
            label={`${t<string>('labels.currentAuthorizedAccount')}:`}
            value={
              <AddressDisplay
                accounts={accounts}
                address={accountInformation.authAddress}
                ariaLabel="Current auth address"
                colorScheme="green"
                size="sm"
                network={network}
              />
            }
          />
        )}

        {/*fee*/}
        <HStack spacing={1} w="full">
          <ModalAssetItem
            amountInAtomicUnits={new BigNumber(network.minFee)}
            decimals={network.nativeCurrency.decimals}
            icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
              color: subTextColor,
              h: 3,
              w: 3,
            })}
            label={`${t<string>('labels.fee')}:`}
          />

          {/*info*/}
          <InfoIconTooltip
            color={subTextColor}
            label={t<string>('captions.reKeyFee')}
          />
        </HStack>

        {/*re-key to*/}
        <AddressInput
          accounts={accounts}
          error={authAddressError}
          label={t<string>('labels.reKeyTo')}
          onBlur={onAuthAddressBlur}
          onChange={onAuthAddressChange}
          value={authAddress}
        />
      </VStack>
    </VStack>
  );
};

export default ReKeyAccountConfirmingModalContent;
