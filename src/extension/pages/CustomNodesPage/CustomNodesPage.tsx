import {
  HStack,
  Spacer,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { type FC, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAdd } from 'react-icons/io5';

// components
import Button from '@extension/components/Button';
import EmptyState from '@extension/components/EmptyState';
import CustomNodeItem from '@extension/components/CustomNodeItem';
import PageHeader from '@extension/components/PageHeader';
import ScrollableContainer from '@extension/components/ScrollableContainer';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// modals
import AddCustomNodeModal from '@extension/modals/AddCustomNodeModal';

// selectors
import {
  useSelectCustomNodesFetching,
  useSelectCustomNodesItems,
  useSelectNetworks,
  useSelectSettings,
} from '@extension/selectors';
import isNetworkSupportedFromSettings from '@extension/utils/isNetworkSupportedFromSettings';

const CustomNodesPage: FC = () => {
  const { t } = useTranslation();
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
  // handlers
  const handleAddCustomNodeClick = () => onAddCustomModalOpen();
  const handleAddCustomNodeModalClose = () => onAddCustomModalClose();
  const handleRemoveCustomNodeClick = (id: string) => {};
  const handleSelectCustomNodeClick = (id: string) => {};
  // renders
  const renderContent = () => {
    const nodes: ReactElement[] = customNodeItems
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

        if (isFirstNodeAvailable) {
          return -1;
        }

        return isSecondNodeAvailable ? 1 : 0;
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
            leftIcon={<IoAdd />}
            onClick={handleAddCustomNodeClick}
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
