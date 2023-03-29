import { useSelector } from 'react-redux';

// Types
import { IMainRootState, ISettings } from '../types';

export default function useSelectSettings(): ISettings {
  return useSelector<IMainRootState, ISettings>((state) => ({
    network: state.settings.network,
  }));
}
