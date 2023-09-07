import Vue from 'vue'

export default {
    fetchSchools(params) {
        return Vue.axios.get('/api/school', {
            params: params
        });
    },
    createServer(params) {
        return Vue.axios.post('/api/server', params);
    },
    fetchSchool(id) {
      return Vue.axios.get(`/api/school/${id}`);
    },
    updateServer(id, params) {
        return Vue.axios.put(`/api/server/${id}`, params)
    },
    deleteServer(id) {
        return Vue.axios.delete(`/api/server/${id}`);
    }
}
