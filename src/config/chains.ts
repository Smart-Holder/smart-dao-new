const ETH_MAINNET = 'https://ethmainnet.anyswap.exchange';
// const ETH_MAINNET = 'https://mainnet.infura.io/v3/0e40cfd5e7a64b2d9aea8427e4bd52a0'
const ETH_MAIN_CHAINID = 1;
const ETH_MAIN_EXPLORER = 'https://etherscan.io';

const ETH_TESTNET = 'https://rinkeby.infura.io/v3/';
const ETH_TEST_CHAINID = 4;
const ETH_TEST_EXPLORER = 'https://rinkeby.etherscan.io';

const ETH_GOERLI_TESTNET = 'https://goerli.infura.io/v3/';
const ETH_GOERLI_CHAINID = 5;
const ETH_GOERLI_EXPLORER = 'https://goerli.etherscan.io';

// const BNB_MAINNET = "https://bsc-dataseed1.binance.org";
// const BNB_MAIN_CHAINID = 56;
// const BNB_MAIN_EXPLORER = "https://bscscan.com";

export const ETH_CHAINS_INFO: any = {
  1: {
    rpc: ETH_MAINNET,
    chainId: ETH_MAIN_CHAINID,
    lookHash: ETH_MAIN_EXPLORER + '/tx/',
    lookAddr: ETH_MAIN_EXPLORER + '/address/',
    explorer: ETH_MAIN_EXPLORER,
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'MAINNET',
    label: 'ETH_MAIN',
    decimals: 18,
    opensea: 'https://opensea.io/assets/ethereum',
    DAOsProxy: '0xe5a75c22B074B563185856F5a679DB56daD2c227',
    unit: 'ETH',
    icon: '/images/market/icon_nft_card_unit_eth_default@2x.png',
    symbol2: 'ETH',
  },
  // 4: {
  //   rpc: ETH_TESTNET,
  //   chainId: ETH_TEST_CHAINID,
  //   lookHash: ETH_TEST_EXPLORER + '/tx/',
  //   lookAddr: ETH_TEST_EXPLORER + '/address/',
  //   explorer: ETH_TEST_EXPLORER,
  //   symbol: 'RinkebyETH',
  //   name: 'Rinkeby',
  //   type: 'TESTNET',
  //   label: 'ETH_TEST',
  //   decimals: 18,
  // },
  5: {
    rpc: ETH_GOERLI_TESTNET,
    chainId: ETH_GOERLI_CHAINID,
    lookHash: ETH_GOERLI_EXPLORER + '/tx/',
    lookAddr: ETH_GOERLI_EXPLORER + '/address/',
    explorer: ETH_GOERLI_EXPLORER,
    symbol: 'GoerliETH',
    name: 'Goerli',
    type: 'TESTNET',
    label: 'ETH_TEST',
    decimals: 18,
    opensea: 'https://testnets.opensea.io/assets/goerli',
    DAOsProxy: '0xe5a75c22B074B563185856F5a679DB56daD2c227',
    unit: 'ETH',
    icon: '/images/market/icon_nft_card_unit_eth_default@2x.png',
    symbol2: 'GOERLI',
  },
  137: {
    rpc: 'https://polygon-mainnet.infura.io',
    chainId: 137,
    lookHash: 'https://polygonscan.com' + '/tx/',
    lookAddr: 'https://polygonscan.com' + '/address/',
    explorer: 'https://polygonscan.com',
    symbol: 'MATIC',
    name: 'Matic',
    type: 'MAINNET',
    label: 'MATIC_MAIN',
    decimals: 18,
    opensea: 'https://opensea.io/assets/matic',
    DAOsProxy: '0xa209a92D0230018b8016b6d7cCDa1E219a0174E1',
    unit: 'MATIC',
    icon: '/images/market/icon_nft_card_unit_eth_default@2x.png',
    symbol2: 'MATIC',
  },
  // 56: {
  //   rpc: BNB_MAINNET,
  //   chainId: BNB_MAIN_CHAINID,
  //   lookHash: BNB_MAIN_EXPLORER + "/tx/",
  //   lookAddr: BNB_MAIN_EXPLORER + "/address/",
  //   explorer: BNB_MAIN_EXPLORER,
  //   symbol: "BNB",
  //   name: "BSC",
  //   type: "MAINNET",
  //   label: "BNB_MAIN",
  //   decimals: 18,
  // },
};

export const Market = {
  Opensea: {
    image: 'https://smart-dao-res.stars-mine.com/FlAqJJOOLLwzaOJvzF9GfjEdFY8X',
  },
};
