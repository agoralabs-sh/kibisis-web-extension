// repositories
import PasswordTagRepository from '@extension/repositories/PasswordTagRepository';

interface INewOptions {
  passwordTag: string;
  passwordTagRepository?: PasswordTagRepository;
}

export default INewOptions;
