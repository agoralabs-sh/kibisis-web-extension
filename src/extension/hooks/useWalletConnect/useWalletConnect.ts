import { SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { Web3WalletTypes } from '@walletconnect/web3wallet';
import { IWeb3Wallet } from '@walletconnect/web3wallet/dist/types';
import { useEffect, useState } from 'react';

// Selectors
import { useSelectLogger, useSelectWeb3Wallet } from '@extension/selectors';

// Types
import { ILogger } from '@common/types';
import { IUseWalletConnectState } from './types';

// Utils
import { createSessionNamespaces } from './utils';

export default function useWalletConnect(
  uri: string | null
): IUseWalletConnectState {
  // selectors
  const logger: ILogger = useSelectLogger();
  const web3Wallet: IWeb3Wallet | null = useSelectWeb3Wallet();
  // states
  const [pairing, setPairing] = useState<boolean>(false);
  const [sessionProposal, setSessionProposal] =
    useState<Web3WalletTypes.SessionProposal | null>(null);
  const approveSessionProposalAction: (
    addresses: string[]
  ) => Promise<void> = async (addresses: string[]) => {
    let session: SessionTypes.Struct;

    if (web3Wallet && sessionProposal) {
      logger.debug(
        `${useWalletConnect.name}#${handleSessionProposal.name}(): approving session proposal "${sessionProposal.id}"`
      );

      session = await web3Wallet.approveSession({
        id: sessionProposal.id,
        namespaces: createSessionNamespaces({
          addresses,
          proposalParams: sessionProposal.params,
        }),
      });

      // TODO: add session to sessions

      console.log(JSON.stringify(session));
      console.log(JSON.stringify(sessionProposal));

      // clean up
      setPairing(false);
      setSessionProposal(null);
    }
  };
  const handleSessionProposal: (
    proposal: Web3WalletTypes.SessionProposal
  ) => void = (proposal: Web3WalletTypes.SessionProposal) => {
    logger.debug(
      `${useWalletConnect.name}#${handleSessionProposal.name}(): received session proposal "${proposal.id}"`
    );

    setSessionProposal(proposal);
    setPairing(false);
  };
  const rejectSessionProposalAction: () => Promise<void> = async () => {
    if (web3Wallet && sessionProposal) {
      logger.debug(
        `${useWalletConnect.name}#${rejectSessionProposalAction.name}(): rejecting session proposal "${sessionProposal.id}"`
      );

      await web3Wallet.rejectSession({
        id: sessionProposal.id,
        reason: getSdkError('USER_REJECTED'),
      });

      // clean up
      setPairing(false);
      setSessionProposal(null);
    }
  };

  useEffect(() => {
    if (web3Wallet && uri) {
      (async () => {
        web3Wallet.on('session_proposal', handleSessionProposal);

        setPairing(true);

        await web3Wallet.core.pairing.pair({
          uri,
        });
      })();
    }

    return function cleanup() {
      if (web3Wallet) {
        web3Wallet.removeListener('session_proposal', handleSessionProposal);
      }
    };
  }, [uri]);

  return {
    approveSessionProposalAction,
    pairing,
    rejectSessionProposalAction,
    sessionProposal,
  };
}
