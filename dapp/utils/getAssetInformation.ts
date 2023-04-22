import { Algodv2, IntDecoding } from 'algosdk';
import BigNumber from 'bignumber.js';

// Types
import { IAlgorandAccountInformation, IAlgorandAsset } from '@extension/types';
import { IAssetInformation } from '../types';

export default async function getAssetInformation(
  address: string
): Promise<IAssetInformation[]> {
  const client: Algodv2 = new Algodv2(
    '',
    'https://testnet-api.algonode.cloud',
    ''
  );
  const accountInformation: IAlgorandAccountInformation = (await client
    .accountInformation(address)
    .setIntDecoding(IntDecoding.BIGINT)
    .do()) as IAlgorandAccountInformation;
  const assets: IAssetInformation[] = await Promise.all(
    accountInformation.assets.map<Promise<IAssetInformation>>(
      (value, index) =>
        new Promise((resolve, reject) =>
          setTimeout(async () => {
            let assetInformation: IAlgorandAsset;

            try {
              assetInformation = (await client
                .getAssetByID(Number(value['asset-id']))
                .setIntDecoding(IntDecoding.BIGINT)
                .do()) as IAlgorandAsset;

              resolve({
                balance: new BigNumber(String(value.amount)),
                decimals: Number(assetInformation.params.decimals),
                id: String(assetInformation.index),
                name: assetInformation.params.name || null,
                symbol: assetInformation.params['unit-name'] || null,
              });
            } catch (error) {
              reject(error);
            }
          }, 100 + index)
        )
    )
  );

  return [
    {
      balance: new BigNumber(String(accountInformation.amount)),
      decimals: 6,
      id: '0',
      name: 'Algorand',
      symbol: 'ALGO',
    },
    ...assets,
  ];
}
