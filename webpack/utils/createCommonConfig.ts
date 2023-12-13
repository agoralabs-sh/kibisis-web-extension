import { resolve } from 'path';
import { Configuration } from 'webpack';

// constants
import { SRC_PATH } from '../constants';

/**
 * Creates a common config.
 * @returns {Configuration} a common configuration.
 */
export default function createCommonConfig(): Configuration {
  const commonPath: string = resolve(SRC_PATH, 'common');
  const extensionPath: string = resolve(SRC_PATH, 'extension');
  const externalPath: string = resolve(SRC_PATH, 'external');

  return {
    resolve: {
      alias: {
        // common
        ['@common/enums']: resolve(commonPath, 'enums'),
        ['@common/errors']: resolve(commonPath, 'errors'),
        ['@common/messages']: resolve(commonPath, 'messages'),
        ['@common/types']: resolve(commonPath, 'types'),
        ['@common/utils']: resolve(commonPath, 'utils'),
        // extension
        ['@extension/components']: resolve(extensionPath, 'components'),
        ['@extension/config']: resolve(extensionPath, 'config'),
        ['@extension/constants']: resolve(extensionPath, 'constants'),
        ['@extension/enums']: resolve(extensionPath, 'enums'),
        ['@extension/errors']: resolve(extensionPath, 'errors'),
        ['@extension/features/accounts']: resolve(
          extensionPath,
          'features',
          'accounts'
        ),
        ['@extension/features/arc200-assets']: resolve(
          extensionPath,
          'features',
          'arc200-assets'
        ),
        ['@extension/features/events']: resolve(
          extensionPath,
          'features',
          'events'
        ),
        ['@extension/features/messages']: resolve(
          extensionPath,
          'features',
          'messages'
        ),
        ['@extension/features/networks']: resolve(
          extensionPath,
          'features',
          'networks'
        ),
        ['@extension/features/notifications']: resolve(
          extensionPath,
          'features',
          'notifications'
        ),
        ['@extension/features/registration']: resolve(
          extensionPath,
          'features',
          'registration'
        ),
        ['@extension/features/send-assets']: resolve(
          extensionPath,
          'features',
          'send-assets'
        ),
        ['@extension/features/sessions']: resolve(
          extensionPath,
          'features',
          'sessions'
        ),
        ['@extension/features/settings']: resolve(
          extensionPath,
          'features',
          'settings'
        ),
        ['@extension/features/standard-assets']: resolve(
          extensionPath,
          'features',
          'standard-assets'
        ),
        ['@extension/features/system']: resolve(
          extensionPath,
          'features',
          'system'
        ),
        ['@extension/fonts']: resolve(extensionPath, 'fonts'),
        ['@extension/hooks']: resolve(extensionPath, 'hooks'),
        ['@extension/pages']: resolve(extensionPath, 'pages'),
        ['@extension/selectors']: resolve(extensionPath, 'selectors'),
        ['@extension/services']: resolve(extensionPath, 'services'),
        ['@extension/styles']: resolve(extensionPath, 'styles'),
        ['@extension/theme']: resolve(extensionPath, 'theme'),
        ['@extension/translations']: resolve(extensionPath, 'translations'),
        ['@extension/types']: resolve(extensionPath, 'types'),
        ['@extension/utils']: resolve(extensionPath, 'utils'),
        // external
        ['@external/constants']: resolve(externalPath, 'constants'),
        ['@external/services']: resolve(externalPath, 'services'),
        ['@external/types']: resolve(externalPath, 'types'),
      },

      extensions: ['.css', '.js', '.ts', '.tsx'],
    },

    stats: {
      assetsSpace: 100,
      modules: false,
    },
  };
}
