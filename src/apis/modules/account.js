import Vue from 'vue'

export default {
  register(query, params) {
    if (query.email && query.signature) {
      return Vue.axios.post(`/api/auth/register?email=${query.email}&school=${query.school}&expires=${query.expires}&signature=${query.signature}`, params);
    } else {
      return Vue.axios.post('/api/auth/register', params);
    }
  },
  forgot(params) {
    return Vue.axios.post('/api/auth/password/email', params);
  },
  resetPassword(params) {
    return Vue.axios.post('/api/auth/password/reset', params);
  },
  /**
   * User sign in
   * @param params
   * @returns {AxiosPromise<any>}
   */
  signin(params) {
    return Vue.axios.post('/api/auth/password', params);
  },
  /**
   * Get uset token by third platform
   * @param params
   * @returns {*}
   */
  verification(params) {
    return Vue.axios.post('/api/auth/issue', params);
  },
  /**
   * Fetch user profile
   * @returns {AxiosInstance}
   */
  profile() {
    return Vue.axios.get('/api/account/profile');
  },
  /**
   * Modify password
   * @param params
   * @returns {*}
   */
  password(params) {
    return Vue.axios.post('/api/profile/password', params);
  },
  /**
   * Modify address
   * @param params
   * @returns {*}
   */
  address(params) {
    return Vue.axios.post('/api/profile/address', params);
  }
}
