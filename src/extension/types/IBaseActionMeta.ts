interface IBaseActionMeta<
  Arg,
  RequestStatus = 'fulfilled' | 'pending' | 'rejected'
> {
  arg: Arg;
  requestId: string;
  requestStatus: RequestStatus;
}

export default IBaseActionMeta;
