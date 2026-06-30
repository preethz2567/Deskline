export interface User {
    id: number;
    email: string;
    role: "admin" | "user";
    name: string;
}

export interface LoginResponse {
    token: string;
}