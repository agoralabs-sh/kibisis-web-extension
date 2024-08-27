import {
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronDownOutline } from 'react-icons/io5';
import { randomBytes } from 'tweetnacl';

// components
import IconButton from '@extension/components/IconButton';
import Label from '@extension/components/Label';

// constants
import { DEFAULT_GAP, INPUT_HEIGHT } from '@extension/constants';

// hooks
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// modals
import { AccountSelectModal } from '@extension/components/AccountSelect';

// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type { TProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

const AddressInput: FC<TProps> = ({
  _context,
  accounts,
  allowWatchAccounts = true,
  error,
  id,
  isDisabled,
  label,
  onSelect,
  required = false,
  selectButtonLabel,
  selectModalTitle,
  validate,
  ...inputProps
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
  const _id = id || encodeBase64URLSafe(randomBytes(6));
  // handlers
  const handleOnClick = () => onAccountSelectModalOpen();
  const handleOnSelect = (_accounts: IAccountWithExtendedProps[]) => {
    const _value = _accounts[0]
      ? convertPublicKeyToAVMAddress(_accounts[0].publicKey)
      : null;

    return _value && onSelect && onSelect(_value);
  };

  return (
    <>
      {/*account select modal*/}
      <AccountSelectModal
        _context={_context}
        accounts={accounts}
        allowWatchAccounts={allowWatchAccounts}
        isOpen={isAccountSelectModalOpen}
        multiple={false}
        onClose={onAccountSelectClose}
        onSelect={handleOnSelect}
        title={selectModalTitle}
      />

      <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
        {/*label*/}
        <Label
          error={error}
          inputID={_id}
          label={label || t<string>('labels.address')}
          px={DEFAULT_GAP - 2}
          required={required}
        />

        {/*input*/}
        <InputGroup size="md">
          {/*input*/}
          <Input
            {...inputProps}
            borderRadius="full"
            focusBorderColor={error ? 'red.300' : primaryColor}
            id={_id}
            isDisabled={isDisabled}
            isInvalid={!!error}
            h={INPUT_HEIGHT}
            placeholder={t<string>('placeholders.enterAddress')}
            type="text"
            w="full"
          />

          <InputRightElement h={INPUT_HEIGHT}>
            {/*open account select modal button*/}
            <Tooltip
              label={selectButtonLabel || t<string>('labels.selectAccount')}
            >
              <IconButton
                aria-label={
                  selectButtonLabel || t<string>('labels.selectAccount')
                }
                borderRadius="full"
                isDisabled={isDisabled}
                icon={IoChevronDownOutline}
                onClick={handleOnClick}
                size="sm"
                variant="ghost"
              />
            </Tooltip>
          </InputRightElement>
        </InputGroup>
      </VStack>
    </>
  );
};

export default AddressInput;
