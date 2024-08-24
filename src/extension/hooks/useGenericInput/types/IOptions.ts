interface IOptions {
  characterLimit?: number;
  label: string;
  required?: boolean;
  validate?: (value: string) => string | null;
}

export default IOptions;
