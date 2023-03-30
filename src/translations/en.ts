// Types
import { IResourceLanguage } from '../types';

const translation: IResourceLanguage = {
  buttons: {
    addAccount: 'Add Account',
    cancel: 'Cancel',
    connect: 'Connect',
    create: 'Create',
    getStarted: 'Get Started',
    import: 'Import',
    next: 'Next',
    ok: 'OK',
    previous: 'Previous',
  },
  captions: {
    addressCopied: 'Address copied!',
    allowBetaNet: 'Let BetaNet networks appear in the networks list.',
    allowTestNet: 'Let TestNet networks appear in the networks list.',
    connectRequest:
      'An application is requesting to connect. Select which accounts you would like to enable:',
    copied: 'Copied!',
    createPassword1: `First, let's create a new password to secure this device.`,
    createPassword2:
      'This password will be used to encrypt your private keys, so make it strong!',
    importAccount: `Add your mnemonic phrase to import your account.`,
    minimumBalance: `Minimum balance is {{amount}} algo. Based on the account configuration, this is the minimum balance needed to keep the account open.`,
    nameAccount: `Give your account a nickname. Don't worry you can change this later on.`,
    passwordScoreInfo:
      'To conform with our Strong Password policy, you are required to use a sufficiently strong password. Password must be at least 8 characters.',
    support:
      'Please <2>contact us</2> for further assistance so we can resolve this issue for you.',
  },
  errors: {
    descriptions: {
      code: `Something has gone wrong.`,
      code_2000: 'The password seems to be invalid.',
    },
    inputs: {
      invalidMnemonic: 'Invalid mnemonic phrase',
      passwordMinLength: 'Must be at least 8 characters',
      passwordTooWeak: 'This password is too weak',
      required: '{{name}} is required',
      unknown: `Something doesn't look right`,
    },
    titles: {
      code: 'Well this is embarrassing...',
      code_2000: 'Invalid password',
    },
  },
  headings: {
    beta: 'Beta',
    createPassword: 'Secure your device',
    developer: 'Developer',
    importAccount: 'Import your account',
    qrCode: 'QR Code',
    nameAccount: 'Name your account',
    noAccountsFound: 'No accounts found!',
  },
  labels: {
    accountName: 'Account Name',
    addAccount: 'Add Account',
    allowBetaNet: 'Allow BetaNet networks?',
    allowTestNet: 'Allow TestNet networks?',
    balance: 'Balance',
    mnemonicPhrase: 'Mnemonic Phrase',
    password: 'Password',
    settings: 'Settings',
    unknownApp: 'Unknown App',
    unknownHost: 'unknown host',
  },
  placeholders: {
    enterPassword: 'Enter password',
    nameAccount: 'Enter a name for this account (optional)',
  },
  titles: {
    page: '',
    page_advanced: 'Advanced',
    page_settings: 'Settings',
  },
};

export default translation;
