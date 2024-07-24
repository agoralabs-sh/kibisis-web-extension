import { HStack, useDisclosure } from '@chakra-ui/react';
import { isValidAddress } from 'algosdk';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoPersonAddOutline } from 'react-icons/io5';

// components
import GenericInput from '@extension/components/GenericInput';
import IconButton from '@extension/components/IconButton';

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
  disabled,
  label,
  onBlur,
  onChange,
  onError,
  value,
}) => {
  const { t } = useTranslation();
  const {
    isOpen: isAccountSelectModalOpen,
    onClose: onAccountSelectClose,
    onOpen: onAccountSelectModalOpen,
  } = useDisclosure();
  // misc
  const validate = (_value: string): string | null => {
    if (!isValidAddress(_value)) {
      return t<string>('errors.inputs.invalidAddress');
    }

    return null;
  };
  // handlers
  const handleAccountClick = () => onAccountSelectModalOpen();
  const handleHandleOnChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.value);
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

      <HStack alignItems="flex-end" w="full">
        {/*input*/}
        <GenericInput
          isDisabled={disabled}
          label={label || t<string>('labels.address')}
          onBlur={onBlur}
          onChange={handleHandleOnChange}
          onError={onError}
          placeholder={t<string>('placeholders.enterAddress')}
          required={true}
          type="text"
          validate={validate}
          value={value}
        />

        {/*account select*/}
        <IconButton
          aria-label="Select an account from the list of available accounts"
          disabled={disabled}
          icon={IoPersonAddOutline}
          onClick={handleAccountClick}
          size="lg"
          variant="ghost"
        />
      </HStack>
    </>
  );
};

export default AddressInput;
