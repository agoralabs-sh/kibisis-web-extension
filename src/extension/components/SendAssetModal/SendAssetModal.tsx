import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import AccountSelect from '@extension/components/AccountSelect';
import AssetSelect from '@extension/components/AssetSelect';
import Button from '@extension/components/Button';
import SendAmountInput from './SendAmountInput';
import SendAssetModalContentSkeleton from './SendAssetModalContentSkeleton';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// features
import {
  setFromAddress,
  setSelectedAsset,
} from '@extension/features/send-assets';

// hooks
import useAssets from '@extension/hooks/useAssets';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

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
  IAppThunkDispatch,
  IAsset,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import { calculateMaxTransactionAmount } from '@extension/utils';
import { AccountService } from '@extension/services';

interface IProps {
  onClose: () => void;
}

const SendAssetModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const fromAccount: IAccount | null = useSelectSendingAssetFromAccount();
  const network: INetworkWithTransactionParams | null =
    useSelectSelectedNetwork();
  const selectedAsset: IAsset | null = useSelectSendingAssetSelectedAsset();
  // hooks
  const assets: IAsset[] = useAssets();
  const defaultTextColor: string = useDefaultTextColor();
  // state
  const [amount, setAmount] = useState<BigNumber | null>(null);
  const [maximumTransactionAmount, setMaximumTransactionAmount] =
    useState<BigNumber>(new BigNumber(0));
  // misc
  const isOpen: boolean = !!selectedAsset;
  // handlers
  const handleAmountChange = (value: BigNumber | null) => setAmount(value);
  const handleAssetChange = (value: IAsset) =>
    dispatch(setSelectedAsset(value));
  const handleFromAccountChange = (account: IAccount) =>
    dispatch(
      setFromAddress(
        AccountService.convertPublicKeyToAlgorandAddress(
          account.publicKey
        ).toUpperCase()
      )
    );
  const handleSendClick = async () => {
    console.log('send!!');
  };
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    setAmount(new BigNumber(0));
    onClose();
  };

  useEffect(() => {
    let newMaximumTransactionAmount: BigNumber;

    if (fromAccount && network && selectedAsset) {
      newMaximumTransactionAmount = calculateMaxTransactionAmount({
        account: fromAccount,
        assetId: selectedAsset.id, // native currency should have an asset id of 0
        network,
      });

      setMaximumTransactionAmount(newMaximumTransactionAmount);

      // if the amount exceeds the new maximum transaction amount, set the amount to the maximum transaction amount
      if (amount?.gt(newMaximumTransactionAmount)) {
        setAmount(newMaximumTransactionAmount);
      }

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
            <VStack spacing={DEFAULT_GAP - 2} w="full">
              {/*amount*/}
              <SendAmountInput
                account={fromAccount}
                network={network}
                maximumTransactionAmount={maximumTransactionAmount}
                onValueChange={handleAmountChange}
                selectedAsset={selectedAsset}
                value={amount}
              />

              {/*select asset*/}
              <VStack w="full">
                {/*label*/}
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  {t<string>('labels.asset')}
                </Text>

                <AssetSelect
                  account={fromAccount}
                  assets={assets}
                  includeNativeCurrency={true}
                  network={network}
                  onAssetChange={handleAssetChange}
                  value={selectedAsset}
                />
              </VStack>

              {/*select from account*/}
              <VStack w="full">
                {/*label*/}
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  {t<string>('labels.from')}
                </Text>

                <AccountSelect
                  accounts={accounts}
                  onSelect={handleFromAccountChange}
                  value={fromAccount}
                />
              </VStack>
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
