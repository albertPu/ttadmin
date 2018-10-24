import axios from "axios";
import * as Qs from "qs";

var axiosConfig = axios.create({
    baseURL: 'http://localhost:8080/admin',
    timeout: 10000,
    headers: {
        'X-Token': sessionStorage.removeItem('token') === undefined ? "" : sessionStorage.removeItem('token')
    }
});

export default {
    login: function (username, password) {
        const data = Qs.stringify({
            username: username,
            password: password
        });
        return axiosConfig({
            method: 'post',
            url: '/login',
            data
        }).then(res => res.data)
    },
    addVideo: function (data) {
        return axiosConfig({
            method: 'post',
            url: '/addVideo',
            data
        }).then(res => res.data)
    }, queryVideo: function (data) {
        return axiosConfig({
            method: 'post',
            url: '/videoQuery',
            data
        }).then(res => res.data)
    }, queryVideoByName(name) {
        const data = Qs.stringify({
            videoName: name,
        });
        return axiosConfig({
            method: 'post',
            url: '/queryByName',
            data
        }).then(res => res.data)
    }, deleteVideo: function (id) {
        const data = Qs.stringify({
            id: id,
        });
        return axiosConfig({
            method: 'post',
            url: '/deleteVideo',
            data
        }).then(res => res.data)
    }, getConfig: function () {
        return axiosConfig({
            method: 'get',
            baseURL: 'http://localhost:8080',
            url: '/config.json',
        }).then(res => res.data)
    }, queryDiscuss: function (videoId) {
        var data = {
            videoId: videoId
        };
        return axiosConfig({
            method: 'post',
            url: '/queryDiscuss',
            data
        }).then(res => res.data)
    }, addDiscuss(data) {
        return axiosConfig({
            method: 'post',
            url: '/addDiscuss',
            data
        }).then(res => res.data)
    }, deleteDiscuss(discussId) {
        const data = Qs.stringify({
            id: discussId,
        });
        return axiosConfig({
            method: 'post',
            url: '/deleteDiscuss',
            data
        }).then(res => res.data)
    }, queryShuffling: function (data) {
        return axiosConfig({
            method: 'post',
            url: '/queryShuffling',
            data
        }).then(res => res.data)
    }, addShuffling: function (data) {
        return axiosConfig({
            method: 'post',
            url: '/addShuffling',
            data
        }).then(res => res.data)
    }, deleteShuffling: function (id) {
        const data = Qs.stringify({
            id: id,
        });
        return axiosConfig({
            method: 'post',
            url: '/deleteShuffling',
            data
        }).then(res => res.data)
    }

}

//
// export const requestLogin = params => {
//     var data = Qs.stringify({
//         username: params.username,
//         password: params.password
//     });
//     return axios({
//         method: 'post',
//         url: '/login',
//         headers: {
//             "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8'
//         },
//         data
//     }).then(res => res.data);
// };
