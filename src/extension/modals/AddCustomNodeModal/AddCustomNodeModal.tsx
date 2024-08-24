import {
  Checkbox,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import type { Algodv2 } from 'algosdk';
import React, { type ChangeEvent, type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoSaveOutline,
} from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';

// components
import Button from '@extension/components/Button';
import CustomNodeSummaryModalContent from '@extension/components/CustomNodeSummaryModalContent';
import GenericInput from '@extension/components/GenericInput';
import ModalSubHeading from '@extension/components/ModalSubHeading';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import AddCustomNodeLoadingModalContent from './AddCustomNodeLoadingModalContent';

// constants
import {
  BODY_BACKGROUND_COLOR,
  CUSTOM_NODE_BYTE_LIMIT,
  DEFAULT_GAP,
  MODAL_ITEM_HEIGHT,
} from '@extension/constants';

// features
import { addCustomNodeThunk } from '@extension/features/networks';
import { create as createNotification } from '@extension/features/notifications';
import { saveToStorageThunk as saveSettingsToStorageThunk } from '@extension/features/settings';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useGenericInput from '@extension/hooks/useGenericInput';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectLogger,
  useSelectNetworks,
  useSelectNetworksSaving,
  useSelectSettings,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAppThunkDispatch,
  IAVMVersions,
  ICustomNode,
  IMainRootState,
  INetwork,
  INetworkWithTransactionParams,
} from '@extension/types';
import type { IProps } from './types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import avmVersionsWithDelay from '@extension/utils/avmVersionsWithDelay';
import isNetworkSupportedFromSettings from '@extension/utils/isNetworkSupportedFromSettings';

