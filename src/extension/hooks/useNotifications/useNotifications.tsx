import { useToast } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// components
import Toast from '@extension/components/Toast';

// constants
import { DEFAULT_NOTIFICATION_DURATION } from '@extension/constants';

// features
import {
  closeById,
  removeById,
  setShowingById,
} from '@extension/features/notifications';

// hooks
import { useSelectNotShowingNotifications } from '@extension/selectors';

// types
import type { IAppThunkDispatch, INotification } from '@extension/types';

export default function useNotifications(): void {
  const dispatch = useDispatch<IAppThunkDispatch>();
  const toast = useToast({
    containerStyle: {
      margin: '0',
      maxWidth: '100%',
      minWidth: '100%',
      padding: '0.5rem',
      width: '100%',
    },
    duration: DEFAULT_NOTIFICATION_DURATION,
    isClosable: true,
    position: 'top',
  });
  // selectors
  const newNotifications: INotification[] = useSelectNotShowingNotifications();

  useEffect(() => {
    newNotifications.forEach(({ ephemeral, description, id, title, type }) => {
      dispatch(setShowingById(id));
      toast({
        onCloseComplete: () =>
          ephemeral ? dispatch(removeById(id)) : dispatch(closeById(id)),
        render: ({ onClose }) => (
          <Toast
            description={description || undefined}
            title={title}
            onClose={onClose}
            type={type}
          />
        ),
      });
    });
  }, [newNotifications]);
}
