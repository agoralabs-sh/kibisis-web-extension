// types
import type IBaseActionMeta from './IBaseActionMeta';

type IPendingActionMeta<Arg> = IBaseActionMeta<Arg, 'pending'>;

export default IPendingActionMeta;