const AddCustomNodeModal: FC<IProps> = ({ isOpen, onClose, onComplete }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const {
    isOpen: isAdvancedOpen,
    onOpen: onAdvancedOpen,
    onClose: onAdvancedClose,
  } = useDisclosure();
  // selectors
  const logger = useSelectLogger();
  const networks = useSelectNetworks();
  const saving = useSelectNetworksSaving();
  const settings = useSelectSettings();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  const {
    error: algodURLError,
    label: algodURLLabel,
    required: algodURLRequired,
    reset: resetAlgodURL,
    setError: setAlgodURLError,
    setValue: setAlgodURLValue,
    validate: validateAlgodURL,
    value: algodURLValue,
  } = useGenericInput({
    label: t<string>('labels.url'),
    required: true,
  });
  const {
    error: algodPortError,
    label: algodPortLabel,
    reset: resetAlgodPort,
    setError: setAlgodPortError,
    setValue: setAlgodPortValue,
    validate: validateAlgodPort,
    value: algodPortValue,
  } = useGenericInput({
    label: t<string>('labels.port'),
  });
  const {
    error: algodTokenError,
    label: algodTokenLabel,
    reset: resetAlgodToken,
    setError: setAlgodTokenError,
    setValue: setAlgodTokenValue,
    validate: validateAlgodToken,
    value: algodTokenValue,
  } = useGenericInput({
    label: t<string>('labels.token'),
  });
  const {
    error: indexerURLError,
    label: indexerURLLabel,
    reset: resetIndexerURL,
    setError: setIndexerURLError,
    setValue: setIndexerURLValue,
    validate: validateIndexerURL,
    value: indexerURLValue,
  } = useGenericInput({
    label: t<string>('labels.url'),
  });
  const {
    error: indexerPortError,
    label: indexerPortLabel,
    reset: resetIndexerPort,
    setError: setIndexerPortError,
    setValue: setIndexerPortValue,
    validate: validateIndexerPort,
    value: indexerPortValue,
  } = useGenericInput({
    label: t<string>('labels.port'),
  });
  const {
    error: indexerTokenError,
    label: indexerTokenLabel,
    reset: resetIndexerToken,
    setError: setIndexerTokenError,
    setValue: setIndexerTokenValue,
    validate: validateIndexerToken,
    value: indexerTokenValue,
  } = useGenericInput({
    label: t<string>('labels.token'),
  });
  const {
    characterLimit: nameCharacterLimit,
    error: nameError,
    label: nameLabel,
    required: nameRequired,
    reset: resetName,
    setError: setNameError,
    setValue: setNameValue,
    validate: validateName,
    value: nameValue,
  } = useGenericInput({
    characterLimit: CUSTOM_NODE_BYTE_LIMIT,
    label: t<string>('labels.name'),
    required: true,
  });
  // state
  const [customNode, setCustomNode] = useState<ICustomNode | null>(null);
  const [activate, setActivate] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [network, setNetwork] = useState<INetwork | null>(null);
  // handlers
  const handleActivateChange = (event: ChangeEvent<HTMLInputElement>) =>
    setActivate(event.target.checked);
  const handleAdvancedToggle = (value: boolean) =>
    value ? onAdvancedOpen() : onAdvancedClose();
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    // reset summary states
    setActivate(false);
    setCustomNode(null);
    setFetching(false);
    setNetwork(null);
    // reset inputs
    resetName();
    resetAlgodURL();
    resetAlgodPort();
    resetAlgodToken();
    resetIndexerURL();
    resetIndexerPort();
    resetIndexerToken();
    // close
    onClose && onClose();
  };
  const handleNextClick = async () => {
    const _functionName = 'handleNextClick';
    let _network: INetwork | null;
    let algodClient: Algodv2;
    let versions: IAVMVersions;

    if (
      !!algodURLError ||
      !!algodPortError ||
      !!algodTokenError ||
      !!indexerURLError ||
      !!indexerPortError ||
      !!indexerTokenError ||
      !!nameError ||
      [
        validateName(),
        validateAlgodURL(),
        validateAlgodPort(),
        validateAlgodToken(),
        validateIndexerURL(),
        validateIndexerPort(),
        validateIndexerToken(),
      ].some((value) => !!value)
    ) {
      return;
    }

    logger.debug(
      `${
        AddCustomNodeModal.name
      }#${_functionName}: fetching genesis hash for network at "${algodURLValue}${
        algodPortValue ? `:${algodPortValue}` : ''
      }"`
    );

    setFetching(true);

    try {
      algodClient = createAlgodClient({
        port: algodPortValue,
        token: algodTokenValue,
        url: algodURLValue,
      });
      versions = await avmVersionsWithDelay({ client: algodClient });
    } catch (error) {
      logger.error(`${AddCustomNodeModal.name}#${_functionName}:`, error);

      dispatch(
        createNotification({
          description: t<string>('captions.failedToGetCustomNodeDetails', {
            url: `${algodURLValue}${
              algodPortValue ? `:${algodPortValue}` : ''
            }`,
          }),
          ephemeral: true,
          title: t<string>('headings.failedToGetCustomNodeDetails'),
          type: 'error',
        })
      );

      return setFetching(false);
    }

    logger.debug(
      `${AddCustomNodeModal.name}#${_functionName}: found genesis hash "${
        versions.genesis_hash_b64
      }" for network at "${algodURLValue}${
        algodPortValue ? `:${algodPortValue}` : ''
      }"`
    );

    _network =
      networks.find(
        ({ genesisHash }) => genesisHash === versions.genesis_hash_b64
      ) || null;

    // check if the network exists
    if (!_network) {
      dispatch(
        createNotification({
          description: t<string>('captions.unknownAVMNetwork', {
            genesisID: versions.genesis_id,
          }),
          ephemeral: true,
          title: t<string>('headings.unknownAVMNetwork'),
          type: 'error',
        })
      );

      return setFetching(false);
    }

    // check if the network is allowed
    if (
      !isNetworkSupportedFromSettings({
        genesisHash: _network.genesisHash,
        networks,
        settings,
      })
    ) {
      dispatch(
        createNotification({
          description: t<string>('captions.networkNotAllowed', {
            genesisID: versions.genesis_id,
          }),
          ephemeral: true,
          title: t<string>('headings.networkNotAllowed'),
          type: 'error',
        })
      );

      return setFetching(false);
    }

    // update state
    setFetching(false);
    setCustomNode({
      algod: {
        port: algodPortValue,
        token: algodTokenValue,
        url: algodURLValue,
      },
      genesisHash: _network.genesisHash,
      id: uuid(),
      name: nameValue,
      indexer: indexerURLValue
        ? {
            port: indexerPortValue,
            token: indexerTokenValue,
            url: indexerURLValue,
          }
        : null,
    });
    setNetwork(_network);
  };
  const handleOnChange =
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
      switch (field) {
        case 'name':
          setNameValue(event.target.value);
          break;
        case 'algodURL':
          setAlgodURLValue(event.target.value);
          break;
        case 'algodPort':
          setAlgodPortValue(event.target.value);
          break;
        case 'algodToken':
          setAlgodTokenValue(event.target.value);
          break;
        case 'indexerURL':
          setIndexerURLValue(event.target.value);
          break;
        case 'indexerPort':
          setIndexerPortValue(event.target.value);
          break;
        case 'indexerToken':
          setIndexerTokenValue(event.target.value);
          break;
        default:
          break;
      }
    };
  const handleOnError = (field: string) => (value: string | null) => {
    switch (field) {
      case 'name':
        setNameError(value);
        break;
      case 'algodURL':
        setAlgodURLError(value);
        break;
      case 'algodPort':
        setAlgodPortError(value);
        break;
      case 'algodToken':
        setAlgodTokenError(value);
        break;
      case 'indexerURL':
        setIndexerURLError(value);
        break;
      case 'indexerPort':
        setIndexerPortError(value);
        break;
      case 'indexerToken':
        setIndexerTokenError(value);
        break;
      default:
        break;
    }
  };
  const handlePreviousClick = () => {
    setCustomNode(null);
    setNetwork(null);
  };
  const handleSaveClick = async () => {
    let _network: INetworkWithTransactionParams | null;

    if (!customNode || !network) {
      return;
    }

    _network = await dispatch(addCustomNodeThunk(customNode)).unwrap();
    _network && onComplete && onComplete(_network);

    // if activate has been enabled, set it in the settings
    if (activate) {
      dispatch(
        saveSettingsToStorageThunk({
          ...settings,
          general: {
            ...settings.general,
            selectedNodeIDs: {
              ...settings.general.selectedNodeIDs,
              [convertGenesisHashToHex(network.genesisHash)]: customNode.id,
            },
          },
        })
      );
    }

    dispatch(
      createNotification({
        description: t<string>('captions.customNodeAdded', {
          genesisID: network.genesisId,
          name: customNode.name,
        }),
        ephemeral: true,
        title: t<string>('headings.customNodeAdded'),
        type: 'success',
      })
    );

    handleClose();
  };
  // renders
  const renderContent = () => {
    if (fetching) {
      return <AddCustomNodeLoadingModalContent />;
    }

    if (customNode && network) {
      return (
        <CustomNodeSummaryModalContent item={customNode} network={network} />
      );
    }

    return (
      <VStack flexGrow={1} spacing={DEFAULT_GAP - 2} w="full">
        {/*general details*/}
        <ModalSubHeading text={t<string>('headings.general')} />

        {/*name*/}
        <GenericInput
          characterLimit={nameCharacterLimit}
          error={nameError}
          label={nameLabel}
          isDisabled={fetching}
          onChange={handleOnChange('name')}
          onError={handleOnError('name')}
          placeholder={t<string>('placeholders.customNodeName')}
          required={nameRequired}
          type="text"
          validate={validateName}
          value={nameValue || ''}
        />

        {/*activate on add*/}
        <Stack alignItems="flex-end" w="full">
          <Checkbox
            colorScheme={primaryColorScheme}
            isChecked={activate}
            isDisabled={saving}
            onChange={handleActivateChange}
          >
            <Text color={subTextColor} fontSize="sm" textAlign="left" w="full">
              {t<string>('labels.activateOnAdd')}
            </Text>
          </Checkbox>
        </Stack>

        {/*algod details*/}
        <ModalSubHeading text={t<string>('headings.algodDetails')} />

        {/*algod url*/}
        <GenericInput
          error={algodURLError}
          label={algodURLLabel}
          isDisabled={fetching}
          onChange={handleOnChange('algodURL')}
          onError={handleOnError('algodURL')}
          placeholder={t<string>('placeholders.url')}
          required={algodURLRequired}
          type="text"
          validate={validateAlgodURL}
          value={algodURLValue || ''}
        />

        {/*algod port*/}
        <GenericInput
          error={algodPortError}
          label={algodPortLabel}
          isDisabled={fetching}
          onChange={handleOnChange('algodPort')}
          onError={handleOnError('algodPort')}
          placeholder={t<string>('placeholders.port')}
          type="text"
          validate={validateAlgodPort}
          value={algodPortValue || ''}
        />

        {/*algod token*/}
        <GenericInput
          error={algodTokenError}
          label={algodTokenLabel}
          informationText={t<string>('captions.algodToken')}
          isDisabled={fetching}
          onChange={handleOnChange('algodToken')}
          onError={handleOnError('algodToken')}
          type="text"
          validate={validateAlgodToken}
          value={algodTokenValue || ''}
        />

        <MoreInformationAccordion
          color={defaultTextColor}
          fontSize="md"
          isOpen={isAdvancedOpen}
          label={t<string>('labels.advanced')}
          minButtonHeight={MODAL_ITEM_HEIGHT}
          onChange={handleAdvancedToggle}
        >
          <VStack flexGrow={1} spacing={DEFAULT_GAP - 2} w="full">
            {/*indexer details*/}
            <ModalSubHeading text={t<string>('headings.indexerDetails')} />

            {/*indexer url*/}
            <GenericInput
              error={indexerURLError}
              label={indexerURLLabel}
              isDisabled={fetching}
              onChange={handleOnChange('indexerURL')}
              onError={handleOnError('indexerURL')}
              placeholder={t<string>('placeholders.url')}
              type="text"
              validate={validateIndexerURL}
              value={indexerURLValue || ''}
            />

            {/*indexer port*/}
            <GenericInput
              error={indexerPortError}
              label={indexerPortLabel}
              isDisabled={fetching}
              onChange={handleOnChange('indexerPort')}
              onError={handleOnError('indexerPort')}
              placeholder={t<string>('placeholders.port')}
              type="text"
              validate={validateIndexerPort}
              value={indexerPortValue || ''}
            />

            {/*indexer token*/}
            <GenericInput
              error={indexerTokenError}
              label={indexerTokenLabel}
              informationText={t<string>('captions.indexerToken')}
              isDisabled={fetching}
              onChange={handleOnChange('indexerToken')}
              onError={handleOnError('indexerToken')}
              type="text"
              validate={validateIndexerToken}
              value={indexerTokenValue || ''}
            />
          </VStack>
        </MoreInformationAccordion>
      </VStack>
    );
  };

  return (
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
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.addCustomNode')}
          </Heading>
        </ModalHeader>

        <ModalBody display="flex" px={DEFAULT_GAP}>
          {renderContent()}
        </ModalBody>

        {!fetching && (
          <ModalFooter p={DEFAULT_GAP}>
            <HStack spacing={DEFAULT_GAP - 2} w="full">
              {network ? (
                <>
                  {/*previous button*/}
                  <Button
                    isLoading={saving}
                    leftIcon={<IoArrowBackOutline />}
                    onClick={handlePreviousClick}
                    size="lg"
                    variant="outline"
                    w="full"
                  >
                    {t<string>('buttons.previous')}
                  </Button>

                  {/*save button*/}
                  <Button
                    isLoading={saving}
                    onClick={handleSaveClick}
                    rightIcon={<IoSaveOutline />}
                    size="lg"
                    variant="solid"
                    w="full"
                  >
                    {t<string>('buttons.save')}
                  </Button>
                </>
              ) : (
                <>
                  {/*cancel button*/}
                  <Button
                    onClick={handleCancelClick}
                    size="lg"
                    variant="outline"
                    w="full"
                  >
                    {t<string>('buttons.cancel')}
                  </Button>

                  {/*next button*/}
                  <Button
                    isLoading={fetching}
                    onClick={handleNextClick}
                    rightIcon={<IoArrowForwardOutline />}
                    size="lg"
                    variant="solid"
                    w="full"
                  >
                    {t<string>('buttons.next')}
                  </Button>
                </>
              )}
            </HStack>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddCustomNodeModal;
