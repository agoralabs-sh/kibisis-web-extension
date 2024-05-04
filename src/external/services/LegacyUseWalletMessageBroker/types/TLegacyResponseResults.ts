import { IDisableResult, IEnableResult } from '@agoralabs-sh/avm-web-provider';

// types
import type ILegacyDiscoverResult from './ILegacyDiscoverResult';

type TLegacyResponseResults =
  | IDisableResult
  | IEnableResult
  | ILegacyDiscoverResult;

export default TLegacyResponseResults;
