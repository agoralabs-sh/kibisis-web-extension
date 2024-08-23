import {
  HStack,
  Spacer,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { type FC, type ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAddOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import EmptyState from '@extension/components/EmptyState';
import CustomNodeItem from '@extension/components/CustomNodeItem';
import NetworkSelect from '@extension/components/NetworkSelect';
import PageHeader from '@extension/components/PageHeader';
import ScrollableContainer from '@extension/components/ScrollableContainer';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// features
import { setConfirmModal } from '@extension/features/layout';
import { removeCustomNodeThunk } from '@extension/features/networks';
import { create as createNotification } from '@extension/features/notifications';
import { saveToStorageThunk as saveSettingsToStorageThunk } from '@extension/features/settings';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// modals
import AddCustomNodeModal from '@extension/modals/AddCustomNodeModal';
import ViewCustomNodeModal from '@extension/modals/ViewCustomNodeModal';

// selectors
import {
  useSelectNetworks,
  useSelectSettings,
  useSelectSettingsSelectedNetwork,
} from '@extension/selectors';

// types
import type {
  IAppThunkDispatch,
  ICustomNode,
  IMainRootState,
  INetwork,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import filterCustomNodesFromNetwork from '@extension/utils/filterCustomNodesFromNetwork';
import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

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
  const subTextColor = useSubTextColor();
  // selectors
  const networks = useSelectNetworks();
  const selectedNetwork = useSelectSettingsSelectedNetwork();
  const settings = useSelectSettings();
  // states
  const [network, setNetwork] = useState<INetwork>(
    selectedNetwork || selectDefaultNetwork(networks)
  );
  const [nodeID, setNodeID] = useState<string | null>(null);
  const [viewCustomNode, setViewCustomNode] = useState<ICustomNode | null>(
    null
  );
  // misc
  const _context = 'custom-nodes-page';
  // handlers
  const handleAddCustomNodeClick = () => onAddCustomModalOpen();
  const handleAddCustomNodeModalClose = () => onAddCustomModalClose();
  const handleActivateCustomNodeClick = (id: string) => {
    if (!network) {
      return;
    }

    dispatch(
      saveSettingsToStorageThunk({
        ...settings,
        general: {
          ...settings.general,
          selectedNodeIDs: {
            ...settings.general.selectedNodeIDs,
            [convertGenesisHashToHex(network.genesisHash)]: id,
          },
        },
      })
    );
  };
  const handleDeactivateCustomNodeClick = () => {
    if (!network) {
      return;
    }

    dispatch(
      saveSettingsToStorageThunk({
        ...settings,
        general: {
          ...settings.general,
          selectedNodeIDs: {
            ...settings.general.selectedNodeIDs,
            [convertGenesisHashToHex(network.genesisHash)]: null,
          },
        },
      })
    );
  };
  const handleRemoveCustomNodeClick = (id: string) => {
    const item =
      filterCustomNodesFromNetwork(network).find((value) => value.id === id) ||
      null;

    if (!item) {
      return;
    }

    dispatch(
      setConfirmModal({
        description: t<string>('captions.removeCustomNodeConfirm', {
          name: item.name,
        }),
        onConfirm: async () => {
          const _network = await dispatch(
            removeCustomNodeThunk({
              genesisHash: network.genesisHash,
              id: item.id,
            })
          ).unwrap();

          // update the network to update the custom node list
          if (_network?.genesisHash === network.genesisHash) {
            setNetwork(_network);
          }

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
  const handleNetworkSelect = (value: INetwork) => setNetwork(value);
  const handleOnAddCustomNodeComplete = (
    value: INetworkWithTransactionParams | null
  ) => {
    // update the network to update the custom node list
    if (value?.genesisHash === network.genesisHash) {
      setNetwork(value);
    }
  };
  const handleSelectCustomNodeClick = (id: string) => {
    const item =
      filterCustomNodesFromNetwork(network).find((value) => value.id === id) ||
      null;

    setViewCustomNode(item);
  };
  const handleViewCustomNodeClose = () => setViewCustomNode(null);
  // renders
  const renderContent = () => {
    const nodes: ReactElement[] = filterCustomNodesFromNetwork(network)
      // first sort the nodes, putting disabled ones at the back
      .sort((a, b) => {
        // bring the id to the front
        if (a.id === nodeID) {
          return -1;
        }

        // keep the id in place
        if (b.id === nodeID) {
          return 1;
        }

        // keep the original order
        return 0;
      })
      .map((value, index) => (
        <CustomNodeItem
          key={`${_context}-custom-node-item-${index}`}
          item={value}
          isActivated={value.id === nodeID}
          onActivate={handleActivateCustomNodeClick}
          onDeactivate={handleDeactivateCustomNodeClick}
          onRemove={handleRemoveCustomNodeClick}
          onSelect={handleSelectCustomNodeClick}
        />
      ));

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

  useEffect(() => {
    const _nodeID = selectNodeIDByGenesisHashFromSettings({
      genesisHash: network.genesisHash,
      settings,
    });

    if (_nodeID === nodeID) {
      return;
    }

    setNodeID(_nodeID);
  }, [network, settings]);

  return (
    <>
      <AddCustomNodeModal
        isOpen={isAddCustomModalOpen}
        onClose={handleAddCustomNodeModalClose}
        onComplete={handleOnAddCustomNodeComplete}
      />
      <ViewCustomNodeModal
        item={viewCustomNode}
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
        pb={DEFAULT_GAP - 2}
        px={DEFAULT_GAP}
        spacing={DEFAULT_GAP - 2}
        w="full"
      >
        {/*caption*/}
        <Text color={subTextColor} fontSize="sm" textAlign="left" w="full">
          {t<string>('captions.customNodes')}
        </Text>

        {/*controls*/}
        <HStack
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          w="full"
        >
          {/*network selection*/}
          <NetworkSelect
            _context={_context}
            networks={networks}
            onSelect={handleNetworkSelect}
            value={network}
          />

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
