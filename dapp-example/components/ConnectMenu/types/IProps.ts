import type { CreateToastFnReturn } from '@chakra-ui/react';

// types
import type IOnConnectParams from './IOnConnectParams';

interface IProps {
  onConnect: (params: IOnConnectParams) => void;
  onDisconnect: () => void;
  toast: CreateToastFnReturn;
}

export default IProps;
