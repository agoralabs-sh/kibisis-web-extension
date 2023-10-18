import { Web3WalletTypes } from '@walletconnect/web3wallet';
import { INetwork } from '@extension/types';

interface IUseWalletConnectState {
  approveSessionProposalAction: (
    authorizedAddresses: string[],
    network: INetwork
  ) => Promise<void>;
  pairing: boolean;
  rejectSessionProposalAction: () => Promise<void>;
  sessionProposal: Web3WalletTypes.SessionProposal | null;
}

export default IUseWalletConnectState;
