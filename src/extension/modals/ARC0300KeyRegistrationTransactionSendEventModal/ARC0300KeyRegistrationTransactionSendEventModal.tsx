import { Modal } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// components
import ARC0300KeyRegistrationTransactionSendModalContent, {
  ARC0300KeyRegistrationTransactionSendModalContentSkeleton,
} from '@extension/components/ARC0300KeyRegistrationTransactionSendModalContent';

// enums
import { EventTypeEnum } from '@extension/enums';

// features
import { removeEventByIdThunk } from '@extension/features/events';

// selectors
import { useSelectEvents } from '@extension/selectors';

// types
import type {
  IAppThunkDispatch,
  IARC0300KeyRegistrationTransactionSendEvent,
  IModalProps,
} from '@extension/types';

const ARC0300KeyRegistrationTransactionSendEventModal: FC<IModalProps> = ({
  onClose,
}) => {
  const dispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const events = useSelectEvents();
  // state
  const [event, setEvent] =
    useState<IARC0300KeyRegistrationTransactionSendEvent | null>(null);
  // handlers
  const handleClose = async () => {
    if (event) {
      // remove the event
      await dispatch(removeEventByIdThunk(event.id)).unwrap();
    }

    onClose && onClose();
  };

  useEffect(() => {
    setEvent(
      (events.find(
        (value) =>
          value.type === EventTypeEnum.ARC0300KeyRegistrationTransactionSend
      ) as IARC0300KeyRegistrationTransactionSendEvent) || null
    );
  }, [events]);

  return (
    <Modal
      isOpen={!!event}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      {event ? (
        <ARC0300KeyRegistrationTransactionSendModalContent
          onComplete={handleClose}
          onPreviousClick={handleClose}
          schema={event.payload}
        />
      ) : (
        <ARC0300KeyRegistrationTransactionSendModalContentSkeleton />
      )}
    </Modal>
  );
};

export default ARC0300KeyRegistrationTransactionSendEventModal;
