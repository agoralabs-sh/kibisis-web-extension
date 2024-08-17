import {
  HStack,
  Spacer,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { type FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAdd } from 'react-icons/io5';

// components
import Button from '@extension/components/Button';
import PageHeader from '@extension/components/PageHeader';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// modals
import AddCustomNodeModal from '@extension/modals/AddCustomNodeModal';

// selectors
import {
  useSelectCustomNodesFetching,
  useSelectCustomNodesItems,
} from '@extension/selectors';
import EmptyState from '@extension/components/EmptyState';

const CustomNodesPage: FC = () => {
  const { t } = useTranslation();
  const {
    isOpen: isAddCustomModalOpen,
    onClose: onAddCustomModalClose,
    onOpen: onAddCustomModalOpen,
  } = useDisclosure();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // selectors
  const customNodeItems = useSelectCustomNodesItems();
  const fetching = useSelectCustomNodesFetching();
  // handlers
  const handleAddCustomNodeClick = () => onAddCustomModalOpen();
  const handleAddCustomNodeModalClose = () => onAddCustomModalClose();
  // renders
  const renderContent = () => {
    const nodes: ReactElement[] = [];

    return nodes.length > 0 ? (
      nodes
    ) : (
      <>
        <Spacer />

        {/*empty state*/}
        <EmptyState text={t<string>('headings.noCustomNodesFound')} />

        <Spacer />
      </>
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
        flexGrow={1}
        pb={DEFAULT_GAP}
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

        {/*list of custom nodes*/}
        {renderContent()}
      </VStack>
    </>
  );
};

export default CustomNodesPage;
