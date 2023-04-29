import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// Constants
import { NETWORK_CONNECTIVITY_CHECK_INTERVAL } from '@extension/constants';

// Features
import { setOnline } from '@extension/features/system';

// Types
import { IAppThunkDispatch } from '@extension/types';

export default function useOnNetworkConnectivity(): void {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const [checking, setChecking] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<number | undefined>();
  const determineNetworkStatus: () => Promise<void> = async () => {
    let result: Response;
    let url: string = 'https://developer.chrome.com';

    if (window.navigator.userAgent.includes('Firefox')) {
      url = 'https://developer.mozilla.org';
    }

    if (window.navigator.userAgent.includes('Edg')) {
      url = 'https://developer.microsoft.com';
    }

    if (window.navigator.userAgent.includes('Safari')) {
      url = 'https://developer.apple.com';
    }

    try {
      setChecking(true);

      result = await fetch(url);

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
