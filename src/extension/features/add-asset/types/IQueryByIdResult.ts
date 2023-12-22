// types
import { IArc200Asset } from '@extension/types';
import IAssetsWithNextToken from './IAssetsWithNextToken';

/**
 * @property {IAssetsWithNextToken<IArc200Asset>} arc200Assets - a list of ARC200 assets, which application IDs match the supplied ID.
 */
interface IQueryByIdResult {
  arc200Assets: IAssetsWithNextToken<IArc200Asset>;
}

export default IQueryByIdResult;
