import {
  ARC0027MethodCanceledError,
  ARC0027MethodEnum,
} from '@agoralabs-sh/avm-web-provider';
import {
  Code,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { encode as encodeBase64 } from '@stablelib/base64';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import AccountSelect from '@extension/components/AccountSelect';
import AccountItem from '@extension/components/AccountItem';
import Button from '@extension/components/Button';
import ClientHeader, {
  ClientHeaderSkeleton,
} from '@extension/components/ClientHeader';
import SignMessageContentSkeleton from './SignMessageContentSkeleton';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// errors
import { BaseExtensionError } from '@extension/errors';

// features
import { removeEventByIdThunk } from '@extension/features/events';
import { sendSignMessageResponseThunk } from '@extension/features/messages';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useSignMessageModal from './hooks/useSignMessageModal';

// modals
import AuthenticationModal, {
  TOnConfirmResult,
} from '@extension/modals/AuthenticationModal';

// selectors
import {
  useSelectAccountsFetching,
  useSelectLogger,
} from '@extension/selectors';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';
import QuestsService from '@extension/services/QuestsService';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IModalProps,
} from '@extension/types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import signBytes from '@extension/utils/signBytes';

const SignMessageModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const fetching = useSelectAccountsFetching();
  const logger = useSelectLogger();
  // hooks
  const {
    authorizedAccounts,
    event,
    signer,
    setAuthorizedAccounts,
    setSigner,
  } = useSignMessageModal();
  const subTextColor = useSubTextColor();
  // handlers
  const handleAccountSelect = (account: IAccountWithExtendedProps) =>
    setSigner(account);
  const handleAuthenticationError = (error: BaseExtensionError) =>
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
  const handleCancelClick = async () => {
    if (event) {
      await dispatch(
        sendSignMessageResponseThunk({
          error: new ARC0027MethodCanceledError({
            message: `user dismissed sign message modal`,
            method: ARC0027MethodEnum.SignMessage,
            providerId: __PROVIDER_ID__,
          }),
          event,
          signature: null,
          signer: null,
        })
      ).unwrap();
      // remove the event
      await dispatch(removeEventByIdThunk(event.id)).unwrap();
    }

    handleClose();
  };
  const handleClose = () => {
    setAuthorizedAccounts(null);
    setSigner(null);

    onClose && onClose();
  };
  const handleOnAuthenticationModalConfirm = async (
    result: TOnConfirmResult
  ) => {
    const _functionName = 'handleOnAuthenticationModalConfirm';
    let questsService: QuestsService;
    let signature: Uint8Array;
    let signerAddress: string;

    if (!event || !event.payload.message.params || !signer) {
      return;
    }

    signerAddress = convertPublicKeyToAVMAddress(signer.publicKey);

    logger.debug(
      `${SignMessageModal.name}#${_functionName}: signing message for signer "${signerAddress}"`
    );

    try {
      signature = await signBytes({
        bytes: new TextEncoder().encode(event.payload.message.params.message),
        logger,
        publicKey: PrivateKeyService.decode(signer.publicKey),
        ...result,
      });

      logger.debug(
        `${SignMessageModal.name}#${_functionName}: signed message for signer "${signerAddress}"`
      );

      questsService = new QuestsService({
        logger,
      });

      // track the action
      await questsService.signMessageQuest(signerAddress);

      // send the response
      await dispatch(
        sendSignMessageResponseThunk({
          error: null,
          event,
          signature: encodeBase64(signature),
          signer: signerAddress,
        })
      ).unwrap();
      // remove the event
      await dispatch(removeEventByIdThunk(event.id)).unwrap();

      handleClose();
    } catch (error) {
      switch (error.code) {
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
  const handleSignClick = () => onAuthenticationModalOpen();
  // renders
  const renderContent = () => {
    if (
      fetching ||
      !event?.payload.message.params ||
      !authorizedAccounts ||
      !signer
    ) {
      return <SignMessageContentSkeleton />;
    }

    return (
      <VStack spacing={DEFAULT_GAP - 2} w="full">
        {/*account select*/}
        <VStack spacing={DEFAULT_GAP / 3} w="full">
          {event.payload.message.params.signer ? (
            <>
              <Text textAlign="left" w="full">{`${t<string>(
                'labels.addressToSign'
              )}:`}</Text>

              <AccountItem account={signer} />
            </>
          ) : (
            <>
              <Text textAlign="left" w="full">{`${t<string>(
                'labels.authorizedAddresses'
              )}:`}</Text>

              <AccountSelect
                accounts={authorizedAccounts}
                onSelect={handleAccountSelect}
                value={signer}
              />
            </>
          )}
        </VStack>

        {/*message*/}
        <VStack spacing={DEFAULT_GAP / 3} w="full">
          <Text textAlign="left" w="full">{`${t<string>(
            'labels.message'
          )}:`}</Text>
          <Code borderRadius="md" w="full">
            {event.payload.message.params.message}
          </Code>
        </VStack>
      </VStack>
    );
  };

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleAuthenticationError}
        passwordHint={t<string>('captions.mustEnterPasswordToSign')}
      />

      <Modal
        isOpen={!!event}
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
          <ModalHeader px={DEFAULT_GAP}>
            {event ? (
              <VStack alignItems="center" spacing={DEFAULT_GAP - 2} w="full">
                <ClientHeader
                  description={
                    event.payload.message.clientInfo.description || undefined
                  }
                  iconUrl={
                    event.payload.message.clientInfo.iconUrl || undefined
                  }
                  host={event.payload.message.clientInfo.host || 'unknown host'}
                  name={event.payload.message.clientInfo.appName || 'Unknown'}
                />

                {/*caption*/}
                <Text color={subTextColor} fontSize="sm" textAlign="center">
                  {t<string>('captions.signMessageRequest')}
                </Text>
              </VStack>
            ) : (
              <ClientHeaderSkeleton />
            )}
          </ModalHeader>

          <ModalBody px={DEFAULT_GAP}>{renderContent()}</ModalBody>

          <ModalFooter p={DEFAULT_GAP}>
            <HStack spacing={DEFAULT_GAP / 3} w="full">
              <Button
                onClick={handleCancelClick}
                size="lg"
                variant="outline"
                w="full"
              >
                {t<string>('buttons.cancel')}
              </Button>

              <Button
                onClick={handleSignClick}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.sign')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignMessageModal;
