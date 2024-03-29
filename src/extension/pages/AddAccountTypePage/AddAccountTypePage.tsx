import { VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoQrCodeOutline } from 'react-icons/io5';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// components
import CreateNewAccountIcon from '@extension/components/CreateNewAccountIcon';
import ImportAccountIcon from '@extension/components/ImportAccountIcon';
import PageHeader from '@extension/components/PageHeader';
import AccountTypeItem from './AccountTypeItem';

// constants
import {
  ADD_ACCOUNT_ROUTE,
  CREATE_NEW_ACCOUNT_ROUTE,
  DEFAULT_GAP,
  IMPORT_ACCOUNT_VIA_SEED_PHRASE_ROUTE,
} from '@extension/constants';

// types
import type { IProps } from './types';

const AddAccountTypePage: FC<IProps> = ({ onImportAccountViaQRCodeClick }) => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  // handlers
  const handleAccountTypeClick =
    (type: 'create' | 'import-via-seed-phrase' | 'import-via-qr-code') =>
    () => {
      switch (type) {
        case 'create':
          navigate(`${ADD_ACCOUNT_ROUTE}${CREATE_NEW_ACCOUNT_ROUTE}`);

          break;
        case 'import-via-seed-phrase':
          navigate(
            `${ADD_ACCOUNT_ROUTE}${IMPORT_ACCOUNT_VIA_SEED_PHRASE_ROUTE}`
          );

          break;
        case 'import-via-qr-code':
          onImportAccountViaQRCodeClick();

          break;
        default:
          break;
      }
    };

  return (
    <>
      <PageHeader
        title={t<string>('titles.page', { context: 'accountSetup' })}
      />

      <VStack
        flexGrow={1}
        justifyContent="center"
        p={DEFAULT_GAP}
        spacing={DEFAULT_GAP - 2}
        w="full"
      >
        {/*create new account*/}
        <AccountTypeItem
          description={t<string>('captions.createNewAccount')}
          icon={CreateNewAccountIcon}
          onClick={handleAccountTypeClick('create')}
          title={t<string>('headings.createNewAccount')}
        />

        {/*import account via seed phrase*/}
        <AccountTypeItem
          description={t<string>('captions.importAccountViaSeedPhrase')}
          icon={ImportAccountIcon}
          onClick={handleAccountTypeClick('import-via-seed-phrase')}
          title={t<string>('headings.importAccountViaSeedPhrase')}
        />

        {/*import account via qr code*/}
        <AccountTypeItem
          description={t<string>('captions.importAccountViaQRCode')}
          icon={IoQrCodeOutline}
          onClick={handleAccountTypeClick('import-via-qr-code')}
          title={t<string>('headings.importAccountViaQRCode')}
        />
      </VStack>
    </>
  );
};

export default AddAccountTypePage;
