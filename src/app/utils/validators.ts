export const validateLogin = (username: string, password: string) => {
    const errors: { username?: string; password?: string } = {};
  
    if (!username.trim()) {
        errors.username = "Username is required.";
    }
  
    if (!password.trim()) {
        errors.password = "Password is required.";
    }
  
    return errors;
};
