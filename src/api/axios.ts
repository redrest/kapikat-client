import axios from "axios";

const api = axios.create({
    baseURL: "http://79.141.66.2",
    withCredentials: true,
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    res => res,
    async (err) => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(Promise.reject);
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await api.post('/auth/refresh');
                const newAccessToken = data.accessToken;
                localStorage.setItem('token', newAccessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem('token');
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(err);
    }
);


const token = localStorage.getItem("token");
if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
