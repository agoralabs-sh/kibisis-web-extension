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
import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline, IoCloseOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import IconButton from '@extension/components/IconButton';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';
import AddAssetsARC0200AssetItem from './AddAssetsARC0200AssetItem';
import AddAssetsARC0200AssetSummaryModalContent from './AddAssetsARC0200AssetSummaryModalContent';
import AddAssetsConfirmingModalContent from './AddAssetsConfirmingModalContent';
import AddAssetsStandardAssetSummaryModalContent from './AddAssetsStandardAssetSummaryModalContent';
import AddAssetsStandardAssetItem from './AddAssetsStandardAssetItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum, ErrorCodeEnum } from '@extension/enums';

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
  useSelectPasswordLockPassword,
  useSelectSettingsPreferredBlockExplorer,
  useSelectSelectedNetwork,
  useSelectSettings,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IAppThunkDispatch,
  IAppThunkDispatchReturn,
  IARC0200Asset,
  IAssetTypes,
  IBlockExplorer,
  INetworkWithTransactionParams,
  ISettings,
  IStandardAsset,
} from '@extension/types';
import type { IAddAssetsModalProps } from './types';

// utils
import isNumericString from '@extension/utils/isNumericString';

const AddAssetsModal: FC<IAddAssetsModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const passwordInputRef: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const assetContainerRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);
  // selectors
  const account: IAccount | null = useSelectAddAssetsAccount();
  const accounts: IAccount[] = useSelectAccounts();
  const arc0200Assets: IARC0200Asset[] = useSelectAddAssetsARC0200Assets();
  const confirming: boolean = useSelectAddAssetsConfirming();
  const explorer: IBlockExplorer | null =
    useSelectSettingsPreferredBlockExplorer();
  const fetching: boolean = useSelectAddAssetsFetching();
  const logger: ILogger = useSelectLogger();
  const passwordLockPassword: string | null = useSelectPasswordLockPassword();
  const selectedNetwork: INetworkWithTransactionParams | null =
    useSelectSelectedNetwork();
  const selectedAsset: IAssetTypes | null = useSelectAddAssetsSelectedAsset();
  const settings: ISettings = useSelectSettings();
  const standardAssets: IStandardAsset[] = useSelectAddAssetsStandardAssets();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const {
    error: passwordError,
    onChange: onPasswordChange,
    reset: resetPassword,
    setError: setPasswordError,
    validate: validatePassword,
    value: password,
  } = usePassword();
  const primaryColor: string = usePrimaryColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
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
  const allAssets: IAssetTypes[] = [...arc0200Assets, ...standardAssets];
  const isOpen: boolean = !!account;
  // handlers
  const handleAddARC0200AssetClick = async () => {
    if (
      !selectedNetwork ||
      !account ||
      !selectedAsset ||
      selectedAsset.type === AssetTypeEnum.Standard
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
  const handleAddStandardAssetClick = async () => {
    const _functionName: string = 'handleAddStandardAssetClick';
    let _password: string | null;

    if (
      !selectedNetwork ||
      !account ||
      !selectedAsset ||
      selectedAsset.type !== AssetTypeEnum.Standard
    ) {
      return;
    }

    // if there is no password lock
    if (!settings.security.enablePasswordLock && !passwordLockPassword) {
      // validate the password input
      if (validatePassword()) {
        logger.debug(
          `${AddAssetsModal.name}#${_functionName}: password not valid`
        );

        return;
      }
    }

    _password = settings.security.enablePasswordLock
      ? passwordLockPassword
      : password;

    if (!_password) {
      logger.debug(
        `${AddAssetsModal.name}#${_functionName}: unable to use password from password lock, value is "null"`
      );

      return;
    }

    dispatch(setConfirming(true));

    try {
      await dispatch(
        addStandardAssetHoldingsThunk({
          accountId: account.id,
          assets: [selectedAsset],
          genesisHash: selectedNetwork.genesisHash,
          password: _password,
        })
      ).unwrap();

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
        case ErrorCodeEnum.InvalidPasswordError:
          setPasswordError(t<string>('errors.inputs.invalidPassword'));

          break;
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
    resetPassword();
    setQuery('');
    setQueryARC0200AssetDispatch(null);
    setQueryStandardAssetDispatch(null);
    onClose();
  };
  const handleKeyUp = () => {
    // if the query is empty, clear assets
    if (query.length <= 0) {
      dispatch(clearAssets());
    }

    if (account) {
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
    }
  };
  const handleKeyUpPasswordInput = async (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      await handleAddStandardAssetClick();
    }
  };
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
    resetPassword();
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
                explorer={explorer}
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
            allAssets.map((value, index) =>
              value.type === AssetTypeEnum.Standard ? (
                <AddAssetsStandardAssetItem
                  asset={value}
                  key={`add-asset-modal-item-${index}`}
                  network={selectedNetwork}
                  onClick={handleSelectAssetClick}
                />
              ) : (
                <AddAssetsARC0200AssetItem
                  asset={value}
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
          <VStack alignItems="flex-start" spacing={4} w="full">
            {!settings.security.enablePasswordLock && !passwordLockPassword && (
              <PasswordInput
                error={passwordError}
                hint={t<string>('captions.mustEnterPasswordToAuthorizeOptIn')}
                inputRef={passwordInputRef}
                onChange={onPasswordChange}
                onKeyUp={handleKeyUpPasswordInput}
                value={password}
              />
            )}

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
          </VStack>
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

  // only standard assets will have the password submit
  useEffect(() => {
    if (
      selectedAsset &&
      selectedAsset.type === AssetTypeEnum.Standard &&
      passwordInputRef.current
    ) {
      passwordInputRef.current.focus();
    }
  }, [selectedAsset]);

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

        <ModalBody display="flex" px={0}>
          {renderContent()}
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>{renderFooter()}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddAssetsModal;
