<template>
  <v-container px-0 class="confirm-container" :class="type === TX_TRANSACTION ? 'py-6' : 'py-0'">
    <template v-if="type === TX_TRANSACTION">
      <v-layout wrap align-center mx-6 mb-6>
        <v-flex xs12 class="text_1--text font-weight-bold headline float-left" :class="isLightHeader ? 'text--lighten-3' : ''">
          {{ t('dappTransfer.permission') }}
        </v-flex>
        <v-flex xs12>
          <network-display></network-display>
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <template v-if="transactionCategory === COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM">
          <v-flex xs12 mb-4 mx-6>
            <div class="subtitle-2">{{ t('dappTransfer.sendTo') }}</div>
            <v-divider></v-divider>
            <div>
              <span class="subtitle-2 float-left text_2--text">{{ amountTo }}</span>
            </div>
          </v-flex>
          <v-flex xs12 mb-4 mx-6>
            <div class="subtitle-2">{{ t('dappTransfer.youSend') }}</div>
            <v-divider class="mb-1"></v-divider>
            <div>
              <img class="mr-2 float-left" :src="assetDetails.logo" height="35px" />
              <span class="subtitle-2 float-left text_2--text asset-name">{{ assetDetails.name }}</span>
            </div>
          </v-flex>
        </template>
        <v-flex v-else xs12 mb-4 mx-6>
          <div class="subtitle-2">{{ t('dappTransfer.amount') }}</div>
          <v-divider></v-divider>
          <div>
            <span class="subtitle-2 float-left text_2--text">
              <show-tool-tip
                v-if="[TOKEN_METHOD_APPROVE, TOKEN_METHOD_TRANSFER, TOKEN_METHOD_TRANSFER_FROM].indexOf(transactionCategory) >= 0"
                :address="amountTo"
              >
                {{ displayAmountTo }}
              </show-tool-tip>
              <show-tool-tip v-else-if="[SEND_ETHER_ACTION_KEY, CONTRACT_INTERACTION_KEY].indexOf(transactionCategory) >= 0" :address="receiver">
                {{ displayAmountTo }}
              </show-tool-tip>
              <span v-else class="subtitle-2 float-left text_2--text">{{ displayAmountTo }}</span>
            </span>
            <span class="subtitle-2 float-right">{{ displayAmountValue }}</span>
          </div>
          <div class="caption float-right clearfix">{{ displayAmountConverted }}</div>
        </v-flex>
        <v-flex px-2>
          <TransactionSpeedSelect
            :gas="gasEstimate"
            :displayAmount="value"
            :activeGasPriceConfirm="gasPrice"
            @onSelectSpeed="onSelectSpeed"
            :symbol="'ETH'"
          />
        </v-flex>
        <v-flex xs12 px-6 mt-4 mb-1>
          <div class="subtitle-1 font-weight-bold">{{ t('dappTransfer.total') }}</div>
          <v-divider></v-divider>
          <div>
            <span class="subtitle-2">{{ t('dappTransfer.constOfTrans') }}</span>
            <span class="subtitle-1 float-right primary--text font-weight-bold">{{ costOfTransaction }}</span>
          </div>
          <div v-if="isOtherToken" class="clearfix">
            <span class="subtitle-1 float-right primary--text font-weight-bold">+ {{ significantDigits(this.gasCost) }} ETH</span>
          </div>
          <div class="caption float-right clearfix">{{ costOfTransactionConverted }}</div>
        </v-flex>
        <v-flex xs12 mb-3 mt-3>
          <v-dialog v-model="detailsDialog" width="600px">
            <template v-slot:activator="{ on }">
              <div id="more-details-link" class="subtitle-2 float-right dialog-launcher primary--text mx-6" v-on="on">
                {{ t('dappTransfer.moreDetails') }}
              </div>
            </template>
            <v-card class="pa-4 more-details-container">
              <v-card-text class="text_1--text">
                <v-layout wrap>
                  <v-flex xs4 sm2>
                    {{ t('dappTransfer.rate') }}
                    <span class="float-right mr-4">:</span>
                  </v-flex>
                  <v-flex id="currency-rate" xs8 sm10 class="text_2--text">{{ getCurrencyRate }}</v-flex>
                  <v-flex xs4 sm2>
                    {{ t('dappTransfer.network') }}
                    <span class="float-right mr-4">:</span>
                  </v-flex>
                  <v-flex xs8 sm10 class="text_2--text">
                    <span id="network" class="text-capitalize">{{ networkName }}</span>
                  </v-flex>
                  <v-flex xs4 sm2>
                    {{ t('dappTransfer.type') }}
                    <span class="float-right mr-4">:</span>
                  </v-flex>
                  <v-flex id="type" xs8 sm10 class="text_2--text">{{ header }}</v-flex>
                  <v-flex xs2 v-if="txData || txDataParams !== ''">
                    {{ t('dappTransfer.data') }}
                    <span class="float-right mr-4">:</span>
                  </v-flex>
                  <v-flex xs12 mt-1>
                    <v-card flat color="background_3" v-if="txDataParams !== ''">
                      <v-card-text>
                        <pre>{{ txDataParams }}</pre>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12 mt-4 v-if="txData">
                    <div class="mb-1">Hex {{ t('dappTransfer.data') }}:</div>
                    <v-card flat color="background_3" style="word-break: break-all">
                      <v-card-text>{{ txData }}</v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn id="less-details-link" color="primary" text @click="detailsDialog = false">{{ t('dappTransfer.lessDetails') }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-flex>
        <v-flex xs12 px-6 mb-6 class="text-right" v-if="topUpErrorShow || canShowError">
          <div class="caption error--text">{{ errorMsg }}</div>
          <div class="caption mt-1" v-if="topUpErrorShow">
            {{ t('dappTransfer.pleaseTopup1') }}
            <v-btn color="primary" class="mx-1 px-2 caption" small outlined @click="topUp">{{ t('dappTransfer.pleaseTopup2') }}</v-btn>
            {{ t('dappTransfer.pleaseTopup3') }}
          </div>
        </v-flex>
        <v-flex xs12 px-6 mb-6 v-if="transactionCategory === TOKEN_METHOD_APPROVE">
          <div class="caption error--text">{{ `${t('dappTransfer.byConfirming1')} ${displayAmountValue} ${t('dappTransfer.byConfirming2')}.` }}</div>
        </v-flex>
        <v-layout px-6>
          <v-flex xs6>
            <v-btn block text large class="text_2--text" @click="triggerDeny">{{ t('dappTransfer.cancel') }}</v-btn>
          </v-flex>
          <v-flex xs6>
            <v-dialog v-model="confirmDialog" max-width="550" persistent>
              <template v-slot:activator="{ on }">
                <v-btn id="confirm-btn" :disabled="topUpErrorShow || canShowError" block depressed large color="primary" class="ml-2" v-on="on">
                  {{ t('dappTransfer.confirm') }}
                </v-btn>
              </template>
              <transfer-confirm
                :toAddress="receiver"
                :convertedAmount="displayAmountConverted"
                :displayAmount="displayAmountValue"
                :speedSelected="speed"
                :assetSelected="assetDetails"
                :isNonFungibleToken="isNonFungibleToken"
                :transactionFee="txFees"
                :selectedCurrency="selectedCurrency"
                @onClose="confirmDialog = false"
                @onConfirm="triggerSign"
              ></transfer-confirm>
            </v-dialog>
          </v-flex>
        </v-layout>
      </v-layout>
    </template>

    <template v-if="type === TX_PERSONAL_MESSAGE || type === TX_MESSAGE || type === TX_TYPED_MESSAGE">
      <v-layout wrap align-center mx-6 mb-6>
        <v-flex xs12 class="text_1--text font-weight-bold headline float-left">{{ t('dappTransfer.permissions') }}</v-flex>
        <v-flex xs12>
          <network-display></network-display>
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 mb-6 mx-6>
          <div class="subtitle-2 text_2--text">{{ t('dappTransfer.requestFrom') }}:</div>

          <v-card flat class="grey lighten-3">
            <v-card-text>
              <div class="subtitle-2 primary--text request-from">
                <a :href="originHref" target="_blank">{{ origin }}</a>
                <a :href="originHref" target="_blank" class="float-right">
                  <img :src="require('../../../public/img/icons/open-in-new-grey.svg')" class="card-upper-icon" />
                </a>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs12 mb-4 mx-6>
          <v-list class="note-list">
            <v-list-item class="pa-0">
              <v-list-item-icon class="ma-1">
                <img :src="require(`../../../public/img/icons/check-circle-primary.svg`)" width="12" />
              </v-list-item-icon>
              <v-list-item-content class="pa-1">
                <div class="caption text_2--text">{{ t('dappTransfer.dataSmall') }}</div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="pa-0">
              <v-list-item-content flat class="pa-1 background" :class="$vuetify.theme.dark ? 'lighten-4' : 'lighten-3'">
                <v-card flat class="body-2 text-left pa-2 word-break typedMessageBox">
                  <v-expansion-panels v-if="type === TX_PERSONAL_MESSAGE || type === TX_MESSAGE">
                    <p :class="$vuetify.theme.dark ? 'text_1--text' : 'text_2--text'" style="text-align:left">{{ message }}</p>
                  </v-expansion-panels>

                  <v-expansion-panels v-else-if="type === TX_TYPED_MESSAGE && !Array.isArray(typedMessages)">
                    <v-expansion-panel v-for="(value, index) in typedMessages" :key="index">
                      <v-expansion-panel-header>{{ index }}</v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <vue-json-pretty :path="'res'" :data="value" :showline="true" :deep="5"></vue-json-pretty>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>

                  <v-expansion-panels v-else-if="type === TX_TYPED_MESSAGE && Array.isArray(typedMessages)">
                    <v-expansion-panel>
                      <v-expansion-panel-header>{{ t('dappTransfer.dataSmall') }}</v-expansion-panel-header>
                      <v-expansion-panel-content v-for="value in typedMessages" :key="value">
                        <vue-json-pretty :path="'res'" :data="value" :showline="true" :deep="5"></vue-json-pretty>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-flex>
        <!-- <v-flex xs12 mt-12 mb-5 mx-7>
          <div class="caption text_2--text">
            Note : You may re-adjust the dapp permission later under ‘Settings > Dapp Permission’
          </div>
        </v-flex>-->
        <v-layout px-6 mx-3>
          <v-flex xs6>
            <v-btn block text large class="text_2--text" @click="triggerDeny">{{ t('dappTransfer.cancel') }}</v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn block depressed large color="primary" class="ml-2" @click="triggerSign">{{ t('dappTransfer.confirm') }}</v-btn>
          </v-flex>
        </v-layout>
      </v-layout>
    </template>
    <template v-if="type === 'none'">
      <popup-screen-loader />
    </template>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex' // Maybe dispatch a bc to show popup from that instance
import VueJsonPretty from 'vue-json-pretty'
import { BroadcastChannel } from 'broadcast-channel'
import { numberToHex, fromWei, toChecksumAddress, hexToNumber } from 'web3-utils'
import BigNumber from 'bignumber.js'
import ShowToolTip from '../../components/helpers/ShowToolTip'
import { PopupScreenLoader } from '../../content-loader'
import TransactionSpeedSelect from '../../components/helpers/TransactionSpeedSelect'
import TransferConfirm from '../../components/Confirm/TransferConfirm'
import NetworkDisplay from '../../components/helpers/NetworkDisplay'
import torus from '../../torus'
import { significantDigits, addressSlicer, broadcastChannelOptions } from '../../utils/utils'
import { get } from '../../utils/httpHelpers'
import config from '../../config'
import { isArray } from 'util'

const tokenABI = require('human-standard-token-abi')
const collectibleABI = require('human-standard-collectible-abi')
const contracts = require('eth-contract-metadata')
const log = require('loglevel')

const {
  RPC,
  RPC_DISPLAY_NAME,
  CONTRACT_INTERACTION_KEY,
  DEPLOY_CONTRACT_ACTION_KEY,
  TOKEN_METHOD_APPROVE,
  TOKEN_METHOD_TRANSFER,
  TOKEN_METHOD_TRANSFER_FROM,
  COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM,
  SEND_ETHER_ACTION_KEY,
  SUPPORTED_NETWORK_TYPES,
  TX_MESSAGE,
  TX_TYPED_MESSAGE,
  TX_PERSONAL_MESSAGE,
  TX_TRANSACTION,
  ETH
} = require('../../utils/enums')

const weiInGwei = new BigNumber('10').pow(new BigNumber('9'))

export default {
  name: 'confirm',
  components: {
    PopupScreenLoader,
    TransactionSpeedSelect,
    TransferConfirm,
    VueJsonPretty,
    NetworkDisplay,
    ShowToolTip
  },
  data() {
    return {
      confirmDialog: false,
      detailsDialog: false,
      type: 'none',
      origin: 'unknown',
      originHref: '',
      balance: new BigNumber('0'),
      gasPrice: new BigNumber('10'),
      value: new BigNumber('0'),
      amountTo: '',
      amountValue: '',
      tokenPrice: new BigNumber('0'),
      amountTokenValueConverted: new BigNumber('0'),
      currencyRateDate: '',
      receiver: 'unknown',
      message: '',
      selectedToken: '',
      gasCost: new BigNumber('0'),
      gasEstimate: new BigNumber('0'),
      txData: '',
      txDataParams: '',
      sender: '',
      totalUsdCost: new BigNumber('0'),
      totalEthCost: new BigNumber('0'),
      totalEthCostDisplay: '',
      errorMsg: '',
      topUpErrorShow: false,
      canShowError: false,
      txFees: new BigNumber('0'),
      networkName: '',
      transactionCategory: '',
      dollarValue: new BigNumber('0'),
      speed: '',
      typedMessages: {},
      id: 0,
      isNonFungibleToken: false,
      assetDetails: {},
      COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM,
      TOKEN_METHOD_APPROVE,
      TOKEN_METHOD_TRANSFER,
      TOKEN_METHOD_TRANSFER_FROM,
      SEND_ETHER_ACTION_KEY,
      CONTRACT_INTERACTION_KEY,
      TX_TRANSACTION,
      TX_TYPED_MESSAGE,
      TX_PERSONAL_MESSAGE,
      TX_MESSAGE,
      networks: [
        ...Object.values(SUPPORTED_NETWORK_TYPES),
        {
          networkName: RPC_DISPLAY_NAME,
          host: RPC,
          chainId: ''
        }
      ]
    }
  },
  computed: {
    selectedCurrency() {
      return this.$store.state.selectedCurrency
    },
    header() {
      switch (this.transactionCategory) {
        case DEPLOY_CONTRACT_ACTION_KEY:
          // return 'Contract Deployment'
          return this.t('dappTransfer.deploy')
          break
        case CONTRACT_INTERACTION_KEY:
          return this.getHeaderByDapp()
          break
        case COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM:
          // return 'ERC721 SafeTransferFrom'
          return this.t('dappTransfer.collectibleSafe')
          break
        case TOKEN_METHOD_APPROVE:
          // return 'ERC20 Approve'
          return this.t('dappTransfer.approve')
          break
        case TOKEN_METHOD_TRANSFER:
        case SEND_ETHER_ACTION_KEY:
          // return 'ERC2O Transfer'
          // return 'Send Ether'
          return this.t('dappTransfer.transfer')
          break
        case TOKEN_METHOD_TRANSFER_FROM:
          // return 'ERC2O Transfer From'
          return this.t('dappTransfer.transferFrom')
          break
        default:
          // return 'Transaction Request'
          return this.t('dappTransfer.transaction')
          break
      }
    },
    isLightHeader() {
      return [DEPLOY_CONTRACT_ACTION_KEY, CONTRACT_INTERACTION_KEY].indexOf(this.transactionCategory) >= 0
    },
    displayAmountTo() {
      switch (this.transactionCategory) {
        case TOKEN_METHOD_APPROVE:
        case TOKEN_METHOD_TRANSFER:
        case TOKEN_METHOD_TRANSFER_FROM:
          return `${this.t('dappTransfer.to')}: ${this.slicedAddress(this.amountTo)}`
          break
        case SEND_ETHER_ACTION_KEY:
        case CONTRACT_INTERACTION_KEY:
          return `${this.t('dappTransfer.to')}: ${this.slicedAddress(this.receiver)}`
          break
        case DEPLOY_CONTRACT_ACTION_KEY:
          return this.t('dappTransfer.newContract')
          break
        default:
          return this.t('dappTransfer.transactionRequest')
          break
      }
    },
    displayAmountValue() {
      switch (this.transactionCategory) {
        case TOKEN_METHOD_APPROVE:
        case TOKEN_METHOD_TRANSFER:
        case TOKEN_METHOD_TRANSFER_FROM:
          return `${this.amountDisplay(this.amountValue)} ${this.selectedToken}`
          break
        case COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM:
          return `ID: ${this.amountValue}`
          break
        case SEND_ETHER_ACTION_KEY:
        case CONTRACT_INTERACTION_KEY:
          return `${this.amountDisplay(this.value)} ETH`
          break
        case DEPLOY_CONTRACT_ACTION_KEY:
          return this.t('dappTransfer.notApplicable')
          break
        default:
          return this.t('dappTransfer.transactionRequest')
          break
      }
    },
    displayAmountConverted() {
      switch (this.transactionCategory) {
        case TOKEN_METHOD_APPROVE:
        case TOKEN_METHOD_TRANSFER:
        case TOKEN_METHOD_TRANSFER_FROM:
          return `~ ${significantDigits(this.amountTokenValueConverted)} ${this.selectedCurrency}`
          break
        case SEND_ETHER_ACTION_KEY:
        case CONTRACT_INTERACTION_KEY:
          return `~ ${this.dollarValue} ${this.selectedCurrency}`
          break
        case DEPLOY_CONTRACT_ACTION_KEY:
          return ''
          break
        default:
          return ''
          break
      }
    },
    costOfTransaction() {
      if ([TOKEN_METHOD_APPROVE, TOKEN_METHOD_TRANSFER, TOKEN_METHOD_TRANSFER_FROM].indexOf(this.transactionCategory) >= 0) {
        return `${this.displayAmountValue}`
      } else {
        return `${this.totalEthCostDisplay} ETH`
      }
    },
    isOtherToken() {
      return [TOKEN_METHOD_APPROVE, TOKEN_METHOD_TRANSFER, TOKEN_METHOD_TRANSFER_FROM].indexOf(this.transactionCategory) >= 0
      //`+ ${significantDigits(this.gasCost)}`
    },
    costOfTransactionConverted() {
      const totalCost = this.isOtherToken
        ? significantDigits(this.totalUsdCost + this.amountTokenValueConverted.toNumber(), false, 5)
        : this.totalUsdCost
      return `~ ${totalCost} ${this.selectedCurrency}`
    },
    imageType() {
      return this.transactionCategory === DEPLOY_CONTRACT_ACTION_KEY || this.transactionCategory === CONTRACT_INTERACTION_KEY
        ? 'images/file-signature.svg'
        : 'images/user.svg'
    },
    getCurrencyMultiplier() {
      const { selectedCurrency, currencyData } = this.$store.state || {}
      const currencyMultiplierNum = selectedCurrency !== 'ETH' ? currencyData[selectedCurrency.toLowerCase()] || 1 : 1
      const currencyMultiplier = new BigNumber(currencyMultiplierNum)
      return currencyMultiplier
    },
    getCurrencyRate() {
      const ethConverted = this.getCurrencyMultiplier
      const tokenPriceConverted = this.isOtherToken ? this.tokenPrice : ethConverted
      const selectedToken = this.isOtherToken ? this.selectedToken : 'ETH'
      return `1 ${selectedToken} = ${significantDigits(tokenPriceConverted)} ${this.selectedCurrency} @ ${this.currencyRateDate}`
    }
  },
  watch: {
    gasPrice: function(newGasPrice, oldGasPrice) {
      if (!newGasPrice.eq(oldGasPrice)) {
        this.gasCost = newGasPrice.times(this.gasEstimate).div(new BigNumber('10').pow(new BigNumber('9')))
        this.txFees = this.gasCost.times(this.getCurrencyMultiplier)
        const ethCost = this.value.plus(this.gasCost)
        this.totalEthCost = ethCost // significantDigits(ethCost.toFixed(5), false, 3) || 0
        const gasCostLength = Math.max(significantDigits(this.gasCost).toString().length, significantDigits(ethCost).toString().length)
        this.totalEthCostDisplay = significantDigits(ethCost, false, gasCostLength - 2)
        this.totalUsdCost = significantDigits(ethCost.times(this.getCurrencyMultiplier))
        if (this.balance.lt(ethCost) && !this.canShowError) {
          this.errorMsg = this.t('dappTransfer.insufficientFunds')
          this.topUpErrorShow = true
        }
      }
    }
  },
  methods: {
    slicedAddress(user) {
      return addressSlicer(user) || '0x'
    },
    async triggerSign(event) {
      var bc = new BroadcastChannel(`torus_channel_${new URLSearchParams(window.location.search).get('instanceId')}`, broadcastChannelOptions)
      var gasHex = '0x' + this.gasPrice.times(weiInGwei).toString(16)
      await bc.postMessage({
        name: 'tx-result',
        data: { type: 'confirm-transaction', gasPrice: gasHex, id: this.id, txType: this.type }
      })
      bc.close()
    },
    async triggerDeny(event) {
      var bc = new BroadcastChannel(`torus_channel_${new URLSearchParams(window.location.search).get('instanceId')}`, broadcastChannelOptions)
      await bc.postMessage({ name: 'tx-result', data: { type: 'deny-transaction', id: this.id, txType: this.type } })
      bc.close()
    },
    topUp() {
      this.$store.dispatch('showWalletPopup', { path: '/topup' })
    },
    onSelectSpeed(data) {
      this.speedSelected = data.speedSelected
      this.gasPrice = data.activeGasPrice
      this.speed = data.speed
      this.gas = data.gas

      if (data.isReset) {
        this.gasPrice = this.speedSelected === '' ? '' : this.gasPrice
      }
    },
    getNetworkName(targetNetwork) {
      const foundNetwork = this.networks.find(network => network.host === targetNetwork)
      if (!foundNetwork || foundNetwork === -1) return this.t('dappTransfer.unknownNetwork')
      return Object.prototype.hasOwnProperty.call(foundNetwork, 'networkName') ? foundNetwork.networkName : this.t('dappTransfer.unknownNetwork')
    },
    getDate() {
      const currentDateTime = new Date()
      let hours = currentDateTime.getHours()
      let minutes = currentDateTime.getMinutes()
      let seconds = currentDateTime.getSeconds()
      const ampm = hours >= 12 ? 'PM' : 'AM'

      hours = hours % 12
      hours = hours || 12
      return `${hours}:${minutes}:${seconds} ${ampm}`
    },
    amountDisplay(amount) {
      return significantDigits(amount || new BigNumber('0'))
    },
    significantDigits: significantDigits,
    getHeaderByDapp() {
      // For partner integration
      if (this.origin === 'www.etheremon.com') {
        return this.t('dappTransfer.claimMon')
      }
      return this.t('dappTransfer.contractInteraction')
    },
    ...mapActions({})
  },
  mounted() {
    // get eth balance from store
    const queryParams = new URLSearchParams(window.location.search)
    const instanceId = queryParams.get('instanceId')
    const queryParamId = queryParams.get('id')
    var bc = new BroadcastChannel(`torus_channel_${instanceId}`, broadcastChannelOptions)
    bc.onmessage = async ev => {
      if (ev.name !== 'send-params') return
      if (ev.data && ev.data.txParams && ev.data.txParams.id.toString() !== queryParamId) return
      bc.close()
      const { type, msgParams, txParams, origin, balance } = ev.data || {}
      this.balance = new BigNumber(balance)
      let url = { hostname: '', href: '' }
      try {
        url = new URL(origin)
      } catch (err) {
        log.info(err)
      }
      log.info({ msgParams, txParams })
      this.originHref = url.href
      this.origin = url.hostname // origin of tx: website url
      if (type !== TX_TRANSACTION) {
        var { message, typedMessages } = msgParams.msgParams || {}
        if (typedMessages) {
          try {
            typedMessages = JSON.parse(typedMessages)
          } catch (e) {
            log.error(e)
          }
        }
        const { id } = msgParams || {}
        this.id = id
        this.message = message
        this.typedMessages = typedMessages
      } else {
        let finalValue = new BigNumber('0')
        let { simulationFails, network, id, transactionCategory, methodParams, contractParams, txParams: txObject } = txParams || {}
        const { value, to, data, from: sender, gas, gasPrice } = txObject || {}
        const { reason } = simulationFails || {}
        if (value) {
          finalValue = new BigNumber(fromWei(value.toString()))
        }
        this.origin = this.origin.trim().length === 0 ? this.t('dappTransfer.wallet') : this.origin
        // Get ABI for method
        let txDataParams = ''
        if (contractParams.erc721) {
          txDataParams = collectibleABI.find(item => item.name && item.name.toLowerCase() === transactionCategory) || ''
        } else if (contractParams.erc20) {
          txDataParams = collectibleABI.find(item => item.name && item.name.toLowerCase() === transactionCategory) || ''
        }
        // Get Params from method type ABI
        let amountTo, amountValue, amountFrom
        if (methodParams && isArray(methodParams)) {
          if (transactionCategory === TOKEN_METHOD_TRANSFER_FROM || transactionCategory === COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM)
            [amountFrom, amountTo, amountValue] = methodParams || []
          else [amountTo, amountValue] = methodParams || []
        }
        log.info(methodParams, 'params')
        const checkSummedTo = toChecksumAddress(to)
        const tokenObj = contractParams
        const decimals = new BigNumber(tokenObj.decimals || '0')
        this.selectedToken = tokenObj.symbol || 'ERC20'
        this.id = id
        this.networkName = this.getNetworkName(network)
        this.transactionCategory = transactionCategory
        var gweiGasPrice = new BigNumber(hexToNumber(gasPrice)).div(weiInGwei)
        // sending to who
        this.amountTo = amountTo ? amountTo.value : checkSummedTo
        // sending what value
        this.amountValue = amountValue ? new BigNumber(amountValue.value).div(new BigNumber(10).pow(new BigNumber(decimals))) : new BigNumber('0')
        // Get token and collectible info
        if (methodParams && contractParams.erc20) {
          const { tokenRates, selectedCurrency } = this.$store.state
          let tokenRateMultiplier = tokenRates[checkSummedTo.toLowerCase()]
          if (!tokenRateMultiplier) {
            const pairs = checkSummedTo
            const query = `contract_addresses=${pairs}&vs_currencies=eth`
            let prices = {}
            try {
              prices = await get(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?${query}`)
              tokenRateMultiplier = //token price in eth
                prices[checkSummedTo.toLowerCase()] && prices[checkSummedTo.toLowerCase()].eth ? prices[checkSummedTo.toLowerCase()].eth : 0
            } catch (error) {
              log.info(error)
            }
          }
          this.tokenPrice = new BigNumber(tokenRateMultiplier)
          this.amountTokenValueConverted = this.tokenPrice.times(this.amountValue).times(this.getCurrencyMultiplier)
        } else if (methodParams && contractParams.erc721) {
          log.info(methodParams, contractParams)
          this.isNonFungibleToken = true
          let assetDetails = {}
          try {
            const url = `https://api.opensea.io/api/v1/asset/${checkSummedTo}/${this.amountValue}`
            assetDetails = await get(`${config.api}/opensea?url=${url}`, {
              headers: {
                Authorization: `Bearer ${this.$store.state.jwtToken}`
              }
            })
            this.assetDetails = {
              name: assetDetails.data.name || '',
              logo: assetDetails.data.image_thumbnail_url || ''
            }
          } catch (error) {
            log.info(error)
          }
        }
        this.currencyRateDate = this.getDate()
        this.receiver = to // address of receiver
        this.value = finalValue // value of eth sending
        this.dollarValue = significantDigits(finalValue.times(this.getCurrencyMultiplier))
        this.gasPrice = gweiGasPrice // gas price in gwei
        this.balanceUsd = significantDigits(this.balance.times(this.getCurrencyMultiplier)) // in usd
        this.gasEstimate = new BigNumber(hexToNumber(gas)) // gas number
        this.txData = data // data hex
        this.txDataParams = txDataParams !== '' ? JSON.stringify(txDataParams, null, 2) : ''
        this.sender = sender // address of sender
        this.gasCost = gweiGasPrice.times(this.gasEstimate).div(new BigNumber('10').pow(new BigNumber('9')))
        this.txFees = this.gasCost.times(this.getCurrencyMultiplier)
        const ethCost = finalValue.plus(this.gasCost)
        this.totalEthCost = ethCost // significantDigits(ethCost.toFixed(5), false, 3) || 0
        const gasCostLength = Math.max(significantDigits(this.gasCost).toString().length, significantDigits(ethCost).toString().length)
        this.totalEthCostDisplay = significantDigits(ethCost, false, gasCostLength - 2)
        this.totalUsdCost = significantDigits(ethCost.times(this.getCurrencyMultiplier))
        if (reason) {
          this.errorMsg = this.t(reason)
          this.canShowError = true
        }
        if (this.balance.lt(ethCost) && !this.canShowError) {
          this.errorMsg = this.t('dappTransfer.insufficientFunds')
          this.topUpErrorShow = true
        }
      }
      this.type = type // type of tx
    }
    bc.postMessage({ name: 'popup-loaded', data: { id: queryParamId } })
  }
}
</script>

<style lang="scss" scoped>
@import 'Confirm.scss';
</style>
