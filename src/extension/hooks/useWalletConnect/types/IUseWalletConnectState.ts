import { Web3WalletTypes } from '@walletconnect/web3wallet';

interface IUseWalletConnectState {
  approveSessionProposalAction: (addresses: string[]) => Promise<void>;
  pairing: boolean;
  rejectSessionProposalAction: () => Promise<void>;
  sessionProposal: Web3WalletTypes.SessionProposal | null;
}

export default IUseWalletConnectState;
