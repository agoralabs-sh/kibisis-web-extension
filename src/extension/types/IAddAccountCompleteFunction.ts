interface IResult {
  name: string | null;
  privateKey: Uint8Array;
}

type IAddAccountCompleteFunction = (result: IResult) => void;

export default IAddAccountCompleteFunction;
