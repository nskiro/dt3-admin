import axios from 'axios';

const axiosInst = axios.create({
    //baseURL: 'http://vps159788.vps.ovh.ca:5000'
    //baseURL: 'http://localhost:5000'
    baseURL: window.location.protocol + '//' + window.location.hostname + ':5000/'
});

axiosInst.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axiosInst.defaults.headers.common['Authorization'] = localStorage.getItem('token') !== null ? 'Bearer ' + localStorage.getItem('token') : null;

export default axiosInst;