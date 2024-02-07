import {
  Heading,
  HStack,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, {
  FC,
  KeyboardEvent,
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { ErrorCodeEnum } from '@extension/enums';

// features
import { saveNewAccountThunk } from '@extension/features/accounts';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// selectors
import {
  useSelectAccounts,
  useSelectLogger,
  useSelectPasswordLockPassword,
  useSelectSettings,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IAppThunkDispatch,
  IARC0300AccountImportSchema,
  ISettings,
} from '@extension/types';

// utils
import convertPrivateKeyToAddress from '@extension/utils/convertPrivateKeyToAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';
import isAccountKnown from '@extension/utils/isAccountKnown';
import decodePrivateKeyFromAccountImportSchema from './utils/decodePrivateKeyFromImportKeySchema';

interface IProps {
  onCancelClick: () => void;
  onComplete: () => void;
  schema: IARC0300AccountImportSchema;
}

const ScanQRCodeModalAccountImportContent: FC<IProps> = ({
  onCancelClick,
  onComplete,
  schema,
}: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const passwordInputRef: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const logger: ILogger = useSelectLogger();
  const passwordLockPassword: string | null = useSelectPasswordLockPassword();
  const settings: ISettings = useSelectSettings();
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
  // states
  const [address, setAddress] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  // misc
  const isAccountAlreadyKnown: boolean = address
    ? isAccountKnown(accounts, address)
    : false;
  // handlers
  const handleCancelClick = () => {
    reset();
    onCancelClick();
  };
  const handleImportClick = async () => {
    const _functionName: string = 'handleImportClick';
    let _password: string | null;
    let account: IAccount;
    let privateKey: Uint8Array | null;

    // if there is no password lock
    if (!settings.security.enablePasswordLock && !passwordLockPassword) {
      // validate the password input
      if (validatePassword()) {
        logger.debug(
          `${ScanQRCodeModalAccountImportContent.name}#${_functionName}: password not valid`
        );

        return;
      }
    }

    _password = settings.security.enablePasswordLock
      ? passwordLockPassword
      : password;

    if (!_password) {
      logger.debug(
        `${ScanQRCodeModalAccountImportContent.name}#${_functionName}: unable to use password from password lock, value is "null"`
      );

      dispatch(
        createNotification({
          description: t<string>('errors.descriptions.code', {
            context: ErrorCodeEnum.ParsingError,
            type: 'password',
          }),
          ephemeral: true,
          title: t<string>('errors.titles.code', {
            context: ErrorCodeEnum.ParsingError,
          }),
          type: 'error',
        })
      );

      return;
    }

    privateKey = decodePrivateKeyFromAccountImportSchema(schema);

    if (!privateKey) {
      logger.debug(
        `${ScanQRCodeModalAccountImportContent.name}#${_functionName}: failed to decode the private key`
      );

      dispatch(
        createNotification({
          description: t<string>('errors.descriptions.code', {
            context: ErrorCodeEnum.ParsingError,
            type: 'key',
          }),
          ephemeral: true,
          title: t<string>('errors.titles.code', {
            context: ErrorCodeEnum.ParsingError,
          }),
          type: 'error',
        })
      );

      return;
    }

    setSaving(true);

    try {
      account = await dispatch(
        saveNewAccountThunk({
          name: null,
          password: _password,
          privateKey,
        })
      ).unwrap();
    } catch (error) {
      switch (error.code) {
        case ErrorCodeEnum.InvalidPasswordError:
          setPasswordError(t<string>('errors.inputs.invalidPassword'));

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

      setSaving(false);

      return;
    }

    dispatch(
      createNotification({
        ephemeral: true,
        description: t<string>('captions.addedAccount', {
          address: ellipseAddress(
            AccountService.convertPublicKeyToAlgorandAddress(account.publicKey)
          ),
        }),
        title: t<string>('headings.addedAccount'),
        type: 'success',
      })
    );

    // clean up and close
    handleOnComplete();
  };
  const handleKeyUpPasswordInput = async (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      await handleImportClick();
    }
  };
  const handleOnComplete = () => {
    reset();
    onComplete();
  };
  const reset = () => {
    resetPassword();
    setSaving(false);
  };
  // renders
  const renderFooter = () => {
    const cancelButton: ReactNode = (
      <Button onClick={handleCancelClick} size="lg" variant="outline" w="full">
        {t<string>('buttons.cancel')}
      </Button>
    );

    // only show cancel button if the account has been added
    if (isAccountAlreadyKnown) {
      return (
        <Button onClick={handleCancelClick} size="lg" variant="solid" w="full">
          {t<string>('buttons.cancel')}
        </Button>
      );
    }

    return (
      <VStack alignItems="flex-start" spacing={4} w="full">
        {!settings.security.enablePasswordLock && !passwordLockPassword && (
          <PasswordInput
            error={passwordError}
            hint={t<string>('captions.mustEnterPasswordToImportAccount')}
            onChange={onPasswordChange}
            onKeyUp={handleKeyUpPasswordInput}
            inputRef={passwordInputRef}
            value={password}
          />
        )}

        <HStack spacing={4} w="full">
          {/*cancel button*/}
          <Button
            onClick={handleCancelClick}
            size="lg"
            variant="outline"
            w="full"
          >
            {t<string>('buttons.cancel')}
          </Button>

          {/*import button*/}
          {!isAccountAlreadyKnown && (
            <Button
              isLoading={saving}
              onClick={handleImportClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.import')}
            </Button>
          )}
        </HStack>
      </VStack>
    );
  };

  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    const privateKey: Uint8Array | null =
      decodePrivateKeyFromAccountImportSchema(schema);

    if (privateKey) {
      setAddress(convertPrivateKeyToAddress(privateKey));
    }
  }, [schema]);

  return (
    <>
      {/*header*/}
      <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
        <Heading color={defaultTextColor} size="md" textAlign="center">
          {t<string>('headings.importAccount')}
        </Heading>
      </ModalHeader>

      {/*body*/}
      <ModalBody display="flex" px={DEFAULT_GAP}>
        <VStack alignItems="center" flexGrow={1} spacing={DEFAULT_GAP} w="full">
          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {t<string>('captions.importAccount')}
          </Text>

          {/*address*/}
          {!address ? (
            <ModalSkeletonItem />
          ) : (
            <ModalTextItem
              label={`${t<string>('labels.address')}:`}
              tooltipLabel={address}
              value={ellipseAddress(address, {
                end: 10,
                start: 10,
              })}
              {...(isAccountAlreadyKnown && {
                warningLabel: t<string>('captions.accountAlreadyAdded'),
              })}
            />
          )}
        </VStack>
      </ModalBody>

      {/*footer*/}
      <ModalFooter p={DEFAULT_GAP}>{renderFooter()}</ModalFooter>
    </>
  );
};

export default ScanQRCodeModalAccountImportContent;
