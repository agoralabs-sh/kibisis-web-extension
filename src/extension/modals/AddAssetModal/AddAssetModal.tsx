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
  MutableRefObject,
  ReactNode,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import IconButton from '@extension/components/IconButton';
import AddAssetModalArc200AssetSummaryContent from './AddAssetModalArc200AssetSummaryContent';
import AddAssetModalStandardAssetSummaryContent from './AddAssetModalStandardAssetSummaryContent';
import AddAssetArc200AssetItem from './AddAssetArc200AssetItem';
import AddAssetStandardAssetItem from './AddAssetStandardAssetItem';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum, ErrorCodeEnum } from '@extension/enums';

// features
import {
  addArc200AssetHoldingThunk,
  updateAccountsThunk,
} from '@extension/features/accounts';
import {
  addStandardAssetThunk,
  clearAssets,
  IAssetsWithNextToken,
  IQueryArc200AssetPayload,
  IQueryByIdAsyncThunkConfig,
  IQueryStandardAssetPayload,
  queryArc200AssetThunk,
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
  useSelectAddAssetArc200Assets,
  useSelectAddAssetConfirming,
  useSelectAddAssetFetching,
  useSelectAddAssetSelectedAsset,
  useSelectAddAssetStandardAssets,
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
  IAssetTypes,
  IExplorer,
  INetworkWithTransactionParams,
  IStandardAsset,
} from '@extension/types';

// utils
import { isNumericString } from '@extension/utils';
import AddAssetModalStandardAssetConfirmingContent from '@extension/modals/AddAssetModal/AddAssetModalStandardAssetConfirmingContent';

interface IProps {
  onClose: () => void;
}

const AddAssetModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const assetContainerRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);
  // selectors
  const account: IAccount | null = useSelectAddAssetAccount();
  const accounts: IAccount[] = useSelectAccounts();
  const arc200Assets: IArc200Asset[] = useSelectAddAssetArc200Assets();
  const confirming: boolean = useSelectAddAssetConfirming();
  const explorer: IExplorer | null = useSelectPreferredBlockExplorer();
  const fetching: boolean = useSelectAddAssetFetching();
  const selectedNetwork: INetworkWithTransactionParams | null =
    useSelectSelectedNetwork();
  const selectedAsset: IAssetTypes | null = useSelectAddAssetSelectedAsset();
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
      IQueryArc200AssetPayload,
      IQueryByIdAsyncThunkConfig,
      IAssetsWithNextToken<IArc200Asset>
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
              description: `Please contact support with code "${error.code}" and describe what happened.`,
              ephemeral: true,
              title: t<string>('errors.titles.code'),
              type: 'error',
            })
          );
          break;
      }
    }
  };
  const handleAddStandardAssetClick = async () => {
    let transactionId: string | null;

    if (
      validatePassword() ||
      !selectedNetwork ||
      !account ||
      !selectedAsset ||
      selectedAsset.type !== AssetTypeEnum.Standard
    ) {
      return;
    }

    try {
      transactionId = await dispatch(addStandardAssetThunk(password)).unwrap();

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
              description: `Please contact support with code "${error.code}" and describe what happened.`,
              ephemeral: true,
              title: t<string>('errors.titles.code'),
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
            queryArc200AssetThunk({
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
          case AssetTypeEnum.Arc200:
            return (
              <AddAssetModalArc200AssetSummaryContent
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
                <AddAssetArc200AssetItem
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
            <PasswordInput
              error={passwordError}
              hint={t<string>('captions.mustEnterPasswordToAuthorizeOptIn')}
              onChange={onPasswordChange}
              value={password}
            />

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
