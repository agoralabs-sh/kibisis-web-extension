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

// errors
import { BaseExtensionError } from '@extension/errors';

// features
import { addArc200AssetHoldingThunk } from '@extension/features/accounts';
import {
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
  useSelectAddAssetAccount,
  useSelectAddAssetArc200Assets,
  useSelectAddAssetError,
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
  IExplorer,
  INetworkWithTransactionParams,
  IStandardAsset,
} from '@extension/types';

// utils
import { isNumericString } from '@extension/utils';

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
  const arc200Assets: IArc200Asset[] = useSelectAddAssetArc200Assets();
  const error: BaseExtensionError | null = useSelectAddAssetError();
  const explorer: IExplorer | null = useSelectPreferredBlockExplorer();
  const fetching: boolean = useSelectAddAssetFetching();
  const selectedNetwork: INetworkWithTransactionParams | null =
    useSelectSelectedNetwork();
  const selectedAsset: IArc200Asset | IStandardAsset | null =
    useSelectAddAssetSelectedAsset();
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
  const allAssets: (IArc200Asset | IStandardAsset)[] = [
    ...arc200Assets,
    ...standardAssets,
  ]
    .sort((a, b) => {
      const aName: string = a.name?.toUpperCase() || '';
      const bName: string = b.name?.toUpperCase() || '';

      return aName < bName ? -1 : aName > bName ? 1 : 0;
    }) // sort each alphabetically by name
    .sort((a, b) => (a.verified === b.verified ? 0 : a.verified ? -1 : 1)); // then sort to bring the verified to the front
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
    setQueryArc200AssetDispatch(null);
    setQueryStandardAssetDispatch(null);
    onClose();
  };
  const handleKeyUp = () => {
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
  };
  const handleSelectAssetClick = (asset: IArc200Asset | IStandardAsset) =>
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
            return (
              <AddAssetModalStandardAssetSummaryContent
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
    let buttonNode: ReactNode;

    if (selectedAsset) {
      buttonNode = (
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

      // for standard assets, we need a password to authorize the opt-in transaction
      if (selectedAsset.type === AssetTypeEnum.Standard) {
        return (
          <VStack alignItems="flex-start" spacing={4} w="full">
            <PasswordInput
              error={passwordError}
              hint={t<string>('captions.mustEnterPasswordToSendTransaction')}
              onChange={onPasswordChange}
              value={password}
            />

            {buttonNode}
          </VStack>
        );
      }

      return buttonNode;
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

        <ModalBody display="flex" px={0}>
          {renderContent()}
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>{renderFooter()}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddAssetModal;
