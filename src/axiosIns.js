import axios from 'axios'

const axiosInst = axios.create({
  baseURL: window.location.protocol + '//' + window.location.hostname + ':5000/',
})

axiosInst.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

export default axiosInst
