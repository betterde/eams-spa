import Vue from 'vue';

export default {
  fetchTeachers(params) {
    return Vue.axios.get('/api/teacher', {
      params: params
    });
  },
  changeFollowStatus(params) {
    return Vue.axios.put('/api/teacher/follow', params);
  },
  fetchFollowers(params) {
    return Vue.axios.get('/api/teacher/followers', params);
  }
}
