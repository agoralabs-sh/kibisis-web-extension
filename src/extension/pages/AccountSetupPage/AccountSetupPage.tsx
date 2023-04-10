import { VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// Components
import CreateNewAccountIcon from '@extension/components/CreateNewAccountIcon';
import ImportAccountIcon from '@extension/components/ImportAccountIcon';
import ImportRekeyAccountIcon from '@extension/components/ImportRekeyAccountIcon';
import PageHeader from '@extension/components/PageHeader';
import PageShell from '@extension/components/PageShell';
import AccountTypeItem from './AccountTypeItem';

// Constants
import {
  ADD_ACCOUNT_ROUTE,
  CREATE_NEW_ACCOUNT_ROUTE,
  DEFAULT_GAP,
  IMPORT_EXISTING_ACCOUNT_ROUTE,
} from '@extension/constants';

const AccountSetupPage: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const handleAccountTypeClick =
    (type: 'create' | 'import' | 'rekey') => () => {
      switch (type) {
        case 'create':
          navigate(`${ADD_ACCOUNT_ROUTE}${CREATE_NEW_ACCOUNT_ROUTE}`);

          break;
        case 'import':
          navigate(`${ADD_ACCOUNT_ROUTE}${IMPORT_EXISTING_ACCOUNT_ROUTE}`);

          break;
        case 'rekey':
        default:
          break;
      }
    };

  return (
    <PageShell>
      <PageHeader
        title={t<string>('titles.page', { context: 'accountSetup' })}
      />
      <VStack
        flexGrow={1}
        justifyContent="center"
        mb={DEFAULT_GAP}
        px={DEFAULT_GAP}
        spacing={2}
        w="full"
      >
        <AccountTypeItem
          description={t<string>('captions.createNewAccount')}
          icon={CreateNewAccountIcon}
          onClick={handleAccountTypeClick('create')}
          title={t<string>('headings.createNewAccount')}
        />
        <AccountTypeItem
          description={t<string>('captions.importExistingAccount')}
          icon={ImportAccountIcon}
          onClick={handleAccountTypeClick('import')}
          title={t<string>('headings.importExistingAccount')}
        />
        <AccountTypeItem
          description={t<string>('captions.importRekeyedAccount')}
          disabled={true}
          icon={ImportRekeyAccountIcon}
          onClick={handleAccountTypeClick('rekey')}
          title={t<string>('headings.importRekeyedAccount')}
          tooltipText="Coming soon!"
        />
      </VStack>
    </PageShell>
  );
};

export default AccountSetupPage;
