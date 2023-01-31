export const connectType = {
  MetaMask: 1,
  WalletConnect: 2,
};

export const AssetState = {
  Normal: 0,
  Deleted: 1,
};

export const SellingType = {
  Unsell: 0,
  Opensea: 1,
  Order: 2,
};

export const LedgerType = {
  Reserved: 0, // 0保留
  Receive: 1, // 1进账-无名接收存入
  Deposit: 2, // 2进账-存入
  Withdraw: 3, // 3出账-取出
  Release: 4, // 4出账-成员分成
  AssetIncome: 5,
};

export const LedgerState = {
  Normal: 0,
  Deleted: 1,
};
