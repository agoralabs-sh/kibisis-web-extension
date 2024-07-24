import {
  HStack,
  Input,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import { isValidAddress } from 'algosdk';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { GoSingleSelect } from 'react-icons/go';
import { randomBytes } from 'tweetnacl';

// components
import IconButton from '@extension/components/IconButton';
import Label from '@extension/components/Label';

// constants
import { DEFAULT_GAP, INPUT_HEIGHT } from '@extension/constants';

// hooks
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// modals
import AccountSelectModal from '@extension/modals/AccountSelectModal';

// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type { IProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

const AddressInput: FC<IProps> = ({
  accounts,
  allowWatchAccounts = true,
  error,
  disabled,
  label,
  onBlur,
  onChange,
  onError,
  required = false,
  value,
}) => {
  const { t } = useTranslation();
  const {
    isOpen: isAccountSelectModalOpen,
    onClose: onAccountSelectClose,
    onOpen: onAccountSelectModalOpen,
  } = useDisclosure();
  // hooks
  const primaryColor = usePrimaryColor();
  // misc
  const id = encodeBase64URLSafe(randomBytes(6));
  const validate = (_value: string): string | null => {
    if (value.length <= 0 && required) {
      return t<string>('errors.inputs.required', { name: label });
    }

    if (!isValidAddress(_value)) {
      return t<string>('errors.inputs.invalidAddress');
    }

    return null;
  };
  // handlers
  const handleAccountClick = () => onAccountSelectModalOpen();
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    let _error: string | null;

    // clear error
    onError && onError(null);

    // validate any new errors
    _error = validate(event.target.value);

    if (_error) {
      onError && onError(_error);
    }

    return onChange && onChange(event.target.value);
  };
  const handleOnAccountSelect = (_accounts: IAccountWithExtendedProps[]) =>
    onChange(
      _accounts[0] ? convertPublicKeyToAVMAddress(_accounts[0].publicKey) : ''
    );

  return (
    <>
      {/*account select modal*/}
      <AccountSelectModal
        accounts={accounts}
        allowWatchAccounts={allowWatchAccounts}
        isOpen={isAccountSelectModalOpen}
        multiple={false}
        onClose={onAccountSelectClose}
        onSelect={handleOnAccountSelect}
      />

      <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
        {/*label*/}
        <Label
          error={error}
          inputID={id}
          label={label || t<string>('labels.address')}
          required={required}
        />

        <HStack justifyContent="center" spacing={DEFAULT_GAP / 3} w="full">
          {/*input*/}
          <Input
            focusBorderColor={error ? 'red.300' : primaryColor}
            id={id}
            isDisabled={disabled}
            isInvalid={!!error}
            h={INPUT_HEIGHT}
            onBlur={onBlur}
            onChange={handleOnChange}
            placeholder={t<string>('placeholders.enterAddress')}
            type="text"
            value={value}
            w="full"
          />

          {/*open account select modal button*/}
          <Tooltip label={t<string>('labels.selectAccount')}>
            <IconButton
              aria-label="Select an account from the list of available accounts"
              disabled={disabled}
              icon={GoSingleSelect}
              onClick={handleAccountClick}
              size="lg"
              variant="ghost"
            />
          </Tooltip>
        </HStack>
      </VStack>
    </>
  );
};

export default AddressInput;
