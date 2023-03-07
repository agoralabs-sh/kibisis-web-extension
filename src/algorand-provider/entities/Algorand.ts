// Entities
import BaseProvider from './BaseProvider';

// Errors
import { NoProvidersDetectedError } from '../errors';

// Types
import { IAddProviderOptions } from '../types';

export default class Algorand {
  private defaultProviderIndex: number = 0;
  private providers: BaseProvider[];

  constructor() {
    this.providers = [];
  }

  /**
   * Adds a provider, or if the `replace` option is set, will replace any existing providers matching by ID.
   * @param {BaseProvider} provider - the provider to add/replace.
   * @param {IAddProviderOptions} options - [optional] options that change the behavior when adding a provider.
   */
  public addProvider(
    provider: BaseProvider,
    options?: IAddProviderOptions
  ): void {
    const existingProvider: BaseProvider | null = this.getProvider(provider.id);

    // if no provider exists, just add it
    if (!existingProvider) {
      this.providers.push(provider);
    }

    if (existingProvider && options?.replace) {
      this.providers = this.providers.map((value) =>
        value.id === provider.id ? provider : value
      );
    }

    if (options?.makeDefault) {
      this.setDefaultProvider(provider.id);
    }
  }

  /**
   * Gets the default provider.
   * @returns {BaseProvider | null} the default provider or null if no providers exist.
   */
  public getDefaultProvider(): BaseProvider | null {
    if (this.providers.length <= 0) {
      return null;
    }

    // if the default provider index is out of bounds, reset to 0.
    if (this.defaultProviderIndex > this.providers.length - 1) {
      this.defaultProviderIndex = 0;
    }

    return this.providers[this.defaultProviderIndex] || null;
  }

  /**
   * Gets the provider as specified by its ID.
   * @param {string} id - the ID of the provider.
   * @returns {BaseProvider | null} the provider if it exists, null otherwise.
   */
  public getProvider(id: string): BaseProvider | null {
    return this.providers.find((value) => value.id === id) || null;
  }

  /**
   * Gets all the providers.
   * @returns {BaseProvider[]} gets all teh providers.
   */
  public getProviders(): BaseProvider[] {
    return this.providers;
  }

  /**
   * Sets the default provider by ID. If the provider does not exist, the default provider is not changed.
   * @param {string} id - the ID of the provider to set to default.
   */
  public setDefaultProvider(id: string): void {
    const index: number = this.providers.findIndex((value) => value.id === id);

    this.defaultProviderIndex = index < 0 ? this.defaultProviderIndex : index;
  }

  public async signData(data: Uint8Array): Promise<Uint8Array> {
    const provider: BaseProvider | null = this.getDefaultProvider();

    if (!provider) {
      throw new NoProvidersDetectedError('no providers detected');
    }

    return provider.signData(data);
  }
}
