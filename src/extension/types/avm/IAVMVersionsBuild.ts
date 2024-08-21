interface IAVMVersionsBuild {
  branch: string;
  build_number: number;
  channel: string;
  commit_hash: string;
  major: number;
  minor: number;
}

export default IAVMVersionsBuild;
