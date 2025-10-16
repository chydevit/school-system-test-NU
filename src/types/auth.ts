// export interface RegisterRequest {
//     email:string;
//     username:string;
//     password:string;
// }

export interface LoginRequest {
    username: string;
    password: string;
}

export interface Role {
    id: number;
    name:string;
    permissions:Array<{
        id:number;
        name:string;
    }>;
}

export interface UserResponse{
    id:number;
    username: string;
    email: string;
    enabled: boolean;
    roles: Role[];
}

// add JWT response type (common for spring security)
export interface LoginResponse {
    token: string;
    user: UserResponse;
}