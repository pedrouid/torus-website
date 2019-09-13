const ROPSTEN = 'ropsten'
const RINKEBY = 'rinkeby'
const KOVAN = 'kovan'
const MAINNET = 'mainnet'
const LOCALHOST = 'localhost'
const GOERLI = 'goerli'
const RPC = 'rpc'
const MATIC = 'matic'

const MAINNET_CODE = 1
const ROPSTEN_CODE = 3
const RINKEYBY_CODE = 4
const KOVAN_CODE = 42
const GOERLI_CODE = 5
const MATIC_CODE = 1

const ROPSTEN_DISPLAY_NAME = 'Ropsten Test Network'
const RINKEBY_DISPLAY_NAME = 'Rinkeby Test Network'
const KOVAN_DISPLAY_NAME = 'Kovan Test Network'
const MAINNET_DISPLAY_NAME = 'Main Ethereum Network'
const GOERLI_DISPLAY_NAME = 'Goerli Test Network'
const RPC_DISPLAY_NAME = 'RPC'
const LOCALHOST_DISPLAY_NAME = 'localhost:8545'
const MATIC_DISPLAY_NAME = 'Matic Alpha-Mainnet'

const MATIC_URL = 'https://alpha.ethereum.matic.network'

const TRANSACTION_TYPE_CANCEL = 'cancel'
const TRANSACTION_TYPE_RETRY = 'retry'
const TRANSACTION_TYPE_STANDARD = 'standard'

const TRANSACTION_STATUS_APPROVED = 'approved'
const TRANSACTION_STATUS_CONFIRMED = 'confirmed'

const TOKEN_METHOD_TRANSFER = 'transfer'
const TOKEN_METHOD_APPROVE = 'approve'
const TOKEN_METHOD_TRANSFER_FROM = 'transferfrom'

const SEND_ETHER_ACTION_KEY = 'sentEther'
const DEPLOY_CONTRACT_ACTION_KEY = 'contractDeployment'
const CONTRACT_INTERACTION_KEY = 'contractInteraction'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const ACTIVE = 'active'
const INACTIVE = 'inactive'

const USER_INFO_REQUEST_APPROVED = 'user_info_request_approved'
const USER_INFO_REQUEST_REJECTED = 'user_info_request_rejected'
const USER_INFO_REQUEST_NEW = 'user_info_request_new'

const WALLET_HEADERS_HOME = 'My Wallet'
const WALLET_HEADERS_TRANSFER = 'Transfer Details'
const WALLET_HEADERS_ACTIVITY = 'Transaction Activities'

const ACTIVITY_ACTION_ALL = 'All Transactions'
const ACTIVITY_ACTION_SEND = 'Send'
const ACTIVITY_ACTION_RECEIVE = 'Receive'
const ACTIVITY_ACTION_TOPUP = 'Top up'

const ACTIVITY_PERIOD_ALL = 'All'
const ACTIVITY_PERIOD_WEEK_ONE = 'Last 1 Week'
const ACTIVITY_PERIOD_MONTH_ONE = 'Last 1 Month'
const ACTIVITY_PERIOD_MONTH_SIX = 'Last 6 Months'

module.exports = {
  ROPSTEN,
  RINKEBY,
  KOVAN,
  MAINNET,
  LOCALHOST,
  GOERLI,
  RPC,
  MAINNET_CODE,
  ROPSTEN_CODE,
  RINKEYBY_CODE,
  GOERLI_CODE,
  KOVAN_CODE,
  ROPSTEN_DISPLAY_NAME,
  RINKEBY_DISPLAY_NAME,
  KOVAN_DISPLAY_NAME,
  MAINNET_DISPLAY_NAME,
  GOERLI_DISPLAY_NAME,
  RPC_DISPLAY_NAME,
  LOCALHOST_DISPLAY_NAME,
  TRANSACTION_TYPE_CANCEL,
  TRANSACTION_TYPE_RETRY,
  TRANSACTION_TYPE_STANDARD,
  TRANSACTION_STATUS_APPROVED,
  TRANSACTION_STATUS_CONFIRMED,
  ZERO_ADDRESS,
  TOKEN_METHOD_APPROVE,
  TOKEN_METHOD_TRANSFER,
  TOKEN_METHOD_TRANSFER_FROM,
  SEND_ETHER_ACTION_KEY,
  DEPLOY_CONTRACT_ACTION_KEY,
  CONTRACT_INTERACTION_KEY,
  MATIC_URL,
  MATIC_DISPLAY_NAME,
  MATIC,
  MATIC_CODE,
  ACTIVE,
  INACTIVE,
  USER_INFO_REQUEST_APPROVED,
  USER_INFO_REQUEST_REJECTED,
  USER_INFO_REQUEST_NEW,
  WALLET_HEADERS_HOME,
  WALLET_HEADERS_TRANSFER,
  WALLET_HEADERS_ACTIVITY,
  ACTIVITY_ACTION_ALL,
  ACTIVITY_ACTION_SEND,
  ACTIVITY_ACTION_RECEIVE,
  ACTIVITY_ACTION_TOPUP,
  ACTIVITY_PERIOD_ALL,
  ACTIVITY_PERIOD_WEEK_ONE,
  ACTIVITY_PERIOD_MONTH_ONE,
  ACTIVITY_PERIOD_MONTH_SIX
}
