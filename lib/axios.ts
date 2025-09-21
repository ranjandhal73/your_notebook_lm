import axios, {AxiosError} from "axios";

type FailedRequest = {
    resolve: (value?: unknown) => void;
    reject: (value?: unknown) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 30000,
});

//flag to track refresh
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        console.log("Prom inside axios:", prom);
        if(error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
}

// Response interceptor to catch 401s
api.interceptors.response.use((res)=>res, async (err)=> {
    const originalRequest = err.config;

    if(err.response?.status === 401 && originalRequest._retry !== true) {
        if(isRefreshing){
            return new Promise((resolve, reject) => {
                failedQueue.push({resolve, reject});
            })
            .then(()=> api(originalRequest))
            .catch((error)=> Promise.reject(error));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            await api.get("/api/refresh");
            processQueue(null);
            return api(originalRequest);
        } catch (refreshErr) {
            processQueue(refreshErr, null);

            if(typeof window !== "undefined"){
                sessionStorage.removeItem("");
                console.log("Need to remove the token from here")
            }

            return Promise.reject(refreshErr)
        } finally {
            isRefreshing = false;
        }
    }
    return Promise.reject(err);
})

// Helper function for calling the APIs
export const apiRequest = async ({
    url,
    method = "GET",
    data,
    params,
    headers = {},
}:{
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    data?: unknown;
    params?: unknown;
    headers?: Record<string, string>;
}) => {
    try {
        const res = await api({
            method,
            url,
            data,
            params,
            headers
        });
        return res.data;
    } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        const message = err?.response?.data?.message || "Something went wrong";
        console.error("API Error:", error);
        console.error("API Error:", message);
        return {
            success: false,
            message
        }
    }
}
export default api;