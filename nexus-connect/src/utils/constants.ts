// export const BASE_URL = 'https://api-nexus-connect.onrender.com';
export const BASE_URL = 'http://127.0.0.1:8000';

// Minimum 7 characters, at least one uppercase letter, one lowercase letter, one number and one special character
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{7,}$/
);
