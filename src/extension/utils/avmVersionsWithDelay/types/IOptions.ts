import type { Algodv2 } from 'algosdk';

interface IOptions {
  client: Algodv2;
  delay?: number;
}

export default IOptions;
