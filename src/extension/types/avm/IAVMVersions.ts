// types
import type IAVMVersionsBuild from './IAVMVersionsBuild';

interface IAVMVersions {
  versions: string[];
  genesis_id: string;
  genesis_hash_b64: string;
  build: IAVMVersionsBuild;
}

export default IAVMVersions;
