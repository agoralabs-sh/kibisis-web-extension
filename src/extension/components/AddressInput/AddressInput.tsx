import {
  HStack,
  Input,
  InputRightElement,
  Stack,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import React, { type ChangeEvent, type FocusEvent, type FC } from 'react';
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
import type { IProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import validateAddressInput from '@extension/utils/validateAddressInput';
import InformationIcon from '@extension/components/InformationIcon';

const AddressInput: FC<IProps> = ({
  _context,
  accounts,
  allowWatchAccounts = true,
  error,
  id,
  disabled,
  label,
  onBlur,
  onChange,
  onError,
  required = false,
  validate,
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
  const _id = id || encodeBase64URLSafe(randomBytes(6));
  // handlers
  const handleOnBlur = (event: FocusEvent<HTMLInputElement>) => {
    onError &&
      onError(
        validateAddressInput({
          field: label,
          t,
          required,
          validate,
          value: event.target.value,
        })
      );

    return onBlur && onBlur(event);
  };
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const _value = event.target.value;

    onError &&
      onError(
        validateAddressInput({
          field: label,
          t,
          required,
          validate,
          value: _value,
        })
      );

    return onChange(_value);
  };
  const handleOnClick = () => onAccountSelectModalOpen();
  const handleOnSelect = (_accounts: IAccountWithExtendedProps[]) => {
    const _value = _accounts[0]
      ? convertPublicKeyToAVMAddress(_accounts[0].publicKey)
      : '';

    onError &&
      onError(
        validateAddressInput({
          field: label,
          t,
          required,
          validate,
          value: _value,
        })
      );

    return onChange(_value);
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
      />

      <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
        {/*label*/}
        <Label
          error={error}
          inputID={_id}
          label={label || t<string>('labels.address')}
          required={required}
        />

        <HStack justifyContent="center" spacing={DEFAULT_GAP / 3} w="full">
          {/*input*/}
          <Input
            focusBorderColor={error ? 'red.300' : primaryColor}
            id={_id}
            isDisabled={disabled}
            isInvalid={!!error}
            h={INPUT_HEIGHT}
            onBlur={handleOnBlur}
            onChange={handleOnChange}
            placeholder={t<string>('placeholders.enterAddress')}
            type="text"
            value={value}
            w="full"
          />

          <InputRightElement h={INPUT_HEIGHT}>
            <Stack alignItems="center" h={INPUT_HEIGHT} justifyContent="center">
              <InformationIcon
                ariaLabel="Information icon"
                tooltipLabel={informationText}
              />
            </Stack>
          </InputRightElement>

          {/*open account select modal button*/}
          <Tooltip label={t<string>('labels.selectAccount')}>
            <IconButton
              aria-label={t<string>('labels.selectAccount')}
              disabled={disabled}
              icon={IoChevronDownOutline}
              onClick={handleOnClick}
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
