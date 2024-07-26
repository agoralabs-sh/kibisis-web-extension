import {
  Heading,
  HStack,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { decodeURLSafe as decodeBase64URLSafe } from '@stablelib/base64';
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
  TAB_ITEM_HEIGHT,
} from '@extension/constants';

// enums
import { AccountTabEnum, ARC0300QueryEnum } from '@extension/enums';

// errors
import { BaseExtensionError } from '@extension/errors';

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

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

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
import type { TOnConfirmResult } from '@extension/modals/AuthenticationModal';
import type {
  IAccountWithExtendedProps,
  IARC0300AccountImportSchema,
  IARC0300ModalContentProps,
  IAppThunkDispatch,
} from '@extension/types';
import type { IARC0300AccountImportItem } from './types';

// utils
import convertPrivateKeyToAVMAddress from '@extension/utils/convertPrivateKeyToAVMAddress';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';

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
  const dispatch = useDispatch<IAppThunkDispatch>();
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
  const [items, setItems] = useState<IARC0300AccountImportItem[]>([]);
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
    result: TOnConfirmResult
  ) => {
    let _accounts: IAccountWithExtendedProps[];

    setSaving(true);

    try {
      _accounts = await dispatch(
        saveNewAccountsThunk({
          accounts: items.map(({ name, privateKey }) => ({
            keyPair: Ed21559KeyPair.generateFromPrivateKey(privateKey),
            name: name || null,
          })),
          ...result,
        })
      ).unwrap();
    } catch (error) {
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

      setSaving(false);

      return;
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
  const handleOnComplete = () => {
    reset();
    onComplete();
  };

  useEffect(() => {
    setItems(
      schemas.reduce((acc, schema) => {
        const privateKeys =
          schema.query[ARC0300QueryEnum.PrivateKey].map(decodeBase64URLSafe);
        const addresses = privateKeys.map((value) =>
          convertPrivateKeyToAVMAddress(value, { logger })
        );

        return [
          ...acc,
          ...addresses.reduce((acc, address, index) => {
            // if the private key is invalid, or the address already exists, ignore
            if (
              !address ||
              accounts.find(
                (value) =>
                  convertPublicKeyToAVMAddress(value.publicKey) === address
              )
            ) {
              return acc;
            }

            return [
              ...acc,
              {
                address,
                privateKey: privateKeys[index],
                ...(schema.query[ARC0300QueryEnum.Name] && {
                  name: schema.query[ARC0300QueryEnum.Name][index],
                }),
              },
            ];
          }, []),
        ];
      }, [])
    );
  }, []);

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnAuthenticationError}
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
        <ModalBody display="flex">
          <VStack spacing={DEFAULT_GAP / 3} w="full">
            {items.map(({ address, name }, index) => (
              <HStack
                borderRadius="md"
                borderWidth={1}
                key={`account-import-account-item-${index}`}
                justifyContent="center"
                px={DEFAULT_GAP - 2}
                py={DEFAULT_GAP / 3}
                w="full"
              >
                <AccountItem address={address} name={name} />

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
        </ModalBody>

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
