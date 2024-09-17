import { Grid, GridItem } from '@chakra-ui/react';
import React, { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CiUsb } from 'react-icons/ci';
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
import type { IItemProps, IProps } from './types';

const AddAccountTypePage: FC<IProps> = ({
  allowAddWatchAccount,
  onImportAccountViaQRCodeClick,
}) => {
  const _context = 'account-type-page';
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
  // renders
  const renderItems = () => {
    const items: IItemProps[] = [
      {
        description: t<string>('captions.createNewAccount'),
        icon: CreateNewAccountIcon,
        onClick: handleAccountTypeClick(AddAccountTypeEnum.CreateNew),
        title: t<string>('headings.createNewAccount'),
      },
      {
        description: t<string>('captions.importAccountViaSeedPhrase'),
        icon: ImportAccountIcon,
        onClick: handleAccountTypeClick(AddAccountTypeEnum.ImportViaSeedPhrase),
        title: t<string>('headings.importAccountViaSeedPhrase'),
      },
      ...(allowAddWatchAccount
        ? [
            {
              description: t<string>('captions.addWatchAccount'),
              icon: IoEyeOutline,
              onClick: handleAccountTypeClick(AddAccountTypeEnum.AddWatch),
              title: t<string>('headings.addWatchAccount'),
            },
          ]
        : []),
      {
        description: t<string>('captions.importAccountViaQRCode'),
        icon: IoQrCodeOutline,
        onClick: handleAccountTypeClick(AddAccountTypeEnum.ImportViaQRCode),
        title: t<string>('headings.importAccountViaQRCode'),
      },
    ];

    return (
      <Grid
        gap={DEFAULT_GAP - 2}
        p={DEFAULT_GAP}
        templateColumns="repeat(2, 1fr)"
        w="full"
      >
        {items.map((props, index, array) => {
          const key = `${_context}-item-${index}`;

          // if it is the last in the index and there is an odd amount, put in the center
          if (array.length % 2 !== 0 && index >= array.length - 1) {
            return (
              <GridItem
                alignItems="center"
                colSpan={2}
                display="flex"
                key={key}
                justifyContent="center"
              >
                <AccountTypeItem {...props} />
              </GridItem>
            );
          }

          return (
            <GridItem
              alignItems="center"
              display="flex"
              key={key}
              justifyContent={(index + 1) % 2 === 0 ? 'flex-start' : 'flex-end'}
            >
              <AccountTypeItem {...props} />
            </GridItem>
          );
        })}
      </Grid>
    );
  };

  return (
    <>
      <PageHeader
        title={t<string>('titles.page', { context: 'accountSetup' })}
      />

      {renderItems()}
    </>
  );
};

export default AddAccountTypePage;
