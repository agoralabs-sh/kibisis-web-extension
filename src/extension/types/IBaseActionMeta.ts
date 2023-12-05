interface IBaseActionMeta<
  RequestStatus = 'fulfilled' | 'pending' | 'rejected'
> {
  arg: string;
  requestId: string;
  requestStatus: RequestStatus;
}

export default IBaseActionMeta;
