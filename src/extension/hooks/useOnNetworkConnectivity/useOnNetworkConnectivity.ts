import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// constants
import { NETWORK_CONNECTIVITY_CHECK_INTERVAL } from '@extension/constants';

// features
import { setOnline } from '@extension/features/system';

// selectors
import { useSelectSelectedNetwork } from '@extension/selectors';

// types
import type { IAppThunkDispatch, INode } from '@extension/types';

// utils
import getRandomItem from '@common/utils/getRandomItem';

export default function useOnNetworkConnectivity(): void {
  const dispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const network = useSelectSelectedNetwork();
  // states
  const [checking, setChecking] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<number | undefined>();
  // misc
  const determineNetworkStatus: () => Promise<void> = async () => {
    let result: Response;

    if (!network) {
      dispatch(setOnline(false));

      return;
    }

    try {
      setChecking(true);

      // use a random node
      result = await fetch(
        `${getRandomItem<INode>(network.algods).url}/versions`
      );

      dispatch(setOnline(result.status >= 200 && result.status < 300));
    } catch (error) {
      dispatch(setOnline(false));
    }

    setChecking(false);
  };

  useEffect(() => {
    (async () => await determineNetworkStatus())();

    setIntervalId(
      window.setInterval(async () => {
        if (!checking) {
          await determineNetworkStatus();
        }
      }, NETWORK_CONNECTIVITY_CHECK_INTERVAL)
    );

    return function cleanup() {
      window.clearInterval(intervalId);
    };
  }, []);
}
