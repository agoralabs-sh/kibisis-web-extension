interface IBlockExplorer {
  accountPath: string;
  applicationPath: string;
  assetPath: string;
  baseUrl: string;
  blockPath: string;
  canonicalName: string;
  groupPath: string | null;
  id: string;
  transactionPath: string;
}

export default IBlockExplorer;
