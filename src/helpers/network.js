import axios from 'axios';

export class Network {

    constructor(url = 'http://localhost:3000'){
        this.axios = axios.create();
        this.axios.interceptors.request.use(config => {
            config.url = `${url}${config.url}`;
            return config;
        });
    }

    async get(url, params = {}){
        return this.axios.get(url, { params });
    }

    async post(url, body = {}, params = {}){
        return this.axios.post(url, body, params);
    }

}

export default new Network();