interface IResourceLanguage {
  buttons: Record<string, string>;
  captions: Record<string, string>;
  errors: {
    descriptions: Record<string, string>;
    titles: Record<string, string>;
  };
  headings: Record<string, string>;
  labels: Record<string, string>;
  placeholders: Record<string, string>;
  titles: Record<string, string>;
}

export default IResourceLanguage;
