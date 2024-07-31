import {
  Heading,
  HStack,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// components
import AccountItem from '@extension/components/AccountItem';
import Button from '@extension/components/Button';

// constants
import {
  ACCOUNTS_ROUTE,
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
} from '@extension/constants';

// enums
import { AccountTabEnum, EncryptionMethodEnum } from '@extension/enums';

// errors
import { BaseExtensionError, MalformedDataError } from '@extension/errors';

// features
import {
  saveActiveAccountDetails,
  saveNewAccountsThunk,
} from '@extension/features/accounts';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// modals
import AuthenticationModal from '@extension/modals/AuthenticationModal';

// selectors
import {
  useSelectAccounts,
  useSelectActiveAccountDetails,
  useSelectLogger,
} from '@extension/selectors';

// services
import QuestsService from '@extension/services/QuestsService';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IARC0300AccountImportSchema,
  IARC0300ModalContentProps,
  IMainRootState,
  INewAccount,
  TEncryptionCredentials,
} from '@extension/types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';
import flattenAccountImportSchemaToNewAccounts from '@extension/utils/flattenAccountImportSchemaToNewAccounts';
import EmptyState from '@extension/components/EmptyState';

const ARC0300AccountImportModalContent: FC<
  IARC0300ModalContentProps<IARC0300AccountImportSchema[]>
> = ({
  cancelButtonIcon,
  cancelButtonLabel,
  onComplete,
  onCancel,
  schemaOrSchemas: schemas,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const navigate = useNavigate();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const accounts = useSelectAccounts();
  const activeAccountDetails = useSelectActiveAccountDetails();
  const logger = useSelectLogger();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  // states
  const [items, setItems] = useState<INewAccount[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  // misc
  const reset = () => {
    setItems([]);
    setSaving(false);
  };
  // handlers
  const handleCancelClick = () => {
    reset();
    onCancel();
  };
  const handleImportClick = () => onAuthenticationModalOpen();
  const handleOnAuthenticationModalConfirm = async (
    result: TEncryptionCredentials
  ) => {
    let _accounts: IAccountWithExtendedProps[];

    setSaving(true);

    try {
      if (result.type === EncryptionMethodEnum.Unencrypted) {
        throw new MalformedDataError(
          'adding accounts require encryption credentials'
        );
      }

      _accounts = await dispatch(
        saveNewAccountsThunk({
          accounts: items,
          ...result,
        })
      ).unwrap();
    } catch (error) {
      handleOnError(error);

      return setSaving(false);
    }

    if (_accounts.length > 0) {
      dispatch(
        createNotification({
          ephemeral: true,
          description:
            _accounts.length > 1
              ? t<string>('captions.addedAccounts', {
                  amount: _accounts.length,
                })
              : t<string>('captions.addedAccount', {
                  address: ellipseAddress(
                    convertPublicKeyToAVMAddress(_accounts[0].publicKey)
                  ),
                }),
          title: t<string>('headings.addedAccounts'),
          type: 'success',
        })
      );

      // track the action
      await new QuestsService({
        logger,
      }).importAccountViaQRCodeQuest(
        convertPublicKeyToAVMAddress(_accounts[0].publicKey)
      );

      // go to the account and the assets tab
      dispatch(
        saveActiveAccountDetails({
          accountId: _accounts[0].id,
          tabIndex: activeAccountDetails?.tabIndex || AccountTabEnum.Assets,
        })
      );
      navigate(ACCOUNTS_ROUTE);
    }

    // clean up and close
    handleOnComplete();
  };
  const handleOnComplete = () => {
    reset();
    onComplete();
  };
  const handleOnError = (error: BaseExtensionError) =>
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
  // renders
  const renderBody = () => {
    if (items.length <= 0) {
      return (
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          p={DEFAULT_GAP}
          w="full"
        >
          <Spacer />

          <EmptyState text={t<string>('captions.noAccountsToImport')} />

          <Spacer />
        </VStack>
      );
    }

    return (
      <VStack spacing={DEFAULT_GAP / 3} w="full">
        {items.map(({ keyPair, name }, index) => (
          <HStack
            borderRadius="md"
            borderWidth={1}
            key={`account-import-account-item-${index}`}
            justifyContent="center"
            px={DEFAULT_GAP - 2}
            py={DEFAULT_GAP / 3}
            w="full"
          >
            <AccountItem
              address={convertPublicKeyToAVMAddress(keyPair.publicKey)}
              {...(name && { name })}
            />

            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="center"
              w="10%"
            >
              {index + 1}
            </Text>
          </HStack>
        ))}
      </VStack>
    );
  };

  useEffect(() => {
    setItems(
      flattenAccountImportSchemaToNewAccounts({
        accounts,
        schemas,
        logger,
      })
    );
  }, []);

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        forceAuthentication={true}
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnError}
        passwordHint={t<string>('captions.mustEnterPasswordToImportAccount')}
      />

      <ModalContent
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        {/*header*/}
        <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
          <VStack
            alignItems="center"
            flexGrow={1}
            spacing={DEFAULT_GAP - 2}
            w="full"
          >
            <Heading color={defaultTextColor} size="md" textAlign="center">
              {t<string>('headings.importAccount')}
            </Heading>

            <Text color={defaultTextColor} fontSize="sm" textAlign="center">
              {t<string>('captions.importAccounts')}
            </Text>
          </VStack>
        </ModalHeader>

        {/*body*/}
        <ModalBody display="flex">{renderBody()}</ModalBody>

        {/*footer*/}
        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={DEFAULT_GAP - 2} w="full">
            {/*cancel button*/}
            <Button
              leftIcon={cancelButtonIcon}
              onClick={handleCancelClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {cancelButtonLabel || t<string>('buttons.cancel')}
            </Button>

            {/*import button*/}
            <Button
              isLoading={saving}
              onClick={handleImportClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.import')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </>
  );
};

export default ARC0300AccountImportModalContent;
