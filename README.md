<p align="center">
  <a href="https://kibis.is">
    <img alt="Kibisis & Browser logos" src=".github/assets/logo@637x128.png" style="padding-top: 15px" height="64" />
  </a>
</p>

<h1 align="center">
  Kibisis Web Extension
</h1>

<h4 align="center">
  An AVM wallet that goes beyond just DeFi.
</h4>

<p align="center">
  <a href="https://github.com/agoralabs-sh/kibisis-web-extension/releases/latest">
    <img alt="GitHub Release" src="https://img.shields.io/github/v/release/agoralabs-sh/kibisis-web-extension?&logo=github">
  </a>
  <a href="https://github.com/agoralabs-sh/kibisis-web-extension/releases/latest">
    <img alt="GitHub Release Date - Published At" src="https://img.shields.io/github/release-date/agoralabs-sh/kibisis-web-extension?logo=github">
  </a>
</p>

<p align="center">
  <a href="https://github.com/agoralabs-sh/kibisis-web-extension/releases">
    <img alt="GitHub Pre-release" src="https://img.shields.io/github/v/release/agoralabs-sh/kibisis-web-extension?include_prereleases&label=pre-release&logo=github">
  </a>
  <a href="https://github.com/agoralabs-sh/kibisis-web-extension/releases">
    <img alt="GitHub Pre-release Date - Published At" src="https://img.shields.io/github/release-date-pre/agoralabs-sh/kibisis-web-extension?label=pre-release date&logo=github">
  </a>
</p>

<p align="center">
  <a href="https://chromewebstore.google.com/detail/kibisis/hcgejekffjilpgbommjoklpneekbkajb" target="_blank">
    <img alt="Chrome Web Store Version" src="https://img.shields.io/chrome-web-store/v/hcgejekffjilpgbommjoklpneekbkajb?logo=googlechrome&logoColor=%23FFCE44&color=%23FFCE44">
  </a>

  <a href="https://microsoftedge.microsoft.com/addons/detail/kibisis/bajncpocmkioafbijldokfbjajelkbmc" target="_blank">
    <img alt="Microsoft Edge Add-on Version" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fbajncpocmkioafbijldokfbjajelkbmc%3Fhl%3Den-GB%26gl%3DGB&query=%24.version&prefix=v&logo=microsoftedge&logoColor=%230078D7&label=microsoft%20edge%20add-on&color=%230078D7" />
  </a>

  <a href="https://addons.mozilla.org/en-GB/firefox/addon/kibisis" target="_blank">
    <img alt="Mozilla Add-on Version" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Faddons.mozilla.org%2Fapi%2Fv5%2Faddons%2Faddon%2Fkibisis%2F&query=%24.current_version.version&logo=firefox&logoColor=%23FF7139&label=firefox%20add-on&color=%23FF7139" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/agoralabs-sh/kibisis-web-extension/blob/main/COPYING">
    <img alt="GitHub License" src="https://img.shields.io/github/license/agoralabs-sh/kibisis-web-extension">
  </a>
</p>

<p align="center">
  This is the Kibisis web extension built in React, TypeScript and Webpack.
</p>

### Table of contents

