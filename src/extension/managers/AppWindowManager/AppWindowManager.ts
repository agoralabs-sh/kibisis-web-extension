import browser, { Windows } from 'webextension-polyfill';

// constants
import {
  DEFAULT_POPUP_HEIGHT,
  DEFAULT_POPUP_WIDTH,
} from '@extension/constants';

// enums
import { AppTypeEnum } from '@extension/enums';

// repositories
import AppWindowRepository from '@extension/repositories/AppWindowRepository';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import type { ICreateWindowOptions, INewOptions } from './types';

/**
 * Manages app windows in storage.
 * @class
 */
export default class AppWindowManager {
  // private variables
  private readonly _appWindowRepository: AppWindowRepository;
  private readonly _logger: ILogger | null;

  constructor({ appWindowRepository, logger }: INewOptions & IBaseOptions) {
    this._appWindowRepository =
      appWindowRepository || new AppWindowRepository();
    this._logger = logger || null;
  }

  /**
   * public functions
   */

  /**
   * Creates a new window and saves it to storage.
   * @param {ICreateWindowOptions} options - The window parameters.
   * @returns {Promise<Windows.Window | null>} A promise that resolves to the created window, nor null if the window was
   * not created.
   * @public
   */
  public async createWindow({
    left,
    searchParams,
    top,
    type,
  }: ICreateWindowOptions): Promise<Windows.Window | null> {
    const _functionName = 'createWindow';
    const currentWindow = await browser.windows.getCurrent();
    let _window: Windows.Window;
    let defaultLeftPosition: number | undefined;
    let defaultTopPosition: number | undefined;
    let windowURL: string | null = null;

    switch (type) {
      case AppTypeEnum.BackgroundApp:
        windowURL = 'background-app.html';
        break;
      case AppTypeEnum.MainApp:
        windowURL = 'main-app.html';
        break;
      case AppTypeEnum.RegistrationApp:
        windowURL = 'registration-app.html';
        break;
      default:
        break;
    }

    if (!windowURL) {
      this._logger?.debug(
        `${AppWindowManager.name}#${_functionName}: unknown app type "${type}"`
      );

      return null;
    }

    defaultLeftPosition = currentWindow.width
      ? Math.round(currentWindow.width / 2 - DEFAULT_POPUP_WIDTH / 2)
      : undefined;
    defaultTopPosition = currentWindow.height
      ? Math.round(currentWindow.height / 2 - DEFAULT_POPUP_HEIGHT / 2)
      : undefined;
    _window = await browser.windows.create({
      focused: true,
      height: DEFAULT_POPUP_HEIGHT,
      left: left ?? defaultLeftPosition,
      top: top ?? defaultTopPosition,
      type: 'popup',
      url: `${windowURL}${searchParams ? `?${searchParams.toString()}` : ''}`,
      width: DEFAULT_POPUP_WIDTH,
    });

    if (!_window.id) {
      this._logger?.debug(
        `${AppWindowManager.name}#${_functionName}: no window id for window "${type}"`
      );

      return null;
    }

    await this._appWindowRepository.save({
      id: _window.id,
      item: {
        left: _window.left || 0,
        top: _window.top || 0,
        type,
        windowId: _window.id,
      },
    });

    return _window;
  }

  /**
   * Checks if the app windows in storage are still open. If the windows are no longer open, they are removed.
   * @public
   */
  public async hydrate(): Promise<void> {
    const openWindows = await browser.windows.getAll();
    const appWindows = await this._appWindowRepository.fetchAll();
    const stagnantWindowIDs: number[] = [];

    appWindows.forEach((appWindow) => {
      const openWindow: Windows.Window | null =
        openWindows.find((value) => value.id === appWindow.windowId) || null;

      // if no window is open, remove it
      if (!openWindow) {
        stagnantWindowIDs.push(appWindow.windowId);
      }
    });

    await this._appWindowRepository.removeByIds(stagnantWindowIDs);
  }
}
