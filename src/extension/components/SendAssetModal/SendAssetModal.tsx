import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  NumberInputField,
  Spacer,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// components
import Button from '@extension/components/Button';
import SendAssetModalContentSkeleton from './SendAssetModalContentSkeleton';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectAccounts,
  useSelectSelectedNetwork,
  useSelectSendingAssetFromAccount,
  useSelectSendingAssetSelectedAsset,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import {
  IAccount,
  IAsset,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';
import { calculateMaxTransactionAmount } from '@extension/utils';
import SendAmountInput from '@extension/components/SendAssetModal/SendAmountInput';

interface IProps {
  onClose: () => void;
}

const SendAssetModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const fromAccount: IAccount | null = useSelectSendingAssetFromAccount();
  const network: INetworkWithTransactionParams | null =
    useSelectSelectedNetwork();
  const selectedAsset: IAsset | null = useSelectSendingAssetSelectedAsset();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  const subTextColor: string = useSubTextColor();
  // state
  const [amount, setAmount] = useState<BigNumber>(new BigNumber(0));
  const [maximumTransactionAmount, setMaximumTransactionAmount] =
    useState<BigNumber>(new BigNumber(0));
  // misc
  const isOpen: boolean = !!selectedAsset;
  // handlers
  const handleAmountChange = (value: BigNumber) => {
    console.log(value.toString());
    setAmount(value);
  };
  const handleSendClick = async () => {
    console.log('send!!');
  };
  const handleCancelClick = () => handleClose();
  const handleClose = () => onClose();

  useEffect(() => {
    if (fromAccount && network && selectedAsset) {
      setMaximumTransactionAmount(
        calculateMaxTransactionAmount({
          account: fromAccount,
          assetId: selectedAsset.id !== '0' ? selectedAsset.id : null, // native currency will have an asset id of 0, so we omit it in order to calculate the native currency
          network,
        })
      );

      return;
    }

    setMaximumTransactionAmount(new BigNumber(0));
  }, [fromAccount, network, selectedAsset]);

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent
        backgroundColor="var(--chakra-colors-chakra-body-bg)"
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.sendAsset', {
              asset: selectedAsset?.unitName || 'Asset',
            })}
          </Heading>
        </ModalHeader>

        <ModalBody display="flex" px={DEFAULT_GAP}>
          {fromAccount && network && selectedAsset ? (
            <VStack w="full">
              {/*amount*/}
              <SendAmountInput
                account={fromAccount}
                asset={selectedAsset}
                network={network}
                maximumTransactionAmount={maximumTransactionAmount}
                onValueChange={handleAmountChange}
                value={amount}
              />
            </VStack>
          ) : (
            <SendAssetModalContentSkeleton />
          )}
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={DEFAULT_GAP - 2} w="full">
            <Button
              onClick={handleCancelClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.cancel')}
            </Button>

            <Button
              onClick={handleSendClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.send')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SendAssetModal;
