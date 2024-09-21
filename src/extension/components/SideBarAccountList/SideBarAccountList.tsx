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
import React, { type FC } from 'react';

// components
import Item from './Item';
import SkeletonItem from './SkeletonItem';

// types
import type { IProps } from './types';

const SideBarAccountList: FC<IProps> = ({
  accounts,
  activeAccount,
  isLoading,
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
  // handlers
  const handleOnClick = async (id: string) => onClick(id);
  const handleOnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    let previousIndex: number;
    let nextIndex: number;

    if (active.id !== over?.id) {
      previousIndex = accounts.findIndex(({ id }) => id === active.id);
      nextIndex = accounts.findIndex(({ id }) => id === over?.id);

      onSort(arrayMove(accounts, previousIndex, nextIndex));
    }
  };

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
            items={accounts}
            strategy={verticalListSortingStrategy}
          >
            {accounts.map((value) => (
              <Item
                account={value}
                accounts={accounts}
                active={activeAccount ? value.id === activeAccount.id : false}
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
