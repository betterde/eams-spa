import Vue from 'vue';

export default {
  fetchMessages(params) {
    return Vue.axios.get('/api/message/history', {
      params: params
    })
  },
  sendMessage(params) {
    return Vue.axios.post('/api/message/send', params)
  }
}