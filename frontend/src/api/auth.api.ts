import api from "./axios" ; 

const BASE_URL = import.meta.env.VITE_API_BASE_URL ; 

export const adminLogin = (email: string, password: string, rememberMe: boolean) => {
    return api.post(
        `${BASE_URL}/api/auth/admin/login`, 
        { email, password, rememberMe }
    )
}

export const getMe = () => {
    return api.get(
        `${BASE_URL}/api/auth/me`
    ) ; 
}

export const logout = async () => {
    return api.post(
        `${BASE_URL}/api/auth/logout`, 
        {}, 
    )
}

export const requestPasswordOTP = async (email: string) => {
    const res = await api.post(
        `${BASE_URL}/api/auth/forgot-password/request-otp`, 
        {email}, 
    )
    return res.data ; 
}

export const validatePasswordOTP = async (email: string, otp: string) => {
    const res = await api.post(
        `${BASE_URL}/api/auth/forgot-password/validate-otp`, 
        {email, otp}, 
    )
    return res.data ; 
}

export const resetPassword = (
    email: string, 
    newPassword: string, 
    confirmPassword: string 
) => {
    return api.post(
        `${BASE_URL}/api/auth/forgot-password/reset-password`,
        {
            email, 
            newPassword, 
            confirmPassword 
        },
    )
}

export const inviteEmployee = (
    email: string, 
    role: string, 
    department: string 
) => {
    return api.post(
        `${BASE_URL}/api/auth/admin/invite`,
        {
            email, 
            role, 
            department
        }, 
    )
}

// verify invite token 

export const verifyInviteToken = (token: string) => {
  return api.get(
    `${BASE_URL}/api/auth/invite/verify?token=${token}`
  );
};

// invitation accept 

export const acceptInvite = (
    token: string, 
    name: string, 
    password: string 
) => {
    return api.post(
        `${BASE_URL}/api/auth/admin/accept-invite/${token}`,
        {name, password}
    )
}

