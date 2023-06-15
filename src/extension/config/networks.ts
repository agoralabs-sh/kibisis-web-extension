import { NetworkTypeEnum } from '@extension/enums';

// Types
import { INetwork } from '@extension/types';

const networks: INetwork[] = [
  {
    algods: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://mainnet-api.algonode.cloud',
      },
      {
        canonicalName: 'PureStake',
        port: '',
        url: 'https://algosigner.api.purestake.io/mainnet/algod',
      },
    ],
    canonicalName: 'Algorand',
    chakraTheme: 'algorand',
    explorers: [
      {
        accountPath: '/address',
        applicationPath: '/application',
        assetPath: '/asset',
        baseUrl: 'https://algoexplorer.io',
        blockPath: '/block',
        canonicalName: 'AlgoExplorer',
        groupPath: '/tx/group',
        id: 'algoexplorer',
        transactionPath: '/tx',
      },
      {
        accountPath: '/address',
        applicationPath: '/app',
        assetPath: '/asset',
        baseUrl: 'https://algoscan.app',
        blockPath: '/block',
        canonicalName: 'AlgoScan',
        groupPath: '/tx/group',
        id: 'algoscan',
        transactionPath: '/tx',
      },
      {
        accountPath: '/account',
        applicationPath: '/application',
        assetPath: '/asset',
        baseUrl: 'https://goalseeker.purestake.io/algorand/mainnet',
        blockPath: '/block',
        canonicalName: 'PureStake',
        groupPath: null,
        id: 'purestake',
        transactionPath: '/transaction',
      },
    ],
    genesisId: 'mainnet-v1.0',
    genesisHash: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
    indexers: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://mainnet-idx.algonode.cloud',
      },
    ],
    namespace: {
      key: 'algorand',
      methods: ['signTransaction', 'signMessage'],
      reference: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73k',
    },
    nativeCurrency: {
      code: 'ALGO',
      decimals: 6,
      iconUri:
        'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPHBhdGgKCSAgICAgIGQ9Ik0gMy43OTI0ODAxLDExOTYuNzU0NyBDIDcuMzg4OTI2LDExOTAuNzg2OCAxNzIuNTQ4ODcsOTA0LjUzNjYzIDI2Mi43MTM5Miw3NDggMzM5LjQwNzIzLDYxNC44NTE4MyA0MDIuMzI1MzUsNTA1Ljg0MDM4IDY1MC4yODM0OCw3Ni41IDY3Mi44MzYxMywzNy40NSA2OTIuMTU0MDgsNC4yNjI1IDY5My4yMTIyNSwyLjc1IEwgNjk1LjEzNjE5LDAgaCA5MC4zMDAxMyA5MC4zMDAxMyBsIDEuNTgzMTksNS43NSBjIDAuODcwNzUsMy4xNjI1IDE0LjkwOTk2LDU1LjcgMzEuMTk4MjUsMTE2Ljc1IDMzLjM0NTM2LDEyNC45ODE0OCA0NC43MjU4NiwxNjcuMTc1MzkgNDYuNjYxNDMsMTczIGwgMS4zMjkyMyw0IDkzLjczNDE1LDAuNSA5My43MzQxLDAuNSAtNjMuNjM4OSwxMTAgYyAtMzUuMDAxNCw2MC41IC02My44MjA2LDExMC45IC02NC4wNDI2LDExMiAtMC4yMjIsMS4xIDMuODc3NiwxNy41MzgxNCA5LjExMDIsMzYuNTI5MjEgQyAxMDQyLjUwNDksNjIxLjA4OTQzIDExOTcsMTE5Ny4yNzQ4IDExOTcsMTE5OC45ODY0IGMgMCwwLjY3NzUgLTMwLjc1OTIsMS4wMTM2IC05Mi43NjgzLDEuMDEzNiBoIC05Mi43Njg0IEwgOTc0LjA4NDA4LDEwNjAuMjUgQyA5NDMuMjg5Niw5NDUuMTE4NTQgODkxLjY2MjM3LDc1My45ODQ5OSA4ODkuMzc0MjMsNzQ2LjYzODQ5IGMgLTAuNDg0ODIsLTEuNTU2NTkgLTAuNzg3MDYsLTEuNjM4NDkgLTEuODQ1MiwtMC41IC0wLjY5NTk3LDAuNzQ4ODMgLTMzLjIyMzg2LDU2LjcxMTUxIC03Mi4yODQxOSwxMjQuMzYxNTEgLTM5LjA2MDMzLDY3LjY1IC05Ny42NTA3MSwxNjkuMTI1IC0xMzAuMjAwODUsMjI1LjUgLTMyLjU1MDE0LDU2LjM3NSAtNTkuNTEzMTIsMTAyLjgzOTYgLTU5LjkxNzczLDEwMy4yNTQ3IC0wLjQwNDYxLDAuNDE1MSAtNDcuMTUzMTUsMC42NDAxIC0xMDMuODg1NjUsMC41IEwgNDE4LjA5MDYzLDExOTkuNSA1MDcuMzYxNjUsMTA0NCBDIDU1Ni40NjA3MSw5NTguNDc1IDYzNi45MjIzNCw4MTguOTc1IDY4Ni4xNjUyNiw3MzQgNzc2LjYwMjU3LDU3Ny45Mzg4MSA4MTkuNzMxNzcsNTAzLjM0MDc3IDgyMS44NjcwOCw0OTkuMjg0NTkgYyAwLjk5MDY2LC0xLjg4MTgzIC0zLjUxMjA1LC0xOS43MjUwMiAtMjkuOTAzMzIsLTExOC41IEMgNzU0Ljg4MDcxLDI0MS45OTMyOSA3NTcuODg0MjUsMjUzIDc1Ny4wOTM1MiwyNTMgNzU1Ljc5NTAzLDI1MyA3MjMuMjI4NTcsMzA4Ljg3MTg4IDY0MS45NzUyLDQ1MC41IDU5Ni4yMjE4OCw1MzAuMjUgNTE3LjQ1ODcsNjY2LjgyNSA0NjYuOTQ1OSw3NTQgNDE2LjQzMzEsODQxLjE3NSAzMzcuODE3ODksOTc3LjA3NSAyOTIuMjQ1NDMsMTA1NiBsIC04Mi44NTkwMSwxNDMuNSAtMTAzLjc3NzY1LDAuMjU0NyAtMTAzLjc3NzY1MDcsMC4yNTQ2IHoiIC8+Cjwvc3ZnPgo=',
    },
    type: NetworkTypeEnum.Stable,
  },
  {
    algods: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://betanet-api.algonode.cloud',
      },
    ],
    canonicalName: 'Algorand',
    chakraTheme: 'algorand',
    explorers: [
      {
        accountPath: '/address',
        applicationPath: '/application',
        assetPath: '/asset',
        baseUrl: 'https://betanet.algoexplorer.io',
        blockPath: '/block',
        canonicalName: 'AlgoExplorer',
        groupPath: '/tx/group',
        id: 'algoexplorer',
        transactionPath: '/tx',
      },
      {
        accountPath: '/address',
        applicationPath: '/app',
        assetPath: '/asset',
        baseUrl: 'https://betanet.algoscan.app',
        blockPath: '/block',
        canonicalName: 'AlgoScan',
        groupPath: '/tx/group',
        id: 'algoscan',
        transactionPath: '/tx',
      },
      {
        accountPath: '/account',
        applicationPath: '/application',
        assetPath: '/asset',
        baseUrl: 'https://goalseeker.purestake.io/algorand/betanet',
        blockPath: '/block',
        canonicalName: 'PureStake',
        groupPath: null,
        id: 'purestake',
        transactionPath: '/transaction',
      },
    ],
    genesisId: 'betanet-v1.0',
    genesisHash: 'mFgazF+2uRS1tMiL9dsj01hJGySEmPN28B/TjjvpVW0=',
    indexers: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://betanet-idx.algonode.cloud',
      },
    ],
    namespace: {
      key: 'algorand',
      methods: ['signTransaction', 'signMessage'],
      reference: 'mFgazF-2uRS1tMiL9dsj01hJGySEmPN2',
    },
    nativeCurrency: {
      code: 'ALGO',
      decimals: 6,
      iconUri:
        'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPHBhdGgKCSAgICAgIGQ9Ik0gMy43OTI0ODAxLDExOTYuNzU0NyBDIDcuMzg4OTI2LDExOTAuNzg2OCAxNzIuNTQ4ODcsOTA0LjUzNjYzIDI2Mi43MTM5Miw3NDggMzM5LjQwNzIzLDYxNC44NTE4MyA0MDIuMzI1MzUsNTA1Ljg0MDM4IDY1MC4yODM0OCw3Ni41IDY3Mi44MzYxMywzNy40NSA2OTIuMTU0MDgsNC4yNjI1IDY5My4yMTIyNSwyLjc1IEwgNjk1LjEzNjE5LDAgaCA5MC4zMDAxMyA5MC4zMDAxMyBsIDEuNTgzMTksNS43NSBjIDAuODcwNzUsMy4xNjI1IDE0LjkwOTk2LDU1LjcgMzEuMTk4MjUsMTE2Ljc1IDMzLjM0NTM2LDEyNC45ODE0OCA0NC43MjU4NiwxNjcuMTc1MzkgNDYuNjYxNDMsMTczIGwgMS4zMjkyMyw0IDkzLjczNDE1LDAuNSA5My43MzQxLDAuNSAtNjMuNjM4OSwxMTAgYyAtMzUuMDAxNCw2MC41IC02My44MjA2LDExMC45IC02NC4wNDI2LDExMiAtMC4yMjIsMS4xIDMuODc3NiwxNy41MzgxNCA5LjExMDIsMzYuNTI5MjEgQyAxMDQyLjUwNDksNjIxLjA4OTQzIDExOTcsMTE5Ny4yNzQ4IDExOTcsMTE5OC45ODY0IGMgMCwwLjY3NzUgLTMwLjc1OTIsMS4wMTM2IC05Mi43NjgzLDEuMDEzNiBoIC05Mi43Njg0IEwgOTc0LjA4NDA4LDEwNjAuMjUgQyA5NDMuMjg5Niw5NDUuMTE4NTQgODkxLjY2MjM3LDc1My45ODQ5OSA4ODkuMzc0MjMsNzQ2LjYzODQ5IGMgLTAuNDg0ODIsLTEuNTU2NTkgLTAuNzg3MDYsLTEuNjM4NDkgLTEuODQ1MiwtMC41IC0wLjY5NTk3LDAuNzQ4ODMgLTMzLjIyMzg2LDU2LjcxMTUxIC03Mi4yODQxOSwxMjQuMzYxNTEgLTM5LjA2MDMzLDY3LjY1IC05Ny42NTA3MSwxNjkuMTI1IC0xMzAuMjAwODUsMjI1LjUgLTMyLjU1MDE0LDU2LjM3NSAtNTkuNTEzMTIsMTAyLjgzOTYgLTU5LjkxNzczLDEwMy4yNTQ3IC0wLjQwNDYxLDAuNDE1MSAtNDcuMTUzMTUsMC42NDAxIC0xMDMuODg1NjUsMC41IEwgNDE4LjA5MDYzLDExOTkuNSA1MDcuMzYxNjUsMTA0NCBDIDU1Ni40NjA3MSw5NTguNDc1IDYzNi45MjIzNCw4MTguOTc1IDY4Ni4xNjUyNiw3MzQgNzc2LjYwMjU3LDU3Ny45Mzg4MSA4MTkuNzMxNzcsNTAzLjM0MDc3IDgyMS44NjcwOCw0OTkuMjg0NTkgYyAwLjk5MDY2LC0xLjg4MTgzIC0zLjUxMjA1LC0xOS43MjUwMiAtMjkuOTAzMzIsLTExOC41IEMgNzU0Ljg4MDcxLDI0MS45OTMyOSA3NTcuODg0MjUsMjUzIDc1Ny4wOTM1MiwyNTMgNzU1Ljc5NTAzLDI1MyA3MjMuMjI4NTcsMzA4Ljg3MTg4IDY0MS45NzUyLDQ1MC41IDU5Ni4yMjE4OCw1MzAuMjUgNTE3LjQ1ODcsNjY2LjgyNSA0NjYuOTQ1OSw3NTQgNDE2LjQzMzEsODQxLjE3NSAzMzcuODE3ODksOTc3LjA3NSAyOTIuMjQ1NDMsMTA1NiBsIC04Mi44NTkwMSwxNDMuNSAtMTAzLjc3NzY1LDAuMjU0NyAtMTAzLjc3NzY1MDcsMC4yNTQ2IHoiIC8+Cjwvc3ZnPgo=',
    },
    type: NetworkTypeEnum.Beta,
  },
  {
    algods: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://testnet-api.algonode.cloud',
      },
      {
        canonicalName: 'PureStake',
        port: '',
        url: 'https://algosigner.api.purestake.io/testnet/algod',
      },
    ],
    canonicalName: 'Algorand',
    chakraTheme: 'algorand',
    explorers: [
      {
        accountPath: '/address',
        applicationPath: '/application',
        assetPath: '/asset',
        baseUrl: 'https://testnet.algoexplorer.io',
        blockPath: '/block',
        canonicalName: 'AlgoExplorer',
        groupPath: '/tx/group',
        id: 'algoexplorer',
        transactionPath: '/tx',
      },
      {
        accountPath: '/address',
        applicationPath: '/app',
        assetPath: '/asset',
        baseUrl: 'https://testnet.algoscan.app',
        blockPath: '/block',
        canonicalName: 'AlgoScan',
        groupPath: '/tx/group',
        id: 'algoscan',
        transactionPath: '/tx',
      },
      {
        accountPath: '/account',
        applicationPath: '/application',
        assetPath: '/asset',
        baseUrl: 'https://goalseeker.purestake.io/algorand/testnet',
        blockPath: '/block',
        canonicalName: 'PureStake',
        groupPath: null,
        id: 'purestake',
        transactionPath: '/transaction',
      },
    ],
    genesisId: 'testnet-v1.0',
    genesisHash: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
    indexers: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://testnet-idx.algonode.cloud',
      },
    ],
    namespace: {
      key: 'algorand',
      methods: ['signTransaction', 'signMessage'],
      reference: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe',
    },
    nativeCurrency: {
      code: 'ALGO',
      decimals: 6,
      iconUri:
        'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPHBhdGgKCSAgICAgIGQ9Ik0gMy43OTI0ODAxLDExOTYuNzU0NyBDIDcuMzg4OTI2LDExOTAuNzg2OCAxNzIuNTQ4ODcsOTA0LjUzNjYzIDI2Mi43MTM5Miw3NDggMzM5LjQwNzIzLDYxNC44NTE4MyA0MDIuMzI1MzUsNTA1Ljg0MDM4IDY1MC4yODM0OCw3Ni41IDY3Mi44MzYxMywzNy40NSA2OTIuMTU0MDgsNC4yNjI1IDY5My4yMTIyNSwyLjc1IEwgNjk1LjEzNjE5LDAgaCA5MC4zMDAxMyA5MC4zMDAxMyBsIDEuNTgzMTksNS43NSBjIDAuODcwNzUsMy4xNjI1IDE0LjkwOTk2LDU1LjcgMzEuMTk4MjUsMTE2Ljc1IDMzLjM0NTM2LDEyNC45ODE0OCA0NC43MjU4NiwxNjcuMTc1MzkgNDYuNjYxNDMsMTczIGwgMS4zMjkyMyw0IDkzLjczNDE1LDAuNSA5My43MzQxLDAuNSAtNjMuNjM4OSwxMTAgYyAtMzUuMDAxNCw2MC41IC02My44MjA2LDExMC45IC02NC4wNDI2LDExMiAtMC4yMjIsMS4xIDMuODc3NiwxNy41MzgxNCA5LjExMDIsMzYuNTI5MjEgQyAxMDQyLjUwNDksNjIxLjA4OTQzIDExOTcsMTE5Ny4yNzQ4IDExOTcsMTE5OC45ODY0IGMgMCwwLjY3NzUgLTMwLjc1OTIsMS4wMTM2IC05Mi43NjgzLDEuMDEzNiBoIC05Mi43Njg0IEwgOTc0LjA4NDA4LDEwNjAuMjUgQyA5NDMuMjg5Niw5NDUuMTE4NTQgODkxLjY2MjM3LDc1My45ODQ5OSA4ODkuMzc0MjMsNzQ2LjYzODQ5IGMgLTAuNDg0ODIsLTEuNTU2NTkgLTAuNzg3MDYsLTEuNjM4NDkgLTEuODQ1MiwtMC41IC0wLjY5NTk3LDAuNzQ4ODMgLTMzLjIyMzg2LDU2LjcxMTUxIC03Mi4yODQxOSwxMjQuMzYxNTEgLTM5LjA2MDMzLDY3LjY1IC05Ny42NTA3MSwxNjkuMTI1IC0xMzAuMjAwODUsMjI1LjUgLTMyLjU1MDE0LDU2LjM3NSAtNTkuNTEzMTIsMTAyLjgzOTYgLTU5LjkxNzczLDEwMy4yNTQ3IC0wLjQwNDYxLDAuNDE1MSAtNDcuMTUzMTUsMC42NDAxIC0xMDMuODg1NjUsMC41IEwgNDE4LjA5MDYzLDExOTkuNSA1MDcuMzYxNjUsMTA0NCBDIDU1Ni40NjA3MSw5NTguNDc1IDYzNi45MjIzNCw4MTguOTc1IDY4Ni4xNjUyNiw3MzQgNzc2LjYwMjU3LDU3Ny45Mzg4MSA4MTkuNzMxNzcsNTAzLjM0MDc3IDgyMS44NjcwOCw0OTkuMjg0NTkgYyAwLjk5MDY2LC0xLjg4MTgzIC0zLjUxMjA1LC0xOS43MjUwMiAtMjkuOTAzMzIsLTExOC41IEMgNzU0Ljg4MDcxLDI0MS45OTMyOSA3NTcuODg0MjUsMjUzIDc1Ny4wOTM1MiwyNTMgNzU1Ljc5NTAzLDI1MyA3MjMuMjI4NTcsMzA4Ljg3MTg4IDY0MS45NzUyLDQ1MC41IDU5Ni4yMjE4OCw1MzAuMjUgNTE3LjQ1ODcsNjY2LjgyNSA0NjYuOTQ1OSw3NTQgNDE2LjQzMzEsODQxLjE3NSAzMzcuODE3ODksOTc3LjA3NSAyOTIuMjQ1NDMsMTA1NiBsIC04Mi44NTkwMSwxNDMuNSAtMTAzLjc3NzY1LDAuMjU0NyAtMTAzLjc3NzY1MDcsMC4yNTQ2IHoiIC8+Cjwvc3ZnPgo=',
    },
    type: NetworkTypeEnum.Test,
  },
  {
    algods: [
      {
        canonicalName: 'AlgoRPC.pro',
        port: '',
        url: 'https://voitest-api.algorpc.pro',
      },
    ],
    canonicalName: 'Voi',
    chakraTheme: 'voi',
    explorers: [],
    genesisId: 'voi-test-v1',
    genesisHash: 'xK6y2kD4Rnq9EYD1Ta1JTf56TBQTu2/zGwEEcg3C8Gg=',
    indexers: [
      {
        canonicalName: 'AlgoRPC.pro',
        port: '',
        url: 'https://voitest-idx.algorpc.pro',
      },
    ],
    namespace: {
      key: 'voi',
      methods: ['signTransaction', 'signMessage'],
      reference: 'xK6y2kD4Rnq9EYD1Ta1JTf56TBQTu2_z',
    },
    nativeCurrency: {
      code: 'VOI',
      decimals: 6,
      iconUri:
        'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPHBhdGggZD0ibSA1MzYuNjE1MDcsMTE0MS4xMzUzIGMgLTM3LjIxNzU0LC0xMC41OTQ5IC02OS4zODk1LC0yOS4zOTggLTEwMC44MTkzOCwtNTguOTI0OCAtMjEuNDc1OTMsLTIwLjE3NTQgLTMzLjkyMDQ1LC0zNy43NDA2IC02MS4yMDAwMiwtODYuMzgyNzUgLTIuOTI4NDMsLTUuMjIxNjYgLTI1Ljc5ODgsLTQ0Ljc0MDA4IC01MC44MjMwNiwtODcuODE4NzEgQyAyOTguNzQ4MzYsODY0LjkzMDQxIDI2MS41MjI1Nyw4MDAuODQ2NDkgMjQxLjA0ODY0LDc2NS42MDAzNCAyMjAuNTc0NzEsNzMwLjM1NDE4IDE3NS44NTY3NCw2NTMuNDUzNDkgMTQxLjY3NTM4LDU5NC43MDk5IC00Ljc5MDM3MjgsMzQyLjk5NTk4IC0zLjM3OTcyNzEsMzQ2LjI1NDg0IDEuNDQ1MzQ4NywyNzAuNzUxNTkgMTIuNDk4ODA1LDk3Ljc4NjAyMSAxOTAuNDIwMTgsLTAuMDA1OTQyMTggMzQ4LjgzMjEzLDc5LjgxNTM2MyBjIDQzLjI3MzA4LDIxLjgwNDYyNyA3My43MTAyNiw1Ny44NzI3NjcgMTI4LjM5NDA2LDE1Mi4xNDczMDcgMjcuMTMzMjgsNDYuNzc3NjMgNjMuMDQ1MDksMTA4LjU0NzY4IDc5LjgwNCwxMzcuMjY2NzcgMTYuNzU4OTUsMjguNzE5MDkgMzIuMTczNjEsNTUuMjkzNTkgMzQuMjU0NzUsNTkuMDU0NDIgNy43NzgwMSwxNC4wNTU0OSAxMy44NDExOCw4LjkxNjI1IDM3LjM1NTQyLC0zMS42NjMwNSBDIDc4NC4yNTIzLDEyOC4wNzU5NSA3NzUuMTEyOTQsMTQyLjY2NTY0IDgwNC45ODE2NCwxMTUuMTE1OTIgOTU4LjIzOTYsLTI2LjI0MzEwNCAxMTk5Ljk1NTEsNzguNDMwODc5IDExOTkuOTU1MSwyODYuMTU3NjkgYyAwLDYxLjQ4NzAzIC02LjQxOCw3OS42NTIwMyAtNjEuMjE3MywxNzMuMjYzOTQgLTIxLjM5NjcsMzYuNTUxNTQgLTU2Ljg0MzYsOTcuNDMxMjYgLTc4Ljc3MDUsMTM1LjI4ODI3IC0yMS45MjcsMzcuODU2OTYgLTQ5Ljk0NzUsODUuOTE5OSAtNjIuMjY3NzcsMTA2LjgwNjUyIC0xMi4zMjAzMiwyMC44ODY1OSAtNTMuMTQxNTUsOTEuMzc4ODkgLTkwLjcxMzgzLDE1Ni42NDk1NyAtMTIxLjkzNDExLDIxMS44MjQyMSAtMTI3LjQyODM2LDIxOS43OTc0MSAtMTcyLjk0MDA2LDI1MC45NjU5MSAtNTUuOTg4ODUsMzguMzQzOCAtMTMxLjkyMDYzLDUwLjY1MjMgLTE5Ny40MzA1NywzMi4wMDM0IHoiIC8+Cjwvc3ZnPgo=',
    },
    type: NetworkTypeEnum.Test,
  },
];

export default networks;
