import axios from 'axios'
import $qs from 'qs'
import {MessageBox} from 'element-ui'

axios.defaults.headers.common['retry'] = 2
axios.defaults.headers.common['retryDelay'] = 1
axios.defaults.headers.common['retryCount'] = 0

axios.defaults.withCredentials=true;

axios.defaults.timeout = 30000;
//axios.defaults.baseURL = "/api"

axios.interceptors.response.use(function (response) {
    if(response.data.code == 401){
        MessageBox.alert("登录超时，请重新登录!");
        window.location.href="/"
    }
    return response;
}, function axiosRetryInterceptor(err) {
    var config = err.config;
    // If config does not exist or the retry option is not set, reject
    if(!config || !config.headers.retry) return Promise.reject(err);

    // Set the variable for keeping track of the retry count
    config.retryCount = config.retryCount || 0;

    // Check if we've maxed out the total number of retries
    //console.log(config.headers.retryCount)
    if(config.headers.retryCount >= config.headers.retry) {
        // Reject with the error
        return Promise.reject(err);
    }
    // Increase the retry count
    config.headers.retryCount += 1;
    // Create new promise to handle exponential backoff
    var backoff = new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, config.headers.retryDelay || 1);
    });

    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
        return axios(config);
    });
});

export default {
    post(url,data={},config={}){
        return new Promise((resolve,reject) => {
            axios.post("/api"+url,$qs.stringify(data),config)
                .then(response => {
                    resolve(response.data);
                },err => {
                    reject(err)
                })
        })
    },
    relPost(url,data,config){
        return new Promise((resolve,reject) => {
            axios.post("/api"+url,data,config)
                .then(response => {
                    resolve(response.data);
                },err => {
                    reject(err)
                })
        })
    },
    jsonPost(url,data,config){
        return new Promise((resolve,reject) => {
            axios.post("/api"+url,JSON.stringify(data),config)
                .then(response => {
                    resolve(response.data);
                },err => {
                    reject(err)
                })
        })
    },
    get(url,params={},config){
        return new Promise((resolve,reject) => {
            axios.get("/api"+url,config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    all(axiosList=[]){
        return new Promise((resolve,reject) => {
            axios.all(axiosList).then(function (res) {
                resolve(res);
            }).catch(err => {
                reject(err)
            })
        })
    }
}