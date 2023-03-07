/**
 * @property {boolean} makeDefault - [optional] sets the added/replaced provider as the default provider. Defaults to false.
 * @property {boolean} replace - [optional] determines whether a matching provider, by ID, should be replaced
 * with this one. Defaults to false.
 */
interface IAddProviderOptions {
  makeDefault?: boolean;
  replace?: boolean;
}

export default IAddProviderOptions;
