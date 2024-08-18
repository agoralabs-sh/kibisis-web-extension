import {
  HStack,
  Spacer,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { type FC, type ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAddOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import EmptyState from '@extension/components/EmptyState';
import CustomNodeItem from '@extension/components/CustomNodeItem';
import PageHeader from '@extension/components/PageHeader';
import ScrollableContainer from '@extension/components/ScrollableContainer';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// features
import { setConfirmModal } from '@extension/features/layout';
import { create as createNotification } from '@extension/features/notifications';
import { removeByIDFromStorageThunk as removeCustomNodeByIDFromStorageThunk } from '@extension/features/custom-nodes';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// modals
import AddCustomNodeModal from '@extension/modals/AddCustomNodeModal';
import ViewCustomNodeModal from '@extension/modals/ViewCustomNodeModal';

// selectors
import {
  useSelectCustomNodesFetching,
  useSelectCustomNodesItems,
  useSelectNetworks,
  useSelectSettings,
} from '@extension/selectors';

// types
import type { IAppThunkDispatch, IMainRootState } from '@extension/types';

// utils
import isNetworkSupportedFromSettings from '@extension/utils/isNetworkSupportedFromSettings';
import { ICustomNodeItem } from '@extension/services/CustomNodesService';

const CustomNodesPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const {
    isOpen: isAddCustomModalOpen,
    onClose: onAddCustomModalClose,
    onOpen: onAddCustomModalOpen,
  } = useDisclosure();
  // hooks
  const borderColor = useBorderColor();
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // selectors
  const customNodeItems = useSelectCustomNodesItems();
  const fetching = useSelectCustomNodesFetching();
  const networks = useSelectNetworks();
  const settings = useSelectSettings();
  // states
  const [viewCustomNodeItem, setViewCustomNodeItem] =
    useState<ICustomNodeItem | null>(null);
  // handlers
  const handleAddCustomNodeClick = () => onAddCustomModalOpen();
  const handleAddCustomNodeModalClose = () => onAddCustomModalClose();
  const handleRemoveCustomNodeClick = (id: string) => {
    const item = customNodeItems.find((value) => value.id === id) || null;

    if (!item) {
      return;
    }

    dispatch(
      setConfirmModal({
        description: t<string>('captions.removeCustomNodeConfirm', {
          name: item.name,
        }),
        onConfirm: () => {
          dispatch(removeCustomNodeByIDFromStorageThunk(item.id));
          dispatch(
            createNotification({
              description: t<string>('captions.removedCustomNode', {
                name: item.name,
              }),
              title: t<string>('headings.removedCustomNode'),
              type: 'info',
            })
          );
        },
        title: t<string>('headings.removeCustomNode'),
      })
    );
  };
  const handleSelectCustomNodeClick = (id: string) => {
    const item = customNodeItems.find((value) => value.id === id) || null;

    if (!item) {
      return;
    }

    setViewCustomNodeItem(item);
  };
  const handleViewCustomNodeClose = () => setViewCustomNodeItem(null);
  // renders
  const renderContent = () => {
    const nodes: ReactElement[] = [...customNodeItems]
      // first sort the nodes, putting disabled ones at the back
      .sort((first, second) => {
        const isFirstNodeAvailable = isNetworkSupportedFromSettings({
          genesisHash: first.genesisHash,
          networks,
          settings,
        });
        const isSecondNodeAvailable = isNetworkSupportedFromSettings({
          genesisHash: second.genesisHash,
          networks,
          settings,
        });

        if (isFirstNodeAvailable && !isSecondNodeAvailable) {
          return -1;
        }

        if (!isFirstNodeAvailable && isSecondNodeAvailable) {
          return 1;
        }

        return 0;
      })
      .reduce((acc, currentValue, index) => {
        const network =
          networks.find(
            (value) => value.genesisHash === currentValue.genesisHash
          ) || null;

        return network
          ? [
              ...acc,
              <CustomNodeItem
                key={`custom-page-custom-node-item-${index}`}
                item={currentValue}
                isDisabled={
                  !isNetworkSupportedFromSettings({
                    genesisHash: currentValue.genesisHash,
                    networks,
                    settings,
                  })
                }
                network={network}
                onRemove={handleRemoveCustomNodeClick}
                onSelect={handleSelectCustomNodeClick}
              />,
            ]
          : acc;
      }, []);

    return nodes.length > 0 ? (
      <ScrollableContainer
        direction="column"
        flexGrow={1}
        m={0}
        p={0}
        spacing={0}
        w="full"
      >
        {nodes}
      </ScrollableContainer>
    ) : (
      <VStack flexGrow={1} w="full">
        <Spacer />

        {/*empty state*/}
        <EmptyState text={t<string>('headings.noCustomNodesFound')} />

        <Spacer />
      </VStack>
    );
  };

  return (
    <>
      <AddCustomNodeModal
        isOpen={isAddCustomModalOpen}
        onClose={handleAddCustomNodeModalClose}
      />
      <ViewCustomNodeModal
        item={viewCustomNodeItem}
        onClose={handleViewCustomNodeClose}
      />

      {/*page title*/}
      <PageHeader
        title={t<string>('titles.page', { context: 'customNodes' })}
      />

      <VStack
        borderBottomColor={borderColor}
        borderBottomStyle="solid"
        borderBottomWidth="1px"
        pb={DEFAULT_GAP / 3}
        px={DEFAULT_GAP}
        spacing={DEFAULT_GAP / 3}
        w="full"
      >
        {/*caption*/}
        <Text color={subTextColor} fontSize="sm" textAlign="left" w="full">
          {t<string>('captions.customNodes')}
        </Text>

        {/*controls*/}
        <HStack
          alignItems="center"
          justifyContent="flex-start"
          px={DEFAULT_GAP / 2}
          py={DEFAULT_GAP / 3}
          spacing={1}
          w="full"
        >
          {/*fetching*/}
          {fetching && (
            <Tooltip
              aria-label="Fetching custom nodes from storage spinner"
              label={t<string>('captions.fetchingCustomNodes')}
            >
              <Spinner
                thickness="1px"
                speed="0.65s"
                color={defaultTextColor}
                size="sm"
              />
            </Tooltip>
          )}

          <Spacer />

          {/*add custom node button*/}
          <Button
            aria-label={t<string>('buttons.addCustomNode')}
            onClick={handleAddCustomNodeClick}
            rightIcon={<IoAddOutline />}
            size="sm"
            variant="solid"
          >
            {t<string>('buttons.addCustomNode')}
          </Button>
        </HStack>
      </VStack>

      {/*list of custom nodes*/}
      {renderContent()}
    </>
  );
};

export default CustomNodesPage;
