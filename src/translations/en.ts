// Types
import { IResourceLanguage } from '../types';

const translation: IResourceLanguage = {
  buttons: {
    create: 'Create',
    getStarted: 'Get Started',
    import: 'Import',
    previous: 'Previous',
  },
  captions: {
    createPassword1: `First, let's create a new password to secure this device.`,
    createPassword2:
      'This password will be used to encrypt your private keys, so make it strong!',
    importAccount: `Add your mnemonic phrase to import your account.`,
    passwordScoreInfo:
      'To conform with our Strong Password policy, you are required to use a sufficiently strong password. Password must be more at least 8 characters.',
  },
  errors: {
    descriptions: {
      code: `Something has gone wrong.`,
      code_2000: 'The password seems to be invalid.',
    },
    inputs: {
      passwordMinLength: 'Must be at least 8 characters',
      passwordTooWeak: 'This password is too weak',
      required: '{{name}} is required',
    },
    titles: {
      code: 'Well this is embarrassing...',
      code_2000: 'Invalid password',
    },
  },
  headings: {
    createPassword: 'Secure your device',
    importAccount: 'Import your account',
  },
  labels: {
    password: 'Password',
  },
  placeholders: {
    enterPassword: 'Enter password',
  },
  titles: {
    page: '',
    page_getStarted: 'Get Started',
  },
};

export default translation;
