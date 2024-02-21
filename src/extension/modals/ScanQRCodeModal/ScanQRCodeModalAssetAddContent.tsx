import {
  Code,
  Heading,
  HStack,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import {
  decodeURLSafe as decodeBase63URLSafe,
  encode as encodeBase64,
} from '@stablelib/base64';
import BigNumber from 'bignumber.js';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from 'react-router-dom';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';
import Button from '@extension/components/Button';
import CopyIconButton from '@extension/components/CopyIconButton';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
import ModalItem from '@extension/components/ModalItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  MODAL_ITEM_HEIGHT,
} from '@extension/constants';

// enums
import { ARC0300QueryEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useUpdateAssets from './hooks/useUpdateAssets';

// selectors
import { useSelectLogger, useSelectNetworks } from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { ILogger } from '@common/types';
import type {
  IAppThunkDispatch,
  IARC0200Asset,
  IARC0300AssetAddSchema,
  INetwork,
} from '@extension/types';

// utils
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import ChainBadge from '@extension/components/ChainBadge';

interface IProps {
  onComplete: () => void;
  onPreviousClick: () => void;
  schema: IARC0300AssetAddSchema;
}

const ScanQRCodeModalAssetAddContent: FC<IProps> = ({
  onComplete,
  onPreviousClick,
  schema,
}: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // selectors
  const logger: ILogger = useSelectLogger();
  const networks: INetwork[] = useSelectNetworks();
  // hooks
  const {
    assets,
    loading,
    reset: resetUpdateAssets,
  } = useUpdateAssets([schema.paths[1]]);
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  // states
  const [saving, setSaving] = useState<boolean>(false);
  // misc
  const asset: IARC0200Asset | null = assets[0] || null;
  const network: INetwork | null =
    networks.find(
      (value) =>
        value.genesisHash ===
        encodeBase64(
          decodeBase63URLSafe(schema.query[ARC0300QueryEnum.GenesisHash])
        )
    ) || null;
  const totalSupplyInStandardUnits: BigNumber = asset
    ? convertToStandardUnit(new BigNumber(asset.totalSupply), asset.decimals)
    : new BigNumber('0');
  // handlers
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onOpen() : onClose();
  const handlePreviousClick = () => {
    reset();
    onPreviousClick();
  };
  const handleAddClick = async () => {
    const _functionName: string = 'handleAddClick';

    // clean up and close
    handleOnComplete();
  };
  const handleOnComplete = () => {
    reset();
    onComplete();
  };
  const reset = () => {
    resetUpdateAssets();
    setSaving(false);
  };

  return (
    <ModalContent
      backgroundColor={BODY_BACKGROUND_COLOR}
      borderTopRadius={theme.radii['3xl']}
      borderBottomRadius={0}
    >
      {/*header*/}
      <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
        <Heading color={defaultTextColor} size="md" textAlign="center">
          {t<string>('headings.addAsset')}
        </Heading>
      </ModalHeader>

      {/*body*/}
      <ModalBody display="flex" px={DEFAULT_GAP}>
        <VStack alignItems="center" flexGrow={1} spacing={DEFAULT_GAP} w="full">
          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {t<string>('captions.addAssetURI')}
          </Text>

          {!asset || !network || loading ? (
            <VStack spacing={2} w="full">
              <ModalSkeletonItem />
              <ModalSkeletonItem />
              <ModalSkeletonItem />
            </VStack>
          ) : (
            <VStack spacing={2} w="full">
              {/*asset icon*/}
              <AssetAvatar
                asset={asset}
                fallbackIcon={
                  <AssetIcon
                    color={primaryButtonTextColor}
                    networkTheme={network?.chakraTheme}
                    h={6}
                    w={6}
                  />
                }
                size="md"
              />

              {/*symbol*/}
              <Tooltip aria-label="ARC200 asset symbol" label={asset.symbol}>
                <Text
                  color={defaultTextColor}
                  fontSize="md"
                  maxW={200}
                  noOfLines={1}
                  textAlign="center"
                >
                  {asset.symbol}
                </Text>
              </Tooltip>

              {/*name*/}
              <ModalTextItem
                label={`${t<string>('labels.name')}:`}
                tooltipLabel={asset.name}
                value={asset.name}
              />

              {/*id*/}
              <ModalItem
                label={`${t<string>('labels.applicationId')}:`}
                tooltipLabel={asset.id}
                value={
                  <HStack spacing={0}>
                    <Code
                      borderRadius="md"
                      fontSize="xs"
                      wordBreak="break-word"
                    >
                      {asset.id}
                    </Code>

                    <CopyIconButton
                      ariaLabel={t<string>('labels.copyApplicationId')}
                      tooltipLabel={t<string>('labels.copyApplicationId')}
                      size="sm"
                      value={asset.id}
                    />
                  </HStack>
                }
              />

              {/*type*/}
              <ModalItem
                label={`${t<string>('labels.chain')}:`}
                value={<ChainBadge network={network} />}
              />

              {/*type*/}
              <ModalItem
                label={`${t<string>('labels.type')}:`}
                value={<AssetBadge type={asset.type} />}
              />

              <MoreInformationAccordion
                color={defaultTextColor}
                fontSize="sm"
                isOpen={isOpen}
                minButtonHeight={MODAL_ITEM_HEIGHT}
                onChange={handleMoreInformationToggle}
              >
                <VStack spacing={2} w="full">
                  {/*decimals*/}
                  <ModalTextItem
                    label={`${t<string>('labels.decimals')}:`}
                    value={asset.decimals.toString()}
                  />

                  {/*total supply*/}
                  <ModalTextItem
                    label={`${t<string>('labels.totalSupply')}:`}
                    tooltipLabel={formatCurrencyUnit(
                      totalSupplyInStandardUnits,
                      {
                        decimals: asset.decimals,
                        thousandSeparatedOnly: true,
                      }
                    )}
                    value={formatCurrencyUnit(
                      convertToStandardUnit(
                        new BigNumber(asset.totalSupply),
                        asset.decimals
                      ),
                      { decimals: asset.decimals }
                    )}
                  />
                </VStack>
              </MoreInformationAccordion>
            </VStack>
          )}
        </VStack>
      </ModalBody>

      {/*footer*/}
      <ModalFooter p={DEFAULT_GAP}>
        <VStack alignItems="flex-start" spacing={4} w="full">
          <HStack spacing={4} w="full">
            {/*previous button*/}
            <Button
              leftIcon={<IoArrowBackOutline />}
              onClick={handlePreviousClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.previous')}
            </Button>

            {/*add button*/}
            <Button
              isLoading={loading || saving}
              onClick={handleAddClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.add')}
            </Button>
          </HStack>
        </VStack>
      </ModalFooter>
    </ModalContent>
  );
};

export default ScanQRCodeModalAssetAddContent;
