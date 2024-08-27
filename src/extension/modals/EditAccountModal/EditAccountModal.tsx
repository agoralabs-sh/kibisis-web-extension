import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoSaveOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import GenericInput from '@extension/components/GenericInput';

// constants
import {
  ACCOUNT_NAME_BYTE_LIMIT,
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
} from '@extension/constants';

// features
import { saveAccountNameThunk } from '@extension/features/accounts';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useGenericInput from '@extension/hooks/useGenericInput';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectActiveAccount,
  useSelectAccountsSaving,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IMainRootState,
} from '@extension/types';
import type { IProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';

const EditAccountModal: FC<IProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const account = useSelectActiveAccount();
  const saving = useSelectAccountsSaving();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const {
    charactersRemaining: nameCharactersRemaining,
    error: nameError,
    label: nameLabel,
    onBlur: nameOnBlur,
    onChange: nameOnChange,
    required: isNameRequired,
    reset: resetName,
    value: nameValue,
    validate: validateName,
  } = useGenericInput({
    characterLimit: ACCOUNT_NAME_BYTE_LIMIT,
    label: t<string>('labels.name'),
    ...(account?.name && {
      defaultValue: account.name,
    }),
  });
  const subTextColor = useSubTextColor();
  // handlers
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    // reset inputs
    resetName();
    // close
    onClose && onClose();
  };
  const handleSaveClick = async () => {
    let _account: IAccountWithExtendedProps | null;

    if (
      !account ||
      !!nameError ||
      [validateName(nameValue)].some((value) => !!value)
    ) {
      return;
    }

    if (account && account.name === nameValue) {
      handleClose();

      return;
    }

    _account = await dispatch(
      saveAccountNameThunk({
        accountId: account.id,
        name: nameValue,
      })
    ).unwrap();

    if (_account) {
      dispatch(
        createNotification({
          ephemeral: true,
          title: t<string>('headings.accountUpdated'),
          type: 'info',
        })
      );
    }

    handleClose();
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
        {/*header*/}
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <VStack
            alignItems="center"
            justifyContent="center"
            spacing={1}
            w="full"
          >
            <Heading
              color={defaultTextColor}
              size="md"
              textAlign="center"
              w="full"
            >
              {t<string>('headings.editAccount')}
            </Heading>

            {/*address*/}
            {account && (
              <Tooltip label={convertPublicKeyToAVMAddress(account.publicKey)}>
                <Text
                  color={subTextColor}
                  fontSize="sm"
                  textAlign="center"
                  w="full"
                >
                  {ellipseAddress(
                    convertPublicKeyToAVMAddress(account.publicKey),
                    {
                      end: 10,
                      start: 10,
                    }
                  )}
                </Text>
              </Tooltip>
            )}
          </VStack>
        </ModalHeader>

        {/*body*/}
        <ModalBody display="flex" px={DEFAULT_GAP}>
          <VStack flexGrow={1} spacing={DEFAULT_GAP - 2} w="full">
            {/*name*/}
            <GenericInput
              charactersRemaining={nameCharactersRemaining}
              error={nameError}
              label={nameLabel}
              isDisabled={saving}
              onBlur={nameOnBlur}
              onChange={nameOnChange}
              required={isNameRequired}
              placeholder={t<string>('placeholders.nameAccount')}
              type="text"
              validate={validateName}
              value={nameValue}
            />
          </VStack>
        </ModalBody>

        {/*footer*/}
        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={DEFAULT_GAP - 2} w="full">
            {/*cancel button*/}
            <Button
              onClick={handleCancelClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.cancel')}
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
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditAccountModal;
