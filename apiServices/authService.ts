import { apiRequest } from "@/lib/axios";
import { AppDispatch } from "@/store/store";
import { setUser, loginSuccess, loginFailure, logout,  } from "@/slice/authSlice";


interface OtpData {
    name: string,
    email: string,
    password?: string,
    confirmPassword?: string,
    otp?: string
}

export const sendRegistrationOtp = async (data: OtpData, dispatch: AppDispatch) => {
    try {
        const response = await apiRequest({
        url: "/api/register-user",
        data,
        method: "POST"
    });
    if(response.success){
        dispatch(setUser(data));
        return response;
    }
    return response;
    } catch (error) {
        return error;
    }
}

export const verifyUserEmailHandler = async (data: OtpData, otp: string) => {
    try {
        const response = await apiRequest({
            url: "/api/verify-user",
            data: {...data, otp},
            method: "POST"
        });
        console.log("Response of verifyUserEmailHandler:", response);
        if(response?.success){
            return response;
        }
        return response;
    } catch (error) {
        return error;
    }
}

export const loginHandler = async (data: OtpData, dispatch: AppDispatch) => {
  try {
    const response = await apiRequest({
      url: "/api/login",
      data,
      method: "POST",
    });
    console.log("response of loginHandler:", response);
    if(response?.success){
        dispatch(loginSuccess({email: data?.email}));
        await fetchCurrentUser(dispatch);
    }
    if(!response?.success){
        dispatch(loginFailure(response?.message))
    }
    return response;
  } catch (error) {
    return error;
  }
};

export const fetchCurrentUser = async(dispatch: AppDispatch) => {
    try {
        const response = await apiRequest({
            url: "/api/me",
            method: "GET"
        });
        if(response?.success){
            dispatch(loginSuccess(response.user))
        }else{
            dispatch(logout());
        }
    } catch (error) {
        console.error("Error fetching current user:", error);
        dispatch(logout());
    }
}
