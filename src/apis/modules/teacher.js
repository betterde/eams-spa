import Vue from 'vue';

export default {
  fetchTeachers(params) {
    return Vue.axios.get('/api/teacher', {
      params: params
    });
  },
  sendInvitation(params) {
    return Vue.axios.post('/api/')
  }
}
