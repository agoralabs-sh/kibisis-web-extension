interface IState {
  characterLimit?: number;
  error: string | null;
  label: string;
  required?: boolean;
  reset: () => void;
  setError: (value: string | null) => void;
  setValue: (value: string) => void;
  validate: () => string | null;
  value: string;
}

export default IState;
