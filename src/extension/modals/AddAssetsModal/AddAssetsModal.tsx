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
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, {
  ChangeEvent,
  FC,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline, IoCloseOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import IconButton from '@extension/components/IconButton';
import AddAssetsARC0200AssetItem from './AddAssetsARC0200AssetItem';
import AddAssetsARC0200AssetSummaryModalContent from './AddAssetsARC0200AssetSummaryModalContent';
import AddAssetsConfirmingModalContent from './AddAssetsConfirmingModalContent';
import AddAssetsStandardAssetSummaryModalContent from './AddAssetsStandardAssetSummaryModalContent';
import AddAssetsStandardAssetItem from './AddAssetsStandardAssetItem';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum, ErrorCodeEnum } from '@extension/enums';

// errors
import { BaseExtensionError } from '@extension/errors';

// features
import {
  addARC0200AssetHoldingsThunk,
  addStandardAssetHoldingsThunk,
} from '@extension/features/accounts';
import {
  clearAssets,
  IAssetsWithNextToken,
  IQueryARC0200AssetPayload,
  IQueryByIdAsyncThunkConfig,
  IQueryStandardAssetPayload,
  queryARC0200AssetThunk,
  queryStandardAssetThunk,
  setConfirming,
  setSelectedAsset,
} from '@extension/features/add-assets';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useIsNewSelectedAsset from './hooks/useIsNewSelectedAsset';

// modals
import AuthenticationModal from '@extension/modals/AuthenticationModal';

