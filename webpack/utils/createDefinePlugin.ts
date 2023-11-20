import { DefinePlugin } from 'webpack';

// configs
import chromeManifest from '../../src/manifest.chrome.json';
import firefoxManifest from '../../src/manifest.firefox.json';

// constants
import { APP_TITLE } from '../constants';

// enums
import { EnvironmentEnum } from '../enums';

// types
import { ITargetType } from '../types';

interface IOptions {
  environment: EnvironmentEnum;
  target: ITargetType;
  version: string;
  walletConnectProjectId: string;
}

/**
 * Convenience function to create a define plugin.
 * @param {IOptions} options - various options.
 * @returns {DefinePlugin} an initialized DefinePlugin.
 */
export default function createDefinePlugin({
  environment,
  target,
  version,
  walletConnectProjectId,
}: IOptions): DefinePlugin {
  let extensionId: string;

  switch (target) {
    case 'chrome':
      extensionId = chromeManifest.key;
      break;
    // default
    case 'firefox':
    default:
      extensionId = firefoxManifest.browser_specific_settings.gecko.id;
      break;
  }

  return new DefinePlugin({
    __EXTENSION_ID__: JSON.stringify(extensionId),
    __APP_TITLE__: JSON.stringify(APP_TITLE),
    __ENV__: JSON.stringify(environment),
    __VERSION__: JSON.stringify(version),
    __WALLET_CONNECT_PROJECT_ID__: JSON.stringify(walletConnectProjectId),
  });
}
