// types
import type IBaseActionMeta from './IBaseActionMeta';

type IFulfilledActionMeta<Arg> = IBaseActionMeta<Arg, 'fulfilled'>;

export default IFulfilledActionMeta;
