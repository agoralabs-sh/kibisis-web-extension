import { SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { Web3WalletTypes } from '@walletconnect/web3wallet';
import { IWeb3Wallet } from '@walletconnect/web3wallet/dist/types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// Features
import { setSessionThunk } from '@extension/features/sessions';

// Selectors
import { useSelectLogger, useSelectWeb3Wallet } from '@extension/selectors';

// Types
import { ILogger } from '@common/types';
import { IAppThunkDispatch, INetwork } from '@extension/types';
import { IUseWalletConnectState } from './types';

// Utils
import { mapSessionFromWalletConnectSession } from '@extension/utils';
import { createSessionNamespaces } from './utils';

export default function useWalletConnect(
  uri: string | null
): IUseWalletConnectState {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const logger: ILogger = useSelectLogger();
  const web3Wallet: IWeb3Wallet | null = useSelectWeb3Wallet();
  // states
  const [pairing, setPairing] = useState<boolean>(false);
  const [sessionProposal, setSessionProposal] =
    useState<Web3WalletTypes.SessionProposal | null>(null);
  const approveSessionProposalAction: (
    authorizedAddresses: string[],
    network: INetwork
  ) => Promise<void> = async (
    authorizedAddresses: string[],
    network: INetwork
  ) => {
    let session: SessionTypes.Struct;

    if (web3Wallet && sessionProposal) {
      logger.debug(
        `${useWalletConnect.name}#${handleSessionProposal.name}(): approving session proposal "${sessionProposal.id}"`
      );

      session = await web3Wallet.approveSession({
        id: sessionProposal.id,
        namespaces: createSessionNamespaces({
          authorizedAddresses,
          network,
          proposalParams: sessionProposal.params,
        }),
      });

      // add the session to the store
      dispatch(
        setSessionThunk(
          mapSessionFromWalletConnectSession({
            authorizedAddresses,
            network,
            walletConnectSession: session,
          })
        )
      );

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
