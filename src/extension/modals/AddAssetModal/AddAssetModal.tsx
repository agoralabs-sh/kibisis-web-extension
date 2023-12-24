import {
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import IconButton from '@extension/components/IconButton';
import AddAssetArc200AssetItem from './AddAssetArc200AssetItem';
import AddAssetModalArc200SummaryContent from './AddAssetModalArc200SummaryContent';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum, ErrorCodeEnum } from '@extension/enums';

// errors
import { BaseExtensionError } from '@extension/errors';

// features
import { addArc200AssetHoldingThunk } from '@extension/features/accounts';
import {
  clearAssets,
  IQueryByIdAsyncThunkConfig,
  IQueryByIdResult,
  queryByIdThunk,
  setSelectedAsset,
} from '@extension/features/add-asset';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';

// selectors
import {
  useSelectAddAssetAccount,
  useSelectAddAssetArc200Assets,
  useSelectAddAssetError,
  useSelectAddAssetFetching,
  useSelectAddAssetSelectedAsset,
  useSelectPreferredBlockExplorer,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import {
  IAccount,
  IAppThunkDispatch,
  IAppThunkDispatchReturn,
  IArc200Asset,
  IExplorer,
  INetworkWithTransactionParams,
  IStandardAsset,
} from '@extension/types';

interface IProps {
  onClose: () => void;
}

const AddAssetModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const account: IAccount | null = useSelectAddAssetAccount();
  const arc200Assets: IArc200Asset[] = useSelectAddAssetArc200Assets();
  const error: BaseExtensionError | null = useSelectAddAssetError();
  const explorer: IExplorer | null = useSelectPreferredBlockExplorer();
  const fetching: boolean = useSelectAddAssetFetching();
  const selectedNetwork: INetworkWithTransactionParams | null =
    useSelectSelectedNetwork();
  const selectedAsset: IArc200Asset | IStandardAsset | null =
    useSelectAddAssetSelectedAsset();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  // state
  const [query, setQuery] = useState<string>('');
  const [queryByIdDispatch, setQueryByIdDispatch] =
    useState<IAppThunkDispatchReturn<
      IQueryByIdAsyncThunkConfig,
      IQueryByIdResult
    > | null>(null);
  // misc
  const isOpen: boolean = !!account;
  // handlers
  const handleAddAssetClick = async () => {
    let updatedAccount: IAccount | null;

    if (!selectedNetwork || !account || !selectedAsset) {
      return;
    }

    try {
      updatedAccount = await dispatch(
        addArc200AssetHoldingThunk({
          accountId: account.id,
          appId: selectedAsset.id,
          genesisHash: selectedNetwork.genesisHash,
        })
      ).unwrap();

      if (updatedAccount && selectedAsset) {
        dispatch(
          createNotification({
            title: t<string>('headings.addedAsset', {
              symbol:
                selectedAsset.type === AssetTypeEnum.Standard
                  ? selectedAsset.unitName
                  : selectedAsset.symbol,
            }),
            type: 'success',
          })
        );
      }

      handleClose();
    } catch (error) {
      dispatch(
        createNotification({
          description: t<string>('errors.descriptions.code', {
            context: error.code,
          }),
          ephemeral: true,
          title: t<string>('errors.titles.code', { context: error.code }),
          type: 'error',
        })
      );
    }
  };
  const handleCancelClick = () => handleClose();
  const handleClearQuery = () => {
    setQuery('');
    dispatch(clearAssets());
  };
  const handleClose = () => {
    setQuery('');
    setQueryByIdDispatch(null);
    onClose();
  };
  const handleKeyUp = () => {
    // if we have only numbers, we have an asset/app id
    if (new RegExp(/^\d+$/).test(query)) {
      // abort any previous request
      if (queryByIdDispatch) {
        queryByIdDispatch.abort();
      }

      setQueryByIdDispatch(dispatch(queryByIdThunk(query)));

      return;
    }
  };
  const handleOnQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };
  const handlePreviousClick = () => {
    dispatch(setSelectedAsset(null));
  };
  const handleSelectArc200AssetClick = (asset: IArc200Asset) =>
    dispatch(setSelectedAsset(asset));
  // renders
  const renderContent = () => {
    if (selectedNetwork) {
      if (selectedAsset) {
        switch (selectedAsset.type) {
          case AssetTypeEnum.Arc200:
            return (
              <AddAssetModalArc200SummaryContent
                asset={selectedAsset}
                explorer={explorer}
                network={selectedNetwork}
              />
            );
          default:
            break;
        }
      }
    }

    return (
      <VStack flexGrow={1} spacing={DEFAULT_GAP / 2} w="full">
        <Text color={defaultTextColor} fontSize="sm" textAlign="left" w="full">
          {t<string>('captions.addAsset')}
        </Text>

        <InputGroup w="full">
          <Input
            colorScheme={primaryColorScheme}
            focusBorderColor={primaryColor}
            onChange={handleOnQueryChange}
            onKeyUp={handleKeyUp}
            size="md"
            type="text"
            value={query}
            w="full"
          />

          <InputRightElement>
            {fetching && (
              <Spinner
                thickness="1px"
                speed="0.65s"
                color={defaultTextColor}
                size="sm"
              />
            )}
            {!fetching && query.length > 0 && (
              <IconButton
                aria-label="Clear query"
                icon={IoCloseOutline}
                onClick={handleClearQuery}
                size="sm"
                variant="ghost"
              />
            )}
          </InputRightElement>
        </InputGroup>

        <VStack flexGrow={1} overflowY="scroll" spacing={0} w="full">
          {selectedNetwork &&
            arc200Assets.map((value, index) => (
              <AddAssetArc200AssetItem
                asset={value}
                key={`add-asset-modal-item-${index}`}
                network={selectedNetwork}
                onClick={handleSelectArc200AssetClick}
              />
            ))}
        </VStack>
      </VStack>
    );
  };
  const renderFooter = () => {
    if (selectedAsset) {
      return (
        <HStack spacing={DEFAULT_GAP - 2} w="full">
          <Button
            onClick={handlePreviousClick}
            size="lg"
            variant="outline"
            w="full"
          >
            {t<string>('buttons.previous')}
          </Button>

          <Button
            onClick={handleAddAssetClick}
            size="lg"
            variant="solid"
            w="full"
          >
            {t<string>('buttons.addAsset')}
          </Button>
        </HStack>
      );
    }

    return (
      <Button onClick={handleCancelClick} size="lg" variant="outline" w="full">
        {t<string>('buttons.cancel')}
      </Button>
    );
  };

  useEffect(() => {
    if (error) {
      switch (error.code) {
        case ErrorCodeEnum.OfflineError:
          dispatch(
            createNotification({
              ephemeral: true,
              title: t<string>('headings.offline'),
              type: 'error',
            })
          );
          break;
        default:
          dispatch(
            createNotification({
              description: `Please contact support with code "${error.code}" and describe what happened.`,
              ephemeral: true,
              title: t<string>('errors.titles.code'),
              type: 'error',
            })
          );
          break;
      }
    }
  }, [error]);

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
            {t<string>('headings.addAsset')}
          </Heading>
        </ModalHeader>

        <ModalBody display="flex" px={DEFAULT_GAP}>
          {renderContent()}
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>{renderFooter()}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddAssetModal;
