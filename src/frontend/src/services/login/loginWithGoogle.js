import axios from 'axios';

export const LoginWithGoogle = (userInfo) => {
    try {
        window.location.href = 'http://localhost:4500/api/google/google-login';
    } catch (error) {
        // Handle the error here
        console.error('An error occurred while login with google results:', error);
        throw error; // Rethrow the error to propagate it to the caller
    }
}

