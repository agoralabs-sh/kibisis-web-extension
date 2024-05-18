// enums
import { AssetTypeEnum, TransactionTypeEnum } from '@extension/enums';

// types
import { IResourceLanguage } from '@extension/types';

const translation: IResourceLanguage = {
  buttons: {
    add: 'Add',
    addAccount: 'Add Account',
    addAsset: 'Add Asset',
    allow: 'Allow',
    approve: 'Approve',
    cancel: 'Cancel',
    changePassword: 'Change Password',
    clearAllData: 'Clear All Data',
    confirm: 'Confirm',
    connect: 'Connect',
    copy: 'Copy',
    copyURI: 'Copy URI',
    copySeedPhrase: 'Copy Seed Phrase',
    create: 'Create',
    dismiss: 'Dismiss',
    download: 'Download',
    getStarted: 'Get Started',
    hide: 'Hide',
    import: 'Import',
    moreDetails: 'More Details',
    next: 'Next',
    ok: 'OK',
    previous: 'Previous',
    receive: 'Receive',
    reject: 'Reject',
    remove: 'Remove',
    removeAllSessions: 'Remove All Sessions',
    reset: 'Reset',
    save: 'Save',
    scanAWindow: 'Scan A Window',
    scanCurrentTab: 'Scan Current Tab',
    scanUsingCamera: 'Scan Using Camera',
    send: 'Send',
    sign: 'Sign',
    tryAgain: 'Try Again',
    view: 'View',
    yesImIn: `Yes, I'm In`,
  },
  captions: {
    accountAlreadyAdded: 'Account already added.',
    addAsset:
      'Enter an asset ID, name, symbol or application ID (for ARC-200).',
    addAssetConfirming:
      'Please wait while we confirm the opt-in of the asset {{symbol}} with the network.',
    [`addAssetConfirming_${AssetTypeEnum.ARC0200}`]: 'Adding asset {{symbol}}.',
    addAssetForWatchAccount: 'Enter an application ID (for ARC-200).',
    addAssetForWatchAccountWarning:
      'This is a watch account and only ARC-0200 assets can be added.',
    addAssetURI:
      'You are about to add the following asset. Select which account your would like to add the asset to.',
    addedAccount: 'Account {{address}} has been added.',
    addressDoesNotMatch: 'This address does not match the signer',
    addWatchAccount: 'Add a watch account by providing a valid address.',
    addWatchAccountComplete: `Press save to confirm adding the watch account.`,
    allowActionTracking:
      'By tracking certain actions, you can earn rewards. See <2>here</2> for more information.',
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
    cameraQRCodeScanNotAllowed1: 'Camera access has been denied.',
    cameraQRCodeScanNotAllowed2:
      'You will need to go into your settings and allow access.',
    changePassword1: 'Enter your new password.',
    changePassword2:
      'You will be prompted to enter your current password when you press "Change Password".',
    changeTheme: 'Choose between dark and light mode.',
    confirmingTransaction: 'Please wait, the transaction is being processed.',
    connectingToWalletConnect: 'Attempting to connect to WalletConnect.',
    copied: 'Copied!',
    createNewAccount:
      'Create a new account. You will be prompted to save a seed phrase.',
    createPassword1: `First, let's create a new password to secure this device.`,
    createPassword2:
      'This password will be used to encrypt your private keys, so make it strong!',
    debugLogging:
      'Debugging information will be output to the extension console.',
    defaultConfirm: 'Are you sure?',
    deleteApplication: 'Be careful, deleting an application is irreversible!',
    destroyAsset: 'Be careful, destroying an asset is irreversible!',
    enablePasswordLock:
      'Passwords will only need to be entered due to inactivity.',
    enableRequest:
      'An application is requesting to connect. Select which accounts you would like to enable:',
    enterSeedPhrase: `Add your seed phrase to import your account.`,
    enterWatchAccountAddress:
      'Enter the address of the account you would like to watch.',
    exportAccount: 'Select account to view the QR code to export your account.',
    extraPayment:
      'An extra network payment has been applied as this is the first time the recipient has interacted with the {{symbol}} asset.',
    factoryReset: 'This will remove all accounts, settings and the password.',
    factoryResetModal: 'Are you sure you want to perform a factory reset?',
    factoryResetWarning:
      'Once this has been completed, it cannot be reversed. All your accounts, settings and password will be removed',
    freezeManagerAddressDoesNotMatch:
      'This account does not have the authority to freeze/unfreeze this asset. This transaction will likely fail.',
    groupIdCopied: 'Group ID copied!',
    higherFee:
      'The fee is higher as this is the first time the recipient has interacted with the {{symbol}} asset.',
    importAccount: 'You are about to import the following account.',
    importAccountViaQRCode: `Import an account, including any assets, by scanning a QR code.`,
    importAccountViaSeedPhrase: `Import an existing account using a seed phrase.`,
    importAccountViaSeedPhraseComplete: `To finalize we will encrypt your account keys with your password and you will be able to start using this account.`,
    importingAccount: 'Importing new account and adding assets.',
    initializingWalletConnect:
      'Putting the final touches into your WalletConnect interface.',
    invalidAlgorithm: `The suggested signing method does not match the method that will be used to sign this token`,
    keyRegistrationURI:
      'You are about to register a participation key {{status}}.',
    loadingCameraStream: 'Loading your camera stream.',
    managerAddressDoesNotMatch:
      'This account does not have the authority to alter this asset. This transaction will likely fail.',
    maximumNativeCurrencyTransactionAmount:
      'The maximum {{nativeCurrencyCode}} amount is calculated by: the balance ({{balance}}), minus the minimum balance needed to keep the account open ({{minBalance}}), minus the minimum transaction fee ({{minFee}})',
    minimumBalance: `Minimum balance is {{amount}} {{code}}. Based on the account configuration, this is the minimum balance needed to keep the account open.`,
    minimumBalanceTooLow: `Your current balance will fall below the minimum balance requirement with this transaction. You need at least {{cost}} {{symbol}} to complete this transaction. Your current balance is {{balance}} {{symbol}}.`,
    mustEnterPasswordToAuthorizeOptIn:
      'You must enter your password to authorize an opt-in transaction.',
    mustEnterPasswordToAuthorizeOptOut:
      'You must enter your password to authorize an opt-out transaction.',
    mustEnterPasswordToConfirm: 'You must enter your password to confirm.',
    mustEnterPasswordToImportAccount:
      'You must enter your password to import this account.',
    mustEnterPasswordToSign: 'Enter your password to sign.',
    mustEnterPasswordToSignSecurityToken:
      'Enter your password to sign this security token.',
    mustEnterPasswordToSignTransaction:
      'Enter your password to sign this transaction.',
    mustEnterPasswordToSignTransactions:
      'Enter your password to sign these transactions.',
    mustEnterPasswordToSendTransaction:
      'You must enter your password to send transaction.',
    mustEnterPasswordToUnlock: 'You must enter your password to unlock.',
    nameYourAccount: `Give your account a nickname. Don't worry you can change this later on.`,
    newAccountComplete:
      'We are almost done. Before we safely secure your new account on this device, we just need you to confirm you have copied your seed phrase.',
    noAccountsFound:
      'You can create a new account or import an existing account.',
    noAssetsFound: 'You have not added any assets. Try adding one now.',
    noBlockExplorersAvailable: 'No block explorers available',
    noNFTExplorersAvailable: 'No NFT explorers available',
    noNFTsFound: `You don't have any NFTs.`,
    noSessionsFound: 'Enabled dApps will appear here.',
    noThemesAvailable: 'No themes available',
    offline: 'It looks like you are offline, some features may not work',
    openOn: 'Open on {{name}}',
    openUrl: 'Open URL in your browser',
    optInFee:
      'Standard assets require an "opt-in" fee. This is a transaction of the asset with a "0" amount sent to yourself.',
    optOutFee:
      'Standard assets require an "opt-out" fee. This is a transaction of the asset with a "0" amount sent to yourself.',
    passwordLockDescription: 'Please re-enter your password to unlock.',
    passwordScoreInfo:
      'To conform with our <2>Strong Password Policy</2>, you are required to use a sufficiently strong password. Password must be at least 8 characters.',
    preferredBlockExplorer: 'Used when opening chain information in new tabs.',
    preferredNFTExplorer: 'Used when opening NFTs.',
    removeAccount: 'Are you sure you want to remove account "{{address}}"?',
    removeAccountWarning:
      'To add this account back you will need the seed phrase',
    removeAllSessions: 'Are you sure you want to remove all sessions?',
    removeAllAccountsWarning:
      'Removing all accounts will also remove this session',
    removeAsset:
      'Are you sure you want to remove {{symbol}}? You will have to opt-in to this asset again.',
    [`removeAsset_${AssetTypeEnum.ARC0200}`]:
      'Are you sure you want to hide {{symbol}}? You can re-add it back to your asset holdings again.',
    removeAssetConfirming:
      'Please wait while we confirm the opt-out of the asset {{symbol}} with the network.',
    [`removeAssetConfirming_${AssetTypeEnum.ARC0200}`]:
      'Hiding asset {{symbol}}.',
    saveMnemonicPhrase1:
      'Here is your 25 word mnemonic seed phrase; it is the key to your account.',
    saveMnemonicPhrase2: `Make sure you save this in a secure place.`,
    scanningForQrCode:
      'Scanning for a QR Code. Make sure the QR code is visible in the background.',
    screenCaptureViaQRCodeScanNotAllowed1:
      'Screen capture access has been denied.',
    screenCaptureViaQRCodeScanNotAllowed2:
      'You will need to go into your settings and allow access.',
    selectScanLocation: 'Choose how you would like to scan the QR code.',
    securityTokenExpired: 'This token has expired',
    signJwtRequest: 'An application is requesting to sign a security token.',
    signMessageRequest: 'An application is requesting to sign a message.',
    signTransactionRequest:
      'An application is requesting to sign a transaction.',
    signTransactionsRequest:
      'An application is requesting to sign multiple transactions.',
    support:
      'Please <2>contact us</2> for further assistance so we can resolve this issue for you.',
    transactionIdCopied: 'Transaction ID copied!',
    transactionsSentSuccessfully:
      '{{amount}} transaction(s) were successfully sent.',
    unknownQRCode: 'The QR code provided is not recognized.',
    updatingAssetInformation: 'Updating asset information',
    viewSeedPhrase1: 'Select an account to view the seed phrase.',
    viewSeedPhrase2: 'You will be prompted to enter your password.',
  },
  errors: {
    descriptions: {
      code: `Please contact support with code "{{code}}" and describe what happened.`,
      code_1002: `Failed to parse the "{{type}}" data.`,
      code_2000: 'The password seems to be invalid.',
      code_2003: 'This account already exists.',
      code_4001: 'Your balance will fall below the minimum balance required.',
      code_4002: 'Standard assets must have a zero balance.',
      code_6000: 'There was an error starting the camera.',
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
      code: 'Well This Is Embarrassing...',
      code_1002: '1002 Parsing Error',
      code_2000: '2000 Invalid Password',
      code_2003: '2003 Account Already Exists',
      code_4001: '4001 Minimum Balance Required',
      code_4002: '4002 Assets Need A Zero Balance',
      code_6000: '6000 Camera Error',
    },
  },
  headings: {
    addAsset: 'Add Asset',
    addedAccount: 'Added Account!',
    addedAsset: 'Added Asset {{symbol}}!',
    addWatchAccount: 'Add A Watch Account',
    allowMainNetConfirm: 'Allow MainNet Networks',
    analyticsAndTracking: 'Analytics & Tracking',
    almostThere: 'Almost There...',
    assetDetails: 'Asset Details',
    authentication: 'Authentication',
    beta: 'Beta',
    cameraDenied: 'Camera Denied',
    cameraLoading: 'Camera Loading',
    comingSoon: 'Coming Soon!',
    confirm: 'Confirm',
    createNewAccount: 'Create A New Account',
    dangerZone: 'Danger Zone',
    developer: 'Developer',
    enterAnAddress: 'Enter an address',
    enterYourSeedPhrase: 'Enter your seed phrase',
    factoryReset: 'Factory Reset',
    generateSeedPhrase: 'Generate seed phrase',
    hiddenAsset: 'Asset {{symbol}} Hidden!',
    importAccount: 'Import Account',
    importAccountViaQRCode: 'Import An Account Via A QR Code',
    importAccountViaSeedPhrase: 'Import An Account Via Seed Phrase',
    nameYourAccount: 'Name your account',
    network: 'Network',
    newAccountComplete: 'Almost There...',
    noAccountsFound: 'No accounts found',
    noAssetsFound: 'No assets found',
    noNFTsFound: 'No NFTs found',
    noTransactionsFound: 'No transactions found',
    noSessionsFound: 'No sessions found',
    numberOfTransactions: '{{number}} transaction',
    numberOfTransactions_multiple: '{{number}} atomic transactions',
    offline: 'Offline',
    passwordLock: 'Welcome back',
    removeAccount: 'Remove Account',
    removeAllSessions: 'Remove All Sessions',
    removeAsset: 'Remove {{symbol}}',
    [`removeAsset_${AssetTypeEnum.ARC0200}`]: 'Hide {{symbol}}',
    removedAsset: 'Asset {{symbol}} Removed!',
    [`removedAsset_${AssetTypeEnum.ARC0200}`]: 'Asset {{symbol}} Hidden!',
    scanningForQRCode: 'Scanning For QR Code',
    scanQrCode: 'Scan QR Code',
    selectAccount: 'Select Account',
    sendAsset: 'Send {{asset}}',
    shareAddress: 'Share Address',
    screenCaptureDenied: 'Screen Capture Denied',
    screenCaptureLoading: 'Screen Capture Loading',
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
    [`transaction_${TransactionTypeEnum.ARC0200AssetTransfer}`]:
      'Asset Transfer 🪙',
    [`transaction_${TransactionTypeEnum.AssetUnfreeze}`]: 'Asset Unfreeze 🚀',
    [`transaction_${TransactionTypeEnum.KeyRegistrationOffline}`]:
      'Offline Key Registration 🔑',
    [`transaction_${TransactionTypeEnum.KeyRegistrationOnline}`]:
      'Online Key Registration 🔑',
    [`transaction_${TransactionTypeEnum.Payment}`]: 'Payment 💸',
    transactionsSuccessful: 'Transaction(s) Successful!',
    unknownAccount: 'Unknown Account',
    unknownNetwork: 'Unknown Network',
    unknownQRCode: 'Unknown QR Code',
  },
  labels: {
    account: 'Account',
    activity: 'Activity',
    address: 'Address',
    addressToSign: 'Address To Sign',
    accountName: 'Account Name',
    accountToFreeze: 'Account To Freeze',
    accountToUnfreeze: 'Account To Unfreeze',
    addAccount: 'Add Account',
    allowActionTracking: 'Allow certain actions to be tracked?',
    allowBetaNet: 'Allow BetaNet networks?',
    allowDidTokenFormat: 'Allow DID token format in address sharing?',
    allowMainNet: 'Allow MainNet networks?',
    alreadyAdded: 'Already Added',
    amount: 'Amount',
    applicationId: 'Application ID',
    asset: 'Asset',
    assetId: 'Asset ID',
    assets: 'Assets',
    audience: 'Audience',
    authorizedAccounts: 'Authorized Accounts',
    authorizedAddresses: 'Authorized Addresses',
    balance: 'Balance',
    chain: 'Chain',
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
    enablePasswordLock: 'Enable password lock?',
    expirationDate: 'Expiration Date',
    extensionId: 'Extension ID',
    extraPayment: 'Extra Payment',
    factoryReset: 'Factory Reset',
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
    managerAccount: 'Manager Account',
    manageAccounts: 'Manage Accounts',
    max: 'Max',
    message: 'Message',
    moreInformation: 'More Information',
    name: 'Name',
    network: 'Network',
    newPassword: 'New Password',
    nfts: 'NFTs',
    no: 'No',
    note: 'Note',
    noteOptional: 'Note (optional)',
    password: 'Password',
    passwordLockDuration: 'Never',
    passwordLockDuration_60000: '1 minute',
    passwordLockDuration_120000: '2 minutes',
    passwordLockDuration_300000: '5 minutes',
    passwordLockDuration_600000: '10 minutes',
    passwordLockDuration_900000: '15 minutes',
    passwordLockDuration_1800000: '30 minutes',
    passwordLockTimeout: 'Password lock timeout',
    preferredBlockExplorer: 'Preferred Block Explorer',
    preferredNFTExplorer: 'Preferred NFT Explorer',
    reKeyed: 'Re-keyed',
    removeAccount: 'Remove Account',
    removeAsset: 'Remove Asset',
    [`removeAsset_${AssetTypeEnum.ARC0200}`]: 'Hide Asset',
    removeSession: 'Remove Session',
    reserveAccount: 'Reserve Account',
    scanQRCode: 'Scan QR Code',
    seedPhrase: 'Seed Phrase',
    selectionKey: 'VRF Public Key',
    selectWalletAccount: 'Select wallet account',
    sendAsset: 'Send {{nativeCurrency}}/Asset',
    settings: 'Settings',
    shareAddress: 'Share Address',
    signingMethod: 'Signing Method',
    stateProofKey: 'State Proof Public Key',
    symbol: 'Symbol',
    theme: 'Theme',
    to: 'To',
    tokenId: 'Token ID',
    totalSupply: 'Total Supply',
    type: 'Type',
    unitName: 'Unit Name',
    unknownApp: 'Unknown App',
    unknownHost: 'unknown host',
    url: 'URL',
    value: 'Value',
    version: 'Version',
    voteFirst: 'Voting First Round',
    voteKey: 'Participation Public Key',
    voteKeyDilution: 'Key Dilution',
    voteLast: 'Voting Last Round',
    yes: 'Yes',
    watch: 'Watch',
  },
  placeholders: {
    enterAddress: 'Enter address',
    enterANameForYourAccount: 'Enter a name for your account',
    enterNote: 'Enter an optional note',
    enterPassword: 'Enter password',
    nameAccount: 'Enter a name for this account (optional)',
    pleaseSelect: 'Please select...',
  },
  titles: {
    strongPasswordPolicy: 'Strong Password Policy',
    page: '',
    page_about: 'About',
    page_accountSetup: 'Choose How To Add An Account',
    page_advanced: 'Advanced',
    page_addWatchAccount: 'Add A Watch Account',
    page_appearance: 'Appearance',
    page_changePassword: 'Change Password',
    page_createNewAccount: 'Create A New Account',
    page_createPassword: 'Secure Your Device',
    page_exportAccount: 'Export Account',
    page_general: 'General',
    page_importAccountViaQRCode: 'Import An Account Via QR Code',
    page_importAccountViaSeedPhrase: 'Import An Account Via Seed Phrase',
    page_passwordLock: 'Enter Your Password',
    page_privacy: 'Privacy',
    page_security: 'Security',
    page_sessions: 'Sessions',
    page_settings: 'Settings',
    page_viewSeedPhrase: 'View Seed Phrase',
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
