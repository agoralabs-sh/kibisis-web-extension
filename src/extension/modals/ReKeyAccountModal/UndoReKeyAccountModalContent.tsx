import { HStack, Text, VStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import InfoIconTooltip from '@extension/components/InfoIconTooltip';
import ModalAssetItem from '@extension/components/ModalAssetItem';
import ModalItem from '@extension/components/ModalItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { IUndoReKeyAccountModalContentProps } from './types';

// utils
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';

const UndoReKeyAccountModalContent: FC<IUndoReKeyAccountModalContentProps> = ({
  account,
  accounts,
  authAddress,
  network,
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
          {t<string>('captions.undoReKeyAccount')}
        </Text>

        {/*account*/}
        <ModalItem
          flexGrow={1}
          label={`${t<string>('labels.account')}:`}
          value={
            <AddressDisplay
              accounts={accounts}
              address={AccountService.convertPublicKeyToAlgorandAddress(
                account.publicKey
              )}
              ariaLabel="Account address"
              size="sm"
              network={network}
            />
          }
        />

        {/*current auth account*/}
        <ModalItem
          flexGrow={1}
          label={`${t<string>('labels.currentAuthorizedAccount')}:`}
          value={
            <AddressDisplay
              accounts={accounts}
              address={authAddress}
              ariaLabel="Current auth address"
              colorScheme="green"
              size="sm"
              network={network}
            />
          }
        />

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
      </VStack>
    </VStack>
  );
};

export default UndoReKeyAccountModalContent;
