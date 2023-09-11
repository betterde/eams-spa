import Vue from 'vue'

export default {
    fetchSchools(params) {
        return Vue.axios.get('/api/school', {
            params: params
        });
    },
    createSchool(params) {
        return Vue.axios.post('/api/school', params);
    },
    fetchSchool(id) {
      return Vue.axios.get(`/api/school/${id}`);
    },
    deleteSchool(id) {
        return Vue.axios.delete(`/api/school/${id}`);
    }
}
