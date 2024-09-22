import {
  DndContext,
  type DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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
  isShortForm,
  network,
  onClick,
  onSort,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // states
  const [_accounts, setAccounts] =
    useState<IAccountWithExtendedProps[]>(accounts);
  // handlers
  const handleOnClick = async (id: string) => onClick(id);
  const handleOnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    let previousIndex: number;
    let nextIndex: number;
    let updatedAccounts: IAccountWithExtendedProps[];

    if (active.id !== over?.id) {
      previousIndex = _accounts.findIndex(({ id }) => id === active.id);
      nextIndex = _accounts.findIndex(({ id }) => id === over?.id);

      setAccounts((prevState) => {
        updatedAccounts = arrayMove(prevState, previousIndex, nextIndex);

        // update the external account state
        onSort(updatedAccounts);

        return updatedAccounts;
      });
    }
  };

  // update the internal accounts state with the incoming state
  useEffect(() => setAccounts(accounts), [accounts]);

  return (
    <>
      {isLoading || !network ? (
        Array.from({ length: 3 }, (_, index) => (
          <SkeletonItem key={`sidebar-fetching-item-${index}`} />
        ))
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleOnDragEnd}
        >
          <SortableContext
            items={_accounts}
            strategy={verticalListSortingStrategy}
          >
            {_accounts.map((value) => (
              <Item
                account={value}
                accounts={_accounts}
                active={activeAccount ? value.id === activeAccount.id : false}
                isShortForm={isShortForm}
                key={value.id}
                network={network}
                onClick={handleOnClick}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </>
  );
};

export default SideBarAccountList;
