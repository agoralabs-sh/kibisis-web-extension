import { CreateToastFnReturn, useToast } from '@chakra-ui/react';

export default function useToastWithDefaultOptions(): CreateToastFnReturn {
  return useToast({
    containerStyle: {
      margin: '0',
      maxWidth: '100%',
      minWidth: '100%',
      padding: '0.5rem',
      width: '100%',
    },
    duration: 9000,
    position: 'top',
  });
}
