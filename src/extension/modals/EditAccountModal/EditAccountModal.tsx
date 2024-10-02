import {
  Button as ChakraButton,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Tooltip,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import React, { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoSaveOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import GenericInput from '@extension/components/GenericInput';
import ModalSubHeading from '@extension/components/ModalSubHeading';

// constants
import {
  ACCOUNT_NAME_BYTE_LIMIT,
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
} from '@extension/constants';

// features
import { saveAccountDetailsThunk } from '@extension/features/accounts';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
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
  TAccountIcons,
} from '@extension/types';
import type { IProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';
import calculateIconSize from '@extension/utils/calculateIconSize';
import parseAccountIcon from '@extension/utils/parseAccountIcon';
import ScrollableContainer from '@extension/components/ScrollableContainer';

const EditAccountModal: FC<IProps> = ({ isOpen, onClose }) => {
  const _context = 'account-icon-modal';
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const account = useSelectActiveAccount();
  const saving = useSelectAccountsSaving();
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const {
    charactersRemaining: nameCharactersRemaining,
    error: nameError,
    label: nameLabel,
    onBlur: nameOnBlur,
    onChange: nameOnChange,
    required: isNameRequired,
    reset: resetName,
    setValue: setNameValue,
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
  // states
  const [icon, setIcon] = useState<TAccountIcons | null>(account?.icon || null);
  // misc
  const accountIcons: TAccountIcons[] = [
    'airplane',
    'american-football',
    'balloon',
    'baseball',
    'basketball',
    'beer',
    'bicycle',
    'boat',
    'briefcase',
    'brush',
    'bug',
    'bulb',
    'buoy',
    'bus',
    'business',
    'cafe',
    'car',
    'cart',
    'cash',
    'circle',
    'cloud',
    'code',
    'compass',
    'construct',
    'credit-card',
    'cube',
    'database',
    'diamond',
    'dice',
    'earth',
    'egg',
    'female',
    'file-tray',
    'film',
    'fingerprint',
    'fire',
    'fish',
    'fitness',
    'flag',
    'flash',
    'flashlight',
    'flask',
    'flower',
    'football',
    'footsteps',
    'gaming',
    'glasses',
    'globe',
    'golf',
    'hammer',
    'heart',
    'home',
    'key',
    'leaf',
    'library',
    'male',
    'moon',
    'music-note',
    'palette',
    'paw',
    'people',
    'person',
    'pizza',
    'planet',
    'prism',
    'puzzle',
    'rainy',
    'receipt',
    'restaurant',
    'rocket',
    'rose',
    'school',
    'shield',
    'shirt',
    'shopping-bag',
    'skull',
    'snow',
    'sparkles',
    'star',
    'storefront',
    'sun',
    'telescope',
    'tennis',
    'terminal',
    'thermometer',
    'thumbs-up',
    'ticket',
    'time',
    'train',
    'transgender',
    'trash',
    'trophy',
    'umbrella',
    'wallet',
    'water',
    'wine',
    'wrench',
  ];
  const iconSize = calculateIconSize('sm');
  const reset = () => {
    resetName();
    setIcon(null);
  };
  // handlers
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    // reset inputs
    reset();
    // close
    onClose && onClose();
  };
  const handleOnIconChange = (value: TAccountIcons) => () => {
    if (value === icon) {
      setIcon(null);

      return;
    }

    setIcon(value);
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

    if (account && account.name === nameValue && account.icon === icon) {
      handleClose();

      return;
    }

    _account = await dispatch(
      saveAccountDetailsThunk({
        accountId: account.id,
        icon,
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

  // update the input with the name of the active account
  useEffect(() => {
    if (isOpen) {
      account?.name && setNameValue(account?.name);
      account?.icon && setIcon(account.icon);
    }
  }, [isOpen]);

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

            <ModalSubHeading text={t<string>('headings.selectIcon')} />

            {/*icons*/}
            <ScrollableContainer w="full">
              <Wrap justify="center" spacing={1} w="full">
                {accountIcons.map((value, index) => (
                  <WrapItem key={`${_context}-select-item-${index}`}>
                    <ChakraButton
                      _hover={{
                        bg: buttonHoverBackgroundColor,
                      }}
                      cursor="pointer"
                      justifyContent="start"
                      onClick={handleOnIconChange(value)}
                      p={DEFAULT_GAP / 2}
                      variant="ghost"
                      {...(value === icon && {
                        bg: buttonHoverBackgroundColor,
                      })}
                    >
                      <Icon as={parseAccountIcon(value)} boxSize={iconSize} />
                    </ChakraButton>
                  </WrapItem>
                ))}
              </Wrap>
            </ScrollableContainer>
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