// selectors
import {
  useSelectAccounts,
  useSelectAddAssetsAccount,
  useSelectAddAssetsARC0200Assets,
  useSelectAddAssetsConfirming,
  useSelectAddAssetsFetching,
  useSelectAddAssetsSelectedAsset,
  useSelectAddAssetsStandardAssets,
  useSelectLogger,
  useSelectSettingsPreferredBlockExplorer,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';
import QuestsService, {
  QuestNameEnum,
} from '@extension/services/QuestsService';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAccountInformation,
  IAppThunkDispatch,
  IAppThunkDispatchReturn,
  IARC0200Asset,
  IAssetTypes,
  IMainRootState,
  IModalProps,
  IStandardAsset,
  TEncryptionCredentials,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import isNumericString from '@extension/utils/isNumericString';
import isReKeyedAuthAccountAvailable from '@extension/utils/isReKeyedAuthAccountAvailable';

const AddAssetsModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const assetContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const account = useSelectAddAssetsAccount();
  const accounts = useSelectAccounts();
  const arc0200Assets = useSelectAddAssetsARC0200Assets();
  const confirming = useSelectAddAssetsConfirming();
  const explorer = useSelectSettingsPreferredBlockExplorer();
  const fetching = useSelectAddAssetsFetching();
  const logger = useSelectLogger();
  const selectedNetwork = useSelectSelectedNetwork();
  const selectedAsset = useSelectAddAssetsSelectedAsset();
  const standardAssets = useSelectAddAssetsStandardAssets();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const isNewSelectedAsset = useIsNewSelectedAsset(selectedAsset);
  const isOpen = useMemo<boolean>(() => {
    let accountInformation: IAccountInformation | null;

    if (!account || !selectedNetwork) {
      return false;
    }

    accountInformation = AccountService.extractAccountInformationForNetwork(
      account,
      selectedNetwork
    );

    // if the account has been re-keyed, check that the address is available
    if (accountInformation && accountInformation.authAddress) {
      return isReKeyedAuthAccountAvailable({
        accounts,
        authAddress: accountInformation.authAddress,
      });
    }

    // if it has not been re-keyed, check if it is a watch account
    return !account.watchAccount;
  }, [account, accounts, selectedNetwork]);
  const primaryColor = usePrimaryColor();
  const primaryColorScheme = usePrimaryColorScheme();
  // state
  const [query, setQuery] = useState<string>('');
  const [queryARC0200AssetDispatch, setQueryARC0200AssetDispatch] =
    useState<IAppThunkDispatchReturn<
      IQueryARC0200AssetPayload,
      IQueryByIdAsyncThunkConfig,
      IAssetsWithNextToken<IARC0200Asset>
    > | null>(null);
  const [queryStandardAssetDispatch, setQueryStandardAssetDispatch] =
    useState<IAppThunkDispatchReturn<
      IQueryStandardAssetPayload,
      IQueryByIdAsyncThunkConfig,
      IAssetsWithNextToken<IStandardAsset>
    > | null>(null);
  // misc
  const allAssets = [...arc0200Assets, ...standardAssets];
  // handlers
  const handleAddARC0200AssetClick = async () => {
    let hasQuestBeenCompletedToday: boolean = false;
    let questsService: QuestsService;
    let questsSent: boolean = false;

    if (
      !selectedNetwork ||
      !account ||
      !selectedAsset ||
      selectedAsset.type !== AssetTypeEnum.ARC0200
    ) {
      return;
    }

    dispatch(setConfirming(true));

    try {
      await dispatch(
        addARC0200AssetHoldingsThunk({
          accountId: account.id,
          assets: [selectedAsset],
          genesisHash: selectedNetwork.genesisHash,
        })
      ).unwrap();

      questsService = new QuestsService({
        logger,
      });
      hasQuestBeenCompletedToday =
        await questsService.hasQuestBeenCompletedTodayByName(
          QuestNameEnum.AddARC0200AssetAction
        );

      // track the action if this is a new asset
      if (isNewSelectedAsset) {
        questsSent = await questsService.addARC0200AssetQuest(
          convertPublicKeyToAVMAddress(
            PrivateKeyService.decode(account.publicKey)
          ),
          {
            appID: selectedAsset.id,
            genesisHash: selectedNetwork.genesisHash,
          }
        );
      }

      // if the quest has not been completed today (since 00:00 UTC), show a quest notification
      if (questsSent && !hasQuestBeenCompletedToday) {
        dispatch(
          createNotification({
            description: t<string>('captions.questComplete'),
            title: t<string>('headings.congratulations'),
            type: 'achievement',
          })
        );
      }

      dispatch(
        createNotification({
          title: t<string>('headings.addedAsset', {
            symbol: selectedAsset.symbol,
          }),
          type: 'success',
        })
      );

      handleClose();
    } catch (error) {
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
              description: t<string>('errors.descriptions.code', {
                code: error.code,
                context: error.code,
              }),
              ephemeral: true,
              title: t<string>('errors.titles.code', { context: error.code }),
              type: 'error',
            })
          );
          break;
      }
    }

    dispatch(setConfirming(false));
  };
  const handleAddStandardAssetClick = () => onAuthenticationModalOpen();
  const handleOnAuthenticationModalConfirm = async (
    result: TEncryptionCredentials
  ) => {
    let hasQuestBeenCompletedToday: boolean = false;
    let questsSent: boolean = false;
    let questsService: QuestsService;

    if (
      !selectedNetwork ||
      !account ||
      !selectedAsset ||
      selectedAsset.type !== AssetTypeEnum.Standard
    ) {
      return;
    }

    dispatch(setConfirming(true));

    try {
      await dispatch(
        addStandardAssetHoldingsThunk({
          accountId: account.id,
          assets: [selectedAsset],
          genesisHash: selectedNetwork.genesisHash,
          ...result,
        })
      ).unwrap();

      questsService = new QuestsService({
        logger,
      });
      hasQuestBeenCompletedToday =
        await questsService.hasQuestBeenCompletedTodayByName(
          QuestNameEnum.AddStandardAssetAction
        );

      // track the action if this is a new asset
      if (isNewSelectedAsset) {
        questsSent = await questsService.addStandardAssetQuest(
          convertPublicKeyToAVMAddress(
            PrivateKeyService.decode(account.publicKey)
          ),
          {
            assetID: selectedAsset.id,
            genesisHash: selectedNetwork.genesisHash,
          }
        );
      }

      // if the quest has not been completed today (since 00:00 UTC), show a quest notification
      if (questsSent && !hasQuestBeenCompletedToday) {
        dispatch(
          createNotification({
            description: t<string>('captions.questComplete'),
            title: t<string>('headings.congratulations'),
            type: 'achievement',
          })
        );
      }

      dispatch(
        createNotification({
          title: t<string>('headings.addedAsset', {
            symbol:
              selectedAsset.unitName || selectedAsset.name || selectedAsset.id,
          }),
          type: 'success',
        })
      );

      handleClose();
    } catch (error) {
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
              description: t<string>('errors.descriptions.code', {
                code: error.code,
                context: error.code,
              }),
              ephemeral: true,
              title: t<string>('errors.titles.code', { context: error.code }),
              type: 'error',
            })
          );
          break;
      }
    }

    dispatch(setConfirming(false));
  };
  const handleCancelClick = () => handleClose();
  const handleClearQuery = () => {
    setQuery('');
    dispatch(clearAssets());
  };
  const handleClose = () => {
    setQuery('');
    setQueryARC0200AssetDispatch(null);
    setQueryStandardAssetDispatch(null);
    onClose && onClose();
  };
  const handleKeyUp = () => {
    // if the query is empty, clear assets
    if (query.length <= 0) {
      dispatch(clearAssets());
    }

    if (!account) {
      return;
    }

    // abort the previous standard assets request
    if (queryStandardAssetDispatch) {
      queryStandardAssetDispatch.abort();
    }

    // if we have only numbers, we have an asset/app id
    if (isNumericString(query)) {
      // abort the previous arc200 assets request
      if (queryARC0200AssetDispatch) {
        queryARC0200AssetDispatch.abort();
      }

      setQueryARC0200AssetDispatch(
        dispatch(
          queryARC0200AssetThunk({
            accountId: account.id,
            applicationId: query,
            refresh: true,
          })
        )
      );

      // only add search for standard assets for non-watch accounts
      if (!account.watchAccount) {
        setQueryStandardAssetDispatch(
          dispatch(
            queryStandardAssetThunk({
              accountId: account.id,
              assetId: query,
              nameOrUnit: null,
              refresh: true,
            })
          )
        );
      }

      return;
    }

    // do not search for standard assets for watch accounts
    if (account.watchAccount) {
      return;
    }

    // for alphanumeric strings, query the name/unit of the standard asset
    setQueryStandardAssetDispatch(
      dispatch(
        queryStandardAssetThunk({
          accountId: account.id,
          assetId: null,
          nameOrUnit: query,
          refresh: true,
        })
      )
    );
  };
  const handleOnAuthenticationError = (error: BaseExtensionError) =>
    dispatch(
      createNotification({
        description: t<string>('errors.descriptions.code', {
          code: error.code,
          context: error.code,
        }),
        ephemeral: true,
        title: t<string>('errors.titles.code', { context: error.code }),
        type: 'error',
      })
    );
  const handleOnQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };
  const handleOnScrollEnd = () => {
    if (
      account &&
      assetContainerRef.current &&
      assetContainerRef.current.scrollHeight -
        (assetContainerRef.current.clientHeight +
          assetContainerRef.current.scrollTop) ===
        0
    ) {
      setQueryStandardAssetDispatch(
        dispatch(
          queryStandardAssetThunk({
            accountId: account.id,
            refresh: false,
            ...(isNumericString(query)
              ? {
                  assetId: query,
                  nameOrUnit: null,
                }
              : {
                  assetId: null,
                  nameOrUnit: query,
                }),
          })
        )
      );
    }
  };
  const handlePreviousClick = () => {
    dispatch(setSelectedAsset(null));
  };
  const handleSelectAssetClick = (asset: IAssetTypes) =>
    dispatch(setSelectedAsset(asset));
  // renders
  const renderContent = () => {
    if (selectedNetwork && account) {
      if (selectedAsset) {
        if (confirming) {
          return <AddAssetsConfirmingModalContent asset={selectedAsset} />;
        }

        switch (selectedAsset.type) {
          case AssetTypeEnum.ARC0200:
            return (
              <AddAssetsARC0200AssetSummaryModalContent
                asset={selectedAsset}
                blockExplorer={explorer}
                network={selectedNetwork}
              />
            );
          case AssetTypeEnum.Standard:
            return (
              <AddAssetsStandardAssetSummaryModalContent
                account={account}
                accounts={accounts}
                asset={selectedAsset}
                blockExplorer={explorer}
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
        <VStack px={DEFAULT_GAP} spacing={DEFAULT_GAP / 2} w="full">
          <Text
            color={defaultTextColor}
            fontSize="sm"
            textAlign="left"
            w="full"
          >
            {t<string>('captions.addAsset')}
          </Text>

          {/*search*/}
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
        </VStack>

        {/*asset list*/}
        <VStack
          flexGrow={1}
          onScroll={handleOnScrollEnd}
          overflowY="scroll"
          ref={assetContainerRef}
          spacing={0}
          w="full"
        >
          {selectedNetwork &&
            allAssets.map((asset, index) =>
              asset.type === AssetTypeEnum.Standard ? (
                <AddAssetsStandardAssetItem
                  added={
                    selectedNetwork &&
                    !!account?.networkInformation[
                      convertGenesisHashToHex(selectedNetwork.genesisHash)
                    ].standardAssetHoldings.find(
                      (value) => value.id === asset.id
                    )
                  }
                  asset={asset}
                  key={`add-asset-modal-item-${index}`}
                  network={selectedNetwork}
                  onClick={handleSelectAssetClick}
                />
              ) : (
                <AddAssetsARC0200AssetItem
                  added={
                    selectedNetwork &&
                    !!account?.networkInformation[
                      convertGenesisHashToHex(selectedNetwork.genesisHash)
                    ].arc200AssetHoldings.find((value) => value.id === asset.id)
                  }
                  asset={asset}
                  key={`add-asset-modal-item-${index}`}
                  network={selectedNetwork}
                  onClick={handleSelectAssetClick}
                />
              )
            )}
        </VStack>
      </VStack>
    );
  };
  const renderFooter = () => {
    let previousButtonNode: ReactNode;

    if (confirming) {
      return null;
    }

    if (selectedAsset) {
      previousButtonNode = (
        <Button
          leftIcon={<IoArrowBackOutline />}
          onClick={handlePreviousClick}
          size="lg"
          variant="outline"
          w="full"
        >
          {t<string>('buttons.previous')}
        </Button>
      );

      // for standard assets, we need a password to authorize the opt-in transaction
      if (selectedAsset.type === AssetTypeEnum.Standard) {
        return (
          <HStack spacing={DEFAULT_GAP - 2} w="full">
            {previousButtonNode}

            <Button
              onClick={handleAddStandardAssetClick}
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
        <HStack spacing={DEFAULT_GAP - 2} w="full">
          {previousButtonNode}

          <Button
            onClick={handleAddARC0200AssetClick}
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

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnAuthenticationError}
        passwordHint={t<string>('captions.mustEnterPasswordToAuthorizeOptIn')}
      />

      <Modal
        isOpen={isOpen}
        motionPreset="slideInBottom"
        onClose={handleClose}
        size="full"
        scrollBehavior="inside"
      >
        <ModalContent
          backgroundColor={BODY_BACKGROUND_COLOR}
          borderTopRadius={theme.radii['3xl']}
          borderBottomRadius={0}
        >
          <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
            <Heading color={defaultTextColor} size="md" textAlign="center">
              {t<string>('headings.addAsset')}
            </Heading>
          </ModalHeader>

          <ModalBody display="flex" px={0}>
            {renderContent()}
          </ModalBody>

          <ModalFooter p={DEFAULT_GAP}>{renderFooter()}</ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddAssetsModal;
