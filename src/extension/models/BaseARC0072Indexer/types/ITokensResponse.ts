// types
import type ITokenResult from './ITokenResult';

interface ITokensResponse {
  currentRound: number;
  ['next-token']: number;
  tokens: ITokenResult[];
}

export default ITokensResponse;
