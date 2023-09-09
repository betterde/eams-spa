import Vue from 'vue';

export default {
  fetchStudents(params) {
    return Vue.axios.get('/api/student', {
      params: params
    });
  },
  createStudent(params) {
    return Vue.axios.post('/api/student', params);
  },
  fetchStudent(id) {
    return Vue.axios.get(`/api/student/${id}`);
  }
}
