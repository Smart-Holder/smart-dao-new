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

export const Permissions = {
  Action_Member_Create: 0x22a25870, // 添加NFTP
  Action_VotePool_Create: 0xdc6b0b72, // 发起提案
  Action_VotePool_Vote: 0x678ea396, // 投票
  Action_Asset_SafeMint: 0x59baef2a, // 发行资产
  Action_DAO_Settings: 0xd0a4ad96, // 修改DAO的基础设置
  Action_DAO_SetModule: 0x5d29163,
  Action_Asset_set_seller_fee_basis_points: 0x91eb3dee,
  Action_Asset_Shell_Withdraw: 0x2e1a7d4d,
  Action_Ledger_Withdraw: 0xf108a7d2,
  Action_Ledger_Release: 0xe0626f7e, // 收入分配
};

export enum DAOType {
  Visit = 'visit', // 未关注，未加入
  Follow = 'follow', // 已关注，未加入
  Cache = 'cache', // 自己创建，还未提交的DAO，保存在 localStorage
  Join = 'join', // 已加入或自己创建
}
