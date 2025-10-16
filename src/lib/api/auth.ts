import axios from 'axios';
import { UserResponse,LoginRequest,LoginResponse } from '@/types/auth';
// import { headers } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

const authApi = axios.create({
    baseURL: API_BASE_URL,
    timeout:10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials:true,
});

// export const registerUser = async (userData: RegisterRequest): Promise<UserResponse> => {
//     try{
//         const response = await authApi.post<UserResponse>('/api/auth/register',userData);
//         return response.data;
//     } catch (error) {
//      if (error && typeof error === 'object') {
//        if ('response' in error) {
//         const axiosError = error as any;
//         let errorMessage = 'Registration failed';

//         if (typeof axiosError.response?.data === 'string') {
//             errorMessage = axiosError.response.data;
//         } else if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
//             errorMessage = 
//             axiosError.response.data.message ||
//             axiosError.response.data.error ||
//             axiosError.response.statusText ||
//             'Registration failed';
//         }

//         throw new Error(errorMessage);
//        } else if ('request' in error) {
//         throw new Error('Network error. Please check your connection.');
//        }   
//      }
//      throw new Error('An unexpected error occurred during registration.')
//     }
// };

// login function 
export const loginUser = async (loginData: LoginRequest): Promise<LoginResponse | UserResponse> => {
    try{
      const response = await authApi.post<LoginResponse | UserResponse> ('/api/auth/login', loginData);
      return response.data;
    } catch  (error) {
      if (error && typeof error === 'object') {
        if ('response' in error) {
            const axiosError = error as any;
            let errorMessage = 'Login failed';

            if (typeof axiosError.response?.data === 'string') {
                errorMessage = axiosError.response.data;
            } else if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
                errorMessage =
                axiosError.response.data.message || 
                axiosError.response.data.error ||
                axiosError.response.statusText ||
                'Login failed';
            }

            throw new Error(errorMessage);
        } else if ('request' in error) {
            throw new Error('Network error. Please check your connction.');

        }
      }  
      throw new Error ('An unexpected error occurred during login.');
    }
};