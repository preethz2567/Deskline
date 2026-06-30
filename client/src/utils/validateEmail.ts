export function isValidEmail(email: string): boolean {
    if (!email.trim()) return false;
    return /^\S+@\S+\.\S+$/.test(email);
}