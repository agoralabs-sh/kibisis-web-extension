interface IResult {
  name: string | null;
  privateKey: Uint8Array;
}

type IAddAccountCompleteFunction = (result: IResult) => Promise<void>;

export default IAddAccountCompleteFunction;
