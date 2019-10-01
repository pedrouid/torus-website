<template>
  <v-layout wrap>
    <span>Coindirect is the easiest and most trusted place to buy, sell, and convert your cryptocurrency in Singapore.</span>

    <div style="height:500px; width:100%">
      <iframe v-if="loaded" :src="url" height="100%" width="100%" style="border:none"></iframe>
    </div>
  </v-layout>
</template>

<script>
import config from '../../../config'
const { coindirectTestHost, coindirectLiveHost, coindirectTestMerchantID, coindirectLiveMerchantID, coindirectTestURL, coindirectLiveURL } = config

export default {
  data() {
    return {
      url: '',
      loaded: false,
      currencyCode: 'eth',
      // Modify before deploying.
      path: coindirectLiveHost,
      merchantId: coindirectLiveMerchantID,
      redirectURL: coindirectLiveURL
    }
  },
  mounted() {
    this.url =
      this.path +
      '&email=' +
      this.$store.state.userInfo.email +
      '&merchantId=' +
      this.merchantId +
      '&to=' +
      this.currencyCode +
      '&address=' +
      this.$store.state.selectedAddress +
      '&url=' +
      encodeURIComponent(this.redirectURL)
    this.loaded = true
  }
}
</script>
<style lang="scss" scoped>
@import 'WalletTopupCoinDirect.scss';
</style>
