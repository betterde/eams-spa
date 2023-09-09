import Vue from 'vue';

export default {
  fetchPlatform(params) {
    return Vue.axios.get('/api/system/oauth/platform', {
      params: params
    });
  }
}
