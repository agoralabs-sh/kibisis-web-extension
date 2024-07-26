// types
import type ITokenResponse from './ITokenResponse';

interface IResponse {
  currentRound: number;
  ['next-token']: number;
  tokens: ITokenResponse[];
}

export default IResponse;
