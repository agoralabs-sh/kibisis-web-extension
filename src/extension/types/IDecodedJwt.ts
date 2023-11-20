// types
import IDecodedJwtHeader from './IDecodedJwtHeader';
import IDecodedJwtPayload from './IDecodedJwtPayload';

interface IDecodedJwt {
  header: IDecodedJwtHeader;
  payload: IDecodedJwtPayload;
}

export default IDecodedJwt;
