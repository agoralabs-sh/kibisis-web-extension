<p align="center">
  <a href="https://www.nettlelabs.com">
    <img alt="Agora Labs & Firefox logos" src="assets/logo.png" style="padding-top: 15px" height="64" />
  </a>
</p>

<h1 align="center">
  Agora Wallet For Firefox
</h1>

<p align="center">
  <a href="https://github.com/agoralabs-sh/agora-wallet-firefox/actions/workflows/lint_build_test.yml" target="_blank">
    <img src="https://github.com/agoralabs-sh/agora-wallet-firefox/actions/workflows/lint_build_test.yml/badge.svg" alt="Build, lint and test" />
  </a>
  <a href="https://img.shields.io/amo/v/agorawallet@agoralabs.sh" target="_blank">
    <img src="https://img.shields.io/amo/v/agorawallet@agoralabs.sh" alt="Mozilla add-on" />
  </a>
</p>

<p align="center">
  An Algorand wallet browser extension to sign data, send transactions and rekey with another account.
</p>

### Table of contents

* [1. Installation](#-1-installation)
* [2. Usage](#-2-usage)
  * [2.1. Quick Start](#21-quick-start)
  * [2.2. API](#22-api)
* [3. Development](#-3-development)
  * [3.1. Requirements](#31-requirements)
  * [3.2. Setup](#32-setup)
  * [3.3. Run](#33-run)
* [4. Appendix](#-4-appendix)
  * [4.1. Useful Commands](#41-useful-commands)
* [5. How To Contribute](#-5-how-to-contribute)
* [6. License](#-6-license)

## 📦 1. Installation

Coming soon...

## 🪄 2. Usage

### 2.1 Quick Start

Coming soon...

<sup>[Back to top ^][table-of-contents]</sup>

### 2.2 API

Coming soon...

<sup>[Back to top ^][table-of-contents]</sup>

## 🛠 3. Development

### 3.1. Requirements

* Install [Yarn v1.22.5+][yarn]

<sup>[Back to top ^][table-of-contents]</sup>

### 3.2. Setup

1. Install the dependencies:
```bash
$ yarn install
```

<sup>[Back to top ^][table-of-contents]</sup>

### 3.3. Run

* To run simply use:
```bash
$ yarn start
```

This will bundle the Typescript source code and the add-on assets into a `build/` directory and once the build files have been bundled, Webpack will start the locally installed Firefox Developer Edition (located at [`./.firefox/`][local-firefox-dir]) with the local extension as a temporary add-on.

<sup>[Back to top ^][table-of-contents]</sup>

## 📑 4. Appendix

### 4.1 Useful Commands

| Command              | Description                                                                                                                                                                           |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `yarn build`         | Bundles the source code and the add-on assets in the `build/` directory.                                                                                                              |
| `yarn package`       | Packages the contents of the `build/` directory into a `.zip` file, ready for submission. See [use `web-ext`][use-web-ext].                                                           |
| `yarn prettier`      | Runs `prettier` with the same configuration that is run on the pre-commit hooks.                                                                                                      |
| `yarn start`         | Bundles the source code & the add-on assets, starts the Firefox Developer edition with the add-on installed. This will watch for changes in the source code and reload the extension. |
| `yarn start:firefox` | Starts up the local Firefox Developer edition and installs the local add-on as a temporary add-on.                                                                                    |

<sup>[Back to top ^][table-of-contents]</sup>

## 👏 5. How To Contribute

Please read the [**Contributing Guide**][contribute] to learn about the development process.

<sup>[Back to top ^][table-of-contents]</sup>

## 📄 6. License

Please refer to the [LICENSE][license] file.

<sup>[Back to top ^][table-of-contents]</sup>

<!-- Links -->
[contribute]: ./CONTRIBUTING.md
[license]: ./LICENSE
[local-firefox-dir]: ./.firefox
[table-of-contents]: #table-of-contents
[use-web-ext]: https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/#using-web-ext-section
[yarn]: https://yarnpkg.com/
