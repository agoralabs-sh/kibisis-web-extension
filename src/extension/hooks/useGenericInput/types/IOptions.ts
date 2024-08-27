interface IOptions {
  characterLimit?: number;
  defaultValue?: string;
  label: string;
  required?: boolean;
  validate?: (value: string) => string | null;
}

export default IOptions;
