interface IState {
  error: string | null;
  reset: () => void;
  setError: (value: string | null) => void;
  setValue: (value: string) => void;
  value: string;
}

export default IState;
