import axios from "axios";
import type { LoginResponse } from "../types/auth";

const API_BASE = "http://localhost:4000";

export async function loginRequest(
    email: string,
    password: string
): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(`${API_BASE}/login`, {
        email,
        password,
    });
    return response.data;
}