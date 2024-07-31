/**
 * @property {boolean} active - whether the credential lock is activated or not.
 * @property {boolean} saving - whether the credential lock is being saved or not.
 */
interface IState {
  active: boolean;
  saving: boolean;
}

export default IState;
