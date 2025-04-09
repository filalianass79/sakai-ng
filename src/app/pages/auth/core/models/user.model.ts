export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    roles: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    roles: string[];
  }

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    roles: string[];
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roles?: string[];
} 


export interface PwRequest {
    id: number;
    oldPassword: string;
    newPassword: string;
} 