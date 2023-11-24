import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// constants
import { NETWORK_CONNECTIVITY_CHECK_INTERVAL } from '@extension/constants';

// features
import { setOnline } from '@extension/features/system';

// types
import { IAppThunkDispatch } from '@extension/types';

export default function useOnNetworkConnectivity(): void {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const [checking, setChecking] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<number | undefined>();
  const determineNetworkStatus: () => Promise<void> = async () => {
    let result: Response;
    let url: string = 'https://developer.chrome.com';

    switch (__TARGET__) {
      case 'edge':
        url = 'https://developer.microsoft.com';
        break;
      case 'firefox':
        url = 'https://developer.mozilla.org';
        break;
      case 'opera':
        url = 'https://dev.opera.com';
        break;
      case 'safari':
        url = 'https://developer.apple.com';
        break;
      case 'chrome':
      default:
        break;
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
