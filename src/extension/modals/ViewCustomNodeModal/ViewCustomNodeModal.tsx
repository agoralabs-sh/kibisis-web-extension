import {
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@chakra-ui/react';
import React, { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkOutline } from 'react-icons/io5';

// components
import Button from '@extension/components/Button';
import CustomNodeSummaryModalContent from '@extension/components/CustomNodeSummaryModalContent';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// selectors
import { useSelectNetworks } from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { INetwork } from '@extension/types';
import type { IProps } from './types';

const ViewCustomNodeModal: FC<IProps> = ({ item, onClose }) => {
  const { t } = useTranslation();
  // selectors
  const networks = useSelectNetworks();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  // state
  const [network, setNetwork] = useState<INetwork | null>(null);
  // handlers
  const handleClose = () => {
    setNetwork(null);
    onClose && onClose();
  };
  const handleOKClick = () => handleClose();

  useEffect(() => {
    if (!item) {
      return;
    }

    setNetwork(
      networks.find((value) => value.genesisHash === item.genesisHash) || null
    );
  }, [item]);

  return (
    <Modal
      isOpen={!!item && !!network}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.customNode')}
          </Heading>
        </ModalHeader>

        <ModalBody display="flex" px={DEFAULT_GAP}>
          {item && network && (
            <CustomNodeSummaryModalContent item={item} network={network} />
          )}
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          {/*ok button*/}
          <Button
            onClick={handleOKClick}
            rightIcon={<IoCheckmarkOutline />}
            size="lg"
            variant="solid"
            w="full"
          >
            {t<string>('buttons.ok')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewCustomNodeModal;
