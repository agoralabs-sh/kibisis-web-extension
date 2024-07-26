// types
import IPRFExtensionOutput from './IPRFExtensionOutput';

interface IAuthenticationExtensionsClientOutputs
  extends AuthenticationExtensionsClientOutputs {
  prf?: IPRFExtensionOutput;
}

export default IAuthenticationExtensionsClientOutputs;
