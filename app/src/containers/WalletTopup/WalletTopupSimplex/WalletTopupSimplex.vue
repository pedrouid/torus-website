<template>
  <WalletTopupBase
    selectedProvider="simplex"
    @fetchQuote="fetchQuote"
    @sendOrder="sendOrder"
    @clearQuote="clearQuote"
    :cryptoCurrencyValue="cryptoCurrencyValue"
    :currencyRate="currencyRate"
  />
</template>

<script>
import throttle from 'lodash.throttle'
import WalletTopupBase from '../../../components/WalletTopup/WalletTopupBase'
import log from 'loglevel'

export default {
  components: {
    WalletTopupBase
  },
  data() {
    return {
      cryptoCurrencyValue: 0,
      currencyRate: 0,
      currentOrder: {}
    }
  },
  methods: {
    fetchQuote(payload) {
      const self = this
      throttle(() => {
        self.$store
          .dispatch('fetchSimplexQuote', payload)
          .then(result => {
            self.cryptoCurrencyValue = result.result.digital_money.amount
            self.currencyRate = result.result.digital_money.amount / result.result.fiat_money.total_amount
            self.currentOrder = result.result
          })
          .catch(err => log.error(err))
      }, 0)()
    },
    sendOrder(cb) {
      cb(this.$store.dispatch('fetchSimplexOrder', { currentOrder: this.currentOrder }))
    },
    clearQuote(payload) {
      this.cryptoCurrencyValue = 0
      this.currencyRate = 0
      this.currentOrder = {}
      this.fetchQuote(payload)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupSimplex.scss';
</style>
