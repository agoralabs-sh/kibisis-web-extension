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
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import IconButton from '@extension/components/IconButton';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';
import AddAssetARC0200AssetItem from './AddAssetARC0200AssetItem';
import AddAssetModalARC0200AssetSummaryContent from './AddAssetModalARC0200AssetSummaryContent';
import AddAssetModalStandardAssetConfirmingContent from './AddAssetModalStandardAssetConfirmingContent';
import AddAssetModalStandardAssetSummaryContent from './AddAssetModalStandardAssetSummaryContent';
import AddAssetStandardAssetItem from './AddAssetStandardAssetItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum, ErrorCodeEnum } from '@extension/enums';

// features
import {
  addARC0200AssetHoldingsThunk,
  updateAccountsThunk,
} from '@extension/features/accounts';
import {
  addStandardAssetThunk,
  clearAssets,
  IAssetsWithNextToken,
  IQueryARC0200AssetPayload,
  IQueryByIdAsyncThunkConfig,
  IQueryStandardAssetPayload,
  queryARC0200AssetThunk,
  queryStandardAssetThunk,
  setSelectedAsset,
} from '@extension/features/add-asset';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';

// selectors
import {
  useSelectAccounts,
  useSelectAddAssetAccount,
  useSelectAddAssetARC0200Assets,
  useSelectAddAssetConfirming,
  useSelectAddAssetFetching,
  useSelectAddAssetSelectedAsset,
  useSelectAddAssetStandardAssets,
  useSelectLogger,
  useSelectPasswordLockPassword,
  useSelectPreferredBlockExplorer,
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
  IExplorer,
  INetworkWithTransactionParams,
  ISettings,
  IStandardAsset,
} from '@extension/types';

// utils
import isNumericString from '@extension/utils/isNumericString';

interface IProps {
  onClose: () => void;
}

const AddAssetModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const passwordInputRef: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const assetContainerRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);
  // selectors
  const account: IAccount | null = useSelectAddAssetAccount();
  const accounts: IAccount[] = useSelectAccounts();
  const arc200Assets: IARC0200Asset[] = useSelectAddAssetARC0200Assets();
  const confirming: boolean = useSelectAddAssetConfirming();
  const explorer: IExplorer | null = useSelectPreferredBlockExplorer();
  const fetching: boolean = useSelectAddAssetFetching();
  const logger: ILogger = useSelectLogger();
  const passwordLockPassword: string | null = useSelectPasswordLockPassword();
  const selectedNetwork: INetworkWithTransactionParams | null =
    useSelectSelectedNetwork();
  const selectedAsset: IAssetTypes | null = useSelectAddAssetSelectedAsset();
  const settings: ISettings = useSelectSettings();
  const standardAssets: IStandardAsset[] = useSelectAddAssetStandardAssets();
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
  const [queryArc200AssetDispatch, setQueryArc200AssetDispatch] =
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
  const allAssets: IAssetTypes[] = [...arc200Assets, ...standardAssets];
  const isOpen: boolean = !!account;
  // handlers
  const handleAddArc200AssetClick = async () => {
    let updatedAccount: IAccount | null;

    if (
      !selectedNetwork ||
      !account ||
      !selectedAsset ||
      selectedAsset.type === AssetTypeEnum.Standard
    ) {
      return;
    }

    try {
      updatedAccount = await dispatch(
        addARC0200AssetHoldingsThunk({
          accountId: account.id,
          assets: [selectedAsset],
          genesisHash: selectedNetwork.genesisHash,
        })
      ).unwrap();

      if (updatedAccount && selectedAsset) {
        dispatch(
          createNotification({
            title: t<string>('headings.addedAsset', {
              symbol: selectedAsset.symbol,
            }),
            type: 'success',
          })
        );
      }

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
  };
  const handleAddStandardAssetClick = async () => {
    const _functionName: string = 'handleAddStandardAssetClick';
    let _password: string | null;
    let transactionId: string | null;

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
          `${AddAssetModal.name}#${_functionName}: password not valid`
        );

        return;
      }
    }

    _password = settings.security.enablePasswordLock
      ? passwordLockPassword
      : password;

    if (!_password) {
      logger.debug(
        `${AddAssetModal.name}#${_functionName}: unable to use password from password lock, value is "null"`
      );

      return;
    }

    try {
      transactionId = await dispatch(addStandardAssetThunk(_password)).unwrap();

      if (transactionId) {
        dispatch(
          createNotification({
            title: t<string>('headings.addedAsset', {
              symbol:
                selectedAsset.unitName ||
                selectedAsset.name ||
                selectedAsset.id,
            }),
            type: 'success',
          })
        );

        // force an update of account information and transactions
        dispatch(
          updateAccountsThunk({
            accountIds: [account.id],
            forceInformationUpdate: true,
            refreshTransactions: true,
          })
        );

        handleClose();
      }
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
  };
  const handleCancelClick = () => handleClose();
  const handleClearQuery = () => {
    setQuery('');
    dispatch(clearAssets());
  };
  const handleClose = () => {
    resetPassword();
    setQuery('');
    setQueryArc200AssetDispatch(null);
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
        if (queryArc200AssetDispatch) {
          queryArc200AssetDispatch.abort();
        }

        setQueryArc200AssetDispatch(
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
    if (selectedNetwork) {
      if (selectedAsset) {
        switch (selectedAsset.type) {
          case AssetTypeEnum.ARC0200:
            return (
              <AddAssetModalARC0200AssetSummaryContent
                asset={selectedAsset}
                explorer={explorer}
                network={selectedNetwork}
              />
            );
          case AssetTypeEnum.Standard:
            if (confirming) {
              return (
                <AddAssetModalStandardAssetConfirmingContent
                  asset={selectedAsset}
                />
              );
            }

            return (
              <AddAssetModalStandardAssetSummaryContent
                accounts={accounts}
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
                <AddAssetStandardAssetItem
                  asset={value}
                  key={`add-asset-modal-item-${index}`}
                  network={selectedNetwork}
                  onClick={handleSelectAssetClick}
                />
              ) : (
                <AddAssetARC0200AssetItem
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
            onClick={handleAddArc200AssetClick}
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

export default AddAssetModal;
