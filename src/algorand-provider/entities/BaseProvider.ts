import { Algodv2 } from 'algosdk';

// Types
import { INewBaseProviderOptions } from '../types';

export default abstract class BaseProvider {
  protected client: Algodv2;
  public id: string;

  constructor({ client, id }: INewBaseProviderOptions) {
    this.client = client;
    this.id = id;
  }

  public abstract signData(data: Uint8Array): Promise<Uint8Array>;
}
