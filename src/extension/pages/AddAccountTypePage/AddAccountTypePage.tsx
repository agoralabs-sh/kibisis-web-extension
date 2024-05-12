import { VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoEyeOutline, IoQrCodeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

// components
import CreateNewAccountIcon from '@extension/components/CreateNewAccountIcon';
import ImportAccountIcon from '@extension/components/ImportAccountIcon';
import PageHeader from '@extension/components/PageHeader';
import AccountTypeItem from './AccountTypeItem';

// constants
import {
  ADD_ACCOUNT_ROUTE,
  ADD_WATCH_ACCOUNT_ROUTE,
  CREATE_NEW_ACCOUNT_ROUTE,
  DEFAULT_GAP,
  IMPORT_ACCOUNT_VIA_SEED_PHRASE_ROUTE,
} from '@extension/constants';

// enums
import { AddAccountTypeEnum } from './enums';

// types
import type { IProps } from './types';

const AddAccountTypePage: FC<IProps> = ({
  allowAddWatchAccount,
  onImportAccountViaQRCodeClick,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // handlers
  const handleAccountTypeClick = (type: AddAccountTypeEnum) => () => {
    switch (type) {
      case AddAccountTypeEnum.AddWatch:
        navigate(`${ADD_ACCOUNT_ROUTE}${ADD_WATCH_ACCOUNT_ROUTE}`);

        break;
      case AddAccountTypeEnum.CreateNew:
        navigate(`${ADD_ACCOUNT_ROUTE}${CREATE_NEW_ACCOUNT_ROUTE}`);

        break;
      case AddAccountTypeEnum.ImportViaQRCode:
        onImportAccountViaQRCodeClick();

        break;
      case AddAccountTypeEnum.ImportViaSeedPhrase:
        navigate(`${ADD_ACCOUNT_ROUTE}${IMPORT_ACCOUNT_VIA_SEED_PHRASE_ROUTE}`);

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
          onClick={handleAccountTypeClick(AddAccountTypeEnum.CreateNew)}
          title={t<string>('headings.createNewAccount')}
        />

        {/*import account via seed phrase*/}
        <AccountTypeItem
          description={t<string>('captions.importAccountViaSeedPhrase')}
          icon={ImportAccountIcon}
          onClick={handleAccountTypeClick(
            AddAccountTypeEnum.ImportViaSeedPhrase
          )}
          title={t<string>('headings.importAccountViaSeedPhrase')}
        />

        {/*add watch account*/}
        {allowAddWatchAccount && (
          <AccountTypeItem
            description={t<string>('captions.addWatchAccount')}
            icon={IoEyeOutline}
            onClick={handleAccountTypeClick(AddAccountTypeEnum.AddWatch)}
            title={t<string>('headings.addWatchAccount')}
          />
        )}

        {/*import account via qr code*/}
        <AccountTypeItem
          description={t<string>('captions.importAccountViaQRCode')}
          icon={IoQrCodeOutline}
          onClick={handleAccountTypeClick(AddAccountTypeEnum.ImportViaQRCode)}
          title={t<string>('headings.importAccountViaQRCode')}
        />
      </VStack>
    </>
  );
};

export default AddAccountTypePage;
