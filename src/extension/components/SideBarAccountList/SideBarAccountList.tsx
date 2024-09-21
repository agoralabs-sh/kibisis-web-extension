import React, { type FC, useEffect, useState } from 'react';

// components
import Item from './Item';
import SkeletonItem from './SkeletonItem';

// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type { IProps } from './types';

const SideBarAccountList: FC<IProps> = ({
  accounts,
  activeAccount,
  isLoading,
  network,
  onClick,
  onSort,
}) => {
  // state
  const [_accounts, setAccounts] =
    useState<IAccountWithExtendedProps[]>(accounts);
  // handlers
  const handleOnClick = async (id: string) => onClick(id);
  const handleOnSort = (dragIndex: number, hoverIndex: number) => {
    setAccounts((prevState) => {
      const nextState = [...prevState];
      const [item] = nextState.splice(dragIndex, 1); // remove the index

      // replace at the index
      nextState.splice(hoverIndex, 0, item);

      return nextState;
    });
  };
  const handleOnSortComplete = () => onSort(_accounts);

  useEffect(() => {
    // if the accounts are being updated, ensure the index is maintained if the users is sorting
    if (accounts.length > 0 && accounts.length === _accounts.length) {
      setAccounts((prevState) =>
        prevState.map(
          (value) => accounts.find(({ id }) => id === value.id) || value
        )
      );

      return;
    }

    setAccounts(accounts);
  }, [accounts]);

  return (
    <>
      {isLoading || !network
        ? Array.from({ length: 3 }, (_, index) => (
            <SkeletonItem key={`sidebar-fetching-item-${index}`} />
          ))
        : _accounts.map((value, index) => (
            <Item
              account={value}
              accounts={_accounts}
              active={activeAccount ? value.id === activeAccount.id : false}
              index={index}
              key={value.id}
              network={network}
              onClick={handleOnClick}
              onSort={handleOnSort}
              onSortComplete={handleOnSortComplete}
            />
          ))}
    </>
  );
};

export default SideBarAccountList;
