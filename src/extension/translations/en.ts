// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import { IResourceLanguage } from '@extension/types';

const translation: IResourceLanguage = {
  buttons: {
    addAccount: 'Add Account',
    addAsset: 'Add Asset',
    allow: 'Allow',
    approve: 'Approve',
    cancel: 'Cancel',
    changePassword: 'Change Password',
    clearAllData: 'Clear All Data',
    confirm: 'Confirm',
    connect: 'Connect',
    copySeedPhrase: 'Copy Seed Phrase',
    create: 'Create',
    dismiss: 'Dismiss',
    download: 'Download',
    getStarted: 'Get Started',
    import: 'Import',
    next: 'Next',
    ok: 'OK',
    previous: 'Previous',
    receive: 'Receive',
    reject: 'Reject',
    removeAllSessions: 'Remove All Sessions',
    save: 'Save',
    send: 'Send',
    sign: 'Sign',
  },
  captions: {
    addAsset:
      'Enter an asset ID, name, symbol or application ID (for ARC-200).',
    addressDoesNotMatch: 'This address does not match the signer',
    allowBetaNet: 'Let BetaNet networks appear in the networks list.',
    allowDidTokenFormat:
      'The DID token format "did:algo:<public_address>" will be an option when sharing an address.',
    allowMainNet: 'Let MainNet networks appear in the networks list.',
    allowMainNetConfirm: 'Are you sure you want to allow MainNet networks?',
    allowMainNetWarning:
      'Kibisis is still in the early development so allow MainNet networks at your own risk!',
    applicationIdCopied: 'Application ID copied!',
    appOnComplete: 'This transaction will run the application.',
    [`appOnComplete_${TransactionTypeEnum.ApplicationClearState}`]: `This transaction will clear any application data associated with the sender's account.`,
    [`appOnComplete_${TransactionTypeEnum.ApplicationCloseOut}`]: `This transaction will run the application and clear any application data associated with the sender's account.`,
    [`appOnComplete_${TransactionTypeEnum.ApplicationCreate}`]:
      'This transaction will create a new application.',
    [`appOnComplete_${TransactionTypeEnum.ApplicationDelete}`]:
      'This transaction will delete the application.',
    [`appOnComplete_${TransactionTypeEnum.ApplicationOptIn}`]: `This transaction will opt the sender's account into the application by allocating some local state.`,
    [`appOnComplete_${TransactionTypeEnum.ApplicationUpdate}`]:
      'This transaction will update the application, replacing the approval and clear programs. The application ID will not be changed.',
    audienceDoesNotMatch:
      'The intended recipient of this token, does not match the host',
    changePassword1: 'Enter your new password.',
    changePassword2:
      'You will be prompted to enter your current password when you press "Change Password".',
    changeTheme: 'Choose between dark and light mode.',
    clearAllData: 'Are you sure you want to clear all your data?',
    clearAllDataWarning:
      'Once this has been completed, it cannot be reversed. All your settings and accounts will be removed',
    confirmingTransaction: 'Please wait, the transaction is being processed.',
    connectingToWalletConnect: 'Attempting to connect to WalletConnect.',
    copied: 'Copied!',
    createNewAccount:
      'Create a new account. You will be prompted to save a mnemonic seed phrase.',
    createPassword1: `First, let's create a new password to secure this device.`,
    createPassword2:
      'This password will be used to encrypt your private keys, so make it strong!',
    defaultConfirm: 'Are you sure?',
    deleteApplication: 'Be careful, deleting an application is irreversible!',
    destroyAsset: 'Be careful, destroying an asset is irreversible!',
    enableRequest:
      'An application is requesting to connect. Select which accounts you would like to enable:',
    enterSeedPhrase: `Add your seed phrase to import your account.`,
    freezeManagerAddressDoesNotMatch:
      'This account does not have the authority to freeze/unfreeze this asset. This transaction will likely fail.',
    groupIdCopied: 'Group ID copied!',
    hideAssetConfirm:
      'Are you sure you want to hide {{symbol}}? You can re-add it back to your asset holdings again.',
    importExistingAccount: `Import an existing account using you mnemonic seed phrase.`,
    importExistingAccountComplete: `To finalize we will encrypt your account keys with your password and you will be able to start using this account.`,
    importRekeyedAccount: `Import an existing account that has been rekeyed. You will need the mnemonic seed phrase of the authorized account and the address of the rekeyed account.`,
    initializingWalletConnect:
      'Putting the final touches into your WalletConnect interface.',
    invalidAlgorithm: `The suggested signing method does not match the method that will be used to sign this token`,
    debugLogging:
      'Debugging information will be output to the extension console.',
    managerAddressDoesNotMatch:
      'This account does not have the authority to alter this asset. This transaction will likely fail.',
    maximumNativeCurrencyTransactionAmount:
      'The maximum {{nativeCurrencyCode}} amount is calculated by: the balance ({{balance}}), minus the minimum balance needed to keep the account open ({{minBalance}}), minus the minimum transaction fee ({{minFee}})',
    minimumBalance: `Minimum balance is {{amount}} {{code}}. Based on the account configuration, this is the minimum balance needed to keep the account open.`,
    mustEnterPasswordToAuthorizeOptIn:
      'You must enter your password to authorize an opt-in transaction.',
    mustEnterPasswordToConfirm: 'You must enter your password to confirm.',
    mustEnterPasswordToSign: 'Enter your password to sign.',
    mustEnterPasswordToSignSecurityToken:
      'Enter your password to sign this security token.',
    mustEnterPasswordToSignTransaction:
      'Enter your password to sign this transaction.',
    mustEnterPasswordToSignTransactions:
      'Enter your password to sign these transactions.',
    mustEnterPasswordToSendTransaction:
      'You must enter your password to send transaction.',
    nameYourAccount: `Give your account a nickname. Don't worry you can change this later on.`,
    newAccountComplete:
      'We are almost done. Before we safely secure your new account on this device, we just need you to confirm you have copied your seed phrase.',
    noAccountsFound:
      'You can create a new account or import an existing account.',
    noAssetsFound: 'You have not added any assets. Try adding one now.',
    noBlockExplorersAvailable: 'No block explorers available',
    noSessionsFound: 'Enabled dApps will appear here.',
    noThemesAvailable: 'No themes available',
    offline: 'It looks like you are offline, some features may not work',
    openOn: 'Open on {{name}}',
    openUrl: 'Open URL in your browser',
    optInFee:
      'Standard assets require an "opt-in" fee. This is a transaction of the asset with a "0" amount sent to yourself.',
    passwordScoreInfo:
      'To conform with our <2>Strong Password Policy</2>, you are required to use a sufficiently strong password. Password must be at least 8 characters.',
    preferredBlockExplorer: 'Used when opening chain information in new tabs.',
    removeAccount: 'Are you sure you want to remove account "{{address}}"?',
    removeAccountWarning:
      'To add this account back you will need the seed phrase',
    removeAllSessions: 'Are you sure you want to remove all sessions?',
    removeAllAccountsWarning:
      'Removing all accounts will also remove this session',
    saveMnemonicPhrase1:
      'Here is your 25 word mnemonic seed phrase; it is the key to your account.',
    saveMnemonicPhrase2: `Make sure you save this in a secure place.`,
    scanningForQrCode:
      'Scanning for a WalletConnect QR Code. Make sure the WalletConnect QR code is visible in the background.',
    securityTokenExpired: 'This token has expired',
    signJwtRequest: 'An application is requesting to sign a security token.',
    signMessageRequest: 'An application is requesting to sign a message.',
    signTransactionRequest:
      'An application is requesting to sign a transaction.',
    signTransactionsRequest:
      'An application is requesting to sign multiple transactions.',
    standardAssetOptIn:
      'Please wait while we confirm the adding asset {{asset}} with the network.',
    support:
      'Please <2>contact us</2> for further assistance so we can resolve this issue for you.',
    transactionIdCopied: 'Transaction ID copied!',
    transactionSendSuccessful:
      'Transaction "{{transactionId}}" was successfully sent.',
    updatingAssetInformation: 'Updating asset information',
  },
  errors: {
    descriptions: {
      code: `Something has gone wrong.`,
      code_2000: 'The password seems to be invalid.',
    },
    inputs: {
      copySeedPhraseRequired:
        'You must confirm you have copied the seed phrase',
      invalidAddress: 'Invalid address',
      invalidMnemonic: 'Invalid seed phrase',
      invalidPassword: 'Invalid password',
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
    addAsset: 'Add Asset',
    addedAsset: 'Added Asset {{symbol}}!',
    allowMainNetConfirm: 'Allow MainNet Networks',
    authentication: 'Authentication',
    beta: 'Beta',
    clearAllData: 'Clear All Data',
    comingSoon: 'Coming Soon!',
    confirm: 'Confirm',
    createNewAccount: 'Create A New Account',
    dangerZone: 'Danger Zone',
    developer: 'Developer',
    enterYourSeedPhrase: 'Enter your seed phrase',
    generateSeedPhrase: 'Generate seed phrase',
    hideAssetConfirm: 'Hide {{symbol}}',
    importExistingAccount: 'Import An Existing Account',
    importExistingAccountComplete: 'Almost There...',
    importRekeyedAccount: 'Import A Rekeyed Account',
    nameYourAccount: 'Name your account',
    network: 'Network',
    newAccountComplete: 'Almost There...',
    noAccountsFound: 'No accounts found',
    noAssetsFound: 'No assets found',
    noTransactionsFound: 'No transactions found',
    noSessionsFound: 'No sessions found',
    offline: 'Offline',
    removeAccount: 'Remove Account',
    removeAllSessions: 'Remove All Sessions',
    sendAsset: 'Send {{asset}}',
    shareAddress: 'Share Address',
    transaction: 'Unknown Transaction 💀',
    [`transaction_${TransactionTypeEnum.ApplicationClearState}`]:
      'Application Interaction ⚙️',
    [`transaction_${TransactionTypeEnum.ApplicationCloseOut}`]:
      'Application Interaction ⚙️',
    [`transaction_${TransactionTypeEnum.ApplicationCreate}`]:
      'Application Creation ✨',
    [`transaction_${TransactionTypeEnum.ApplicationDelete}`]:
      'Application Deletion 💥',
    [`transaction_${TransactionTypeEnum.ApplicationNoOp}`]:
      'Application Interaction ⚙️',
    [`transaction_${TransactionTypeEnum.ApplicationOptIn}`]:
      'Application Opt-In 🎟️',
    [`transaction_${TransactionTypeEnum.ApplicationUpdate}`]:
      'Application Update 🛠️',
    [`transaction_${TransactionTypeEnum.AssetConfig}`]:
      'Asset Re-configuration 🛠️',
    [`transaction_${TransactionTypeEnum.AssetCreate}`]: 'Asset Creation ✨',
    [`transaction_${TransactionTypeEnum.AssetDestroy}`]: 'Asset Destruction 💥',
    [`transaction_${TransactionTypeEnum.AssetFreeze}`]: 'Asset Freeze 🧊',
    [`transaction_${TransactionTypeEnum.AssetOptIn}`]: 'Asset Op-In 🎟️',
    [`transaction_${TransactionTypeEnum.AssetTransfer}`]: 'Asset Transfer 🪙',
    [`transaction_${TransactionTypeEnum.AssetUnfreeze}`]: 'Asset Unfreeze 🚀',
    [`transaction_${TransactionTypeEnum.KeyRegistrationOffline}`]:
      'Offline Key Registration 🔑',
    [`transaction_${TransactionTypeEnum.KeyRegistrationOnline}`]:
      'Online Key Registration 🔑',
    [`transaction_${TransactionTypeEnum.Payment}`]: 'Payment 💸',
    transactionSuccessful: 'Transaction Successful!',
  },
  labels: {
    activity: 'Activity',
    address: 'Address',
    addressToSign: 'Address To Sign',
    accountName: 'Account Name',
    accountToFreeze: 'Account To Freeze',
    accountToUnfreeze: 'Account To Unfreeze',
    addAccount: 'Add Account',
    allowBetaNet: 'Allow BetaNet networks?',
    allowDidTokenFormat: 'Allow DID token format in address sharing?',
    allowMainNet: 'Allow MainNet networks?',
    amount: 'Amount',
    applicationId: 'Application ID',
    asset: 'Asset',
    assetId: 'Asset ID',
    assets: 'Assets',
    audience: 'Audience',
    authorizedAccounts: 'Authorized Accounts',
    authorizedAddresses: 'Authorized Addresses',
    balance: 'Balance',
    clawbackAccount: 'Clawback Account',
    connectWallet: 'Connect Wallet',
    copyAddress: 'Copy Address',
    copyApplicationId: 'Copy Application ID',
    copyAssetId: 'Copy Asset ID',
    copyGroupId: 'Copy Group ID',
    copySeedPhraseConfirm:
      'I confirm I have copied my seed phrase to a secure place.',
    copyTransactionId: 'Copy Transaction ID',
    copyValue: 'Copy {{value}}',
    creatorAccount: 'Creator Account',
    dark: 'Dark',
    date: 'Date',
    decimals: 'Decimals',
    default: 'Default',
    defaultFrozen: 'Default Frozen',
    did: 'DID',
    editAccountName: 'Rename account',
    expirationDate: 'Expiration Date',
    extensionId: 'Extension ID',
    fee: 'Fee',
    firstRound: 'First Round',
    freezeAccount: 'Freeze Account',
    freezeAccountBalance: 'Freeze Account Balance',
    freezeManagerAccount: 'Freeze Manager Account',
    frozenAccountBalance: 'Frozen Account Balance',
    from: 'From',
    groupId: 'Group ID',
    hideAsset: 'Hide Asset',
    id: 'ID',
    information: 'Information',
    innerTransactions: 'Inner Transactions',
    issueDate: 'Issue Date',
    issuer: 'Issuer',
    lastRound: 'Last Round',
    light: 'Light',
    debugLogging: 'Debug Logging',
    nfts: 'NFTs',
    note: 'Note',
    noteOptional: 'Note (optional)',
    managerAccount: 'Manager Account',
    manageAccounts: 'Manage Accounts',
    max: 'Max',
    message: 'Message',
    moreInformation: 'More Information',
    name: 'Name',
    newPassword: 'New Password',
    no: 'No',
    password: 'Password',
    preferredBlockExplorer: 'Preferred Block Explorer',
    removeAccount: 'Remove Account',
    removeSession: 'Remove Session',
    reserveAccount: 'Reserve Account',
    seedPhrase: 'Seed Phrase',
    selectionKey: 'VRF Public Key',
    sendAsset: 'Send {{nativeCurrency}}/Asset',
    settings: 'Settings',
    shareAddress: 'Share Address',
    signingMethod: 'Signing Method',
    stateProofKey: 'State Proof Public Key',
    theme: 'Theme',
    to: 'To',
    totalSupply: 'Total Supply',
    type: 'Type',
    unitName: 'Unit Name',
    unknownApp: 'Unknown App',
    unknownHost: 'unknown host',
    url: 'URL',
    version: 'Version',
    voteKey: 'Participation Public Key',
    voteKeyDilution: 'Key Dilution',
    yes: 'Yes',
  },
  placeholders: {
    enterAddress: 'Enter address',
    enterANameForYourAccount: 'Enter a name for your account',
    enterNote: 'Enter an optional note',
    enterPassword: 'Enter password',
    nameAccount: 'Enter a name for this account (optional)',
  },
  titles: {
    strongPasswordPolicy: 'Strong Password Policy',
    page: '',
    page_about: 'About',
    page_accountSetup: 'Choose How To Add An Account',
    page_advanced: 'Advanced',
    page_appearance: 'Appearance',
    page_changePassword: 'Change Password',
    page_createNewAccount: 'Create A New Account',
    page_createPassword: 'Secure Your Device',
    page_general: 'General',
    page_importExistingAccount: 'Import An Existing Account',
    page_importRekeyedAccount: 'Import A Rekeyed Account',
    page_security: 'Security',
    page_sessions: 'Sessions',
    page_settings: 'Settings',
  },
  values: {
    appOnComplete: 'Application Operation',
    [`appOnComplete_${TransactionTypeEnum.ApplicationClearState}`]:
      'Clear State',
    [`appOnComplete_${TransactionTypeEnum.ApplicationCloseOut}`]: 'Close Out',
    [`appOnComplete_${TransactionTypeEnum.ApplicationCreate}`]:
      'Create Application',
    [`appOnComplete_${TransactionTypeEnum.ApplicationDelete}`]:
      'Delete Application',
    [`appOnComplete_${TransactionTypeEnum.ApplicationOptIn}`]:
      'Application Opt-In',
    [`appOnComplete_${TransactionTypeEnum.ApplicationUpdate}`]:
      'Update Application',
  },
};

export default translation;