* [1. Overview](#-1-overview)
* [2. Usage](#-2-usage)
* [2. Development](#-3-development)
  * [3.1. Requirements](#31-requirements)
  * [3.2. Setup](#32-setup)
  * [3.3. Install Local Browsers](#33-install-local-browsers-optional)
    * [3.3.1. Chrome](#331-chrome)
    * [3.3.2. Firefox](#332-firefox)
  * [3.4. Run](#34-run)
* [4. Appendix](#-4-appendix)
  * [4.1. Useful Commands](#41-useful-commands)
  * [4.2. Manifest Permissions](#42-manifest-permissions)
* [5. How To Contribute](#-5-how-to-contribute)
* [6. License](#-6-license)

## 🗂️ 1. Overview

Coming soon...

## 🪄 2. Usage

Refer to the [documentation](https://kibis.is/overview) for information on how to use Kibisis.

<sup>[Back to top ^][table-of-contents]</sup>

## 🛠 3. Development

### 3.1. Requirements

* Install [Yarn v1.22.5+][yarn]
* Install [Node v20.9.0+][node]
* Install [jq][jq] (optional - if you are installing the local Chrome browser)

<sup>[Back to top ^][table-of-contents]</sup>

### 3.2. Setup

1. Install the dependencies:
```bash
$ yarn install
```

> ⚠️ **NOTE:** a post install script will run that creates a `.env` file.

2. In the newly created `.env` file, replace the environment values with the desired values.

<sup>[Back to top ^][table-of-contents]</sup>

### 3.3. Install Local Browsers (Optional)

If you are want to run a standalone browser for development, you can install developer versions of Chrome and Firefox. If these are installed, these will be used as the installation of the temporary extensions that are built in step [3.4.](#34-run)

> ⚠️ **NOTE:** the following commands can be run again to re-download and install the latest version. Your saved profile and extension settings will not be affected as they are stored in a separate directory in `.<chrome|firefox>_profile/`.
>
<sup>[Back to top ^][table-of-contents]</sup>

#### 3.3.1. Chrome

1. Simply run:
```shell
yarn install:chrome
```

> ️ **NOTE:** the binary will be installed to `.chrome/`.

<sup>[Back to top ^][table-of-contents]</sup>

#### 3.3.2. Firefox

1. Simply run:
```shell
yarn install:firefox
```

> ️ **NOTE:** the binary will be installed to `.firefox/`.

<sup>[Back to top ^][table-of-contents]</sup>

### 3.4. Run

* To run simply use:
```bash
$ yarn start:<chrome|firefox>
```

> ⚠️ **NOTE:** this command will bundle the TypeScript source code and extension assets into the `.<chrome|firefox>_build/` directory and depending on your intended target (you can choose '`chrome`' or '`firefox`') the corresponding browser will start up with the unpacked extension as a temporary extension.

<sup>[Back to top ^][table-of-contents]</sup>

## 📑 4. Appendix

### 4.1. Useful Commands

| Command                   | Description                                                                                                                                                                                            |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `yarn build:chrome`       | Bundles the source code and Chrome specific assets into the `.chrome_build/` directory.                                                                                                                |
| `yarn build:edge`         | Bundles the source code and Microsoft Edge specific assets into the `.edge_build/` directory.                                                                                                          |
| `yarn build:firefox`      | Bundles the source code and Firefox specific assets into the `.firefox_build/` directory.                                                                                                              |
| `yarn install:chrome`     | Installs/updates the latest version of Chrome For Testing browser to the project root. This removes the existing version if it exists.                                                                 |
| `yarn install:firefox`    | Installs/updates the latest version of Firefox Developer Edition browser to the project root. This removes the existing version if it exists.                                                          |
| `yarn package:chrome`     | Packages the contents of the `.chrome_build/` directory into a `kibisis-chrome-{version}.zip` file, ready for submission.                                                                              |
| `yarn package:edge`       | Packages the contents of the `.edge_build/` directory into a `kibisis-edge-{version}.zip` file, ready for submission.                                                                                  |
| `yarn package:firefox`    | Packages the contents of the `.firefox_build/` directory into a `kibisis-firefox-{version}.zip` file, ready for submission.                                                                            |
| `yarn prettier`           | Runs `prettier` with the same configuration that is run on the pre-commit hooks.                                                                                                                       |
| `yarn start:chrome`       | Bundles the source code & the add-on assets, starts the local Chrome For Testing Developer edition with the add-on installed. This will watch for changes in the source code and reload the extension. |
| `yarn start:firefox`      | Bundles the source code & the add-on assets, starts the local Firefox Developer edition with the add-on installed. This will watch for changes in the source code and reload the extension.            |
| `yarn start:dapp-example` | Starts the example dApp at [http://localhost:8080](http://localhost:8080)                                                                                                                              |
<sup>[Back to top ^][table-of-contents]</sup>

### 4.2. Manifest Permissions

| Value              | Version | Justification                                                                                                                                         |
|--------------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<all_urls>`       | 2       | When the extension attempts to scan the QR code of a WalletConnect dapp, the [`tabs.captureVisibleTab()`][capture-visible-tab-api] function is used.  |
| `activeTab`        | 3       | As above, the extension requires access to the [`tabs.captureVisibleTab()`][capture-visible-tab-api].                                                 |
| `alarms`           | 3       | A user can switch on a password lock. This feature utilizes the Alarms API as a timeout to lock the extension behind a password.                      |
| `storage`          | 2 and 3 | The [storage][storage-api] API is used to maintain the state of the extension. It saves encrypted private keys, settings and the lists of AVM assets. |
| `unlimitedStorage` | 2 and 3 | As an n number of accounts/private keys are saved to storage, users that have a lot of accounts will most likely exceed the storage limit.            |

<sup>[Back to top ^][table-of-contents]</sup>

## 👏 5. How To Contribute

Please read the [**Contributing Guide**][contribute] to learn about the development process.

<sup>[Back to top ^][table-of-contents]</sup>

## 📄 6. License

Please refer to the [COPYING][license] file.

<sup>[Back to top ^][table-of-contents]</sup>

<!-- Links -->
[capture-visible-tab-api]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/captureVisibleTab
[contribute]: ./CONTRIBUTING.md
[download-api]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/download
[jq]: https://github.com/jqlang/jq
[license]: ./COPYING
[node]: https://nodejs.org/en/
[storage-api]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage
[table-of-contents]: #table-of-contents
[use-web-ext]: https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/#using-web-ext-section
[yarn]: https://yarnpkg.com/
