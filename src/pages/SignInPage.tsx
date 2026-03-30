import { useState, useRef } from 'react';
import { attendanceApi, authToken } from '../api/attendanceApi';

export default function SignInPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isSubmitting = useRef(false);

    const onsubmit = (email: string, password: string) => {
        if (isSubmitting.current) return; // prevent multiple submissions
        isSubmitting.current = true;

        // call api to sign in, if successful, set token and redirect to attendance page
        attendanceApi.signIn(email, password)
            .then(response => {
                if (response.token) {
                    authToken.set(response.token);
                } else {
                    alert('Sign in failed: ' + (response.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error during sign in:', error);
                alert('An error occurred during sign in. Please try again.');
            })
            .finally(() => {
                isSubmitting.current = false; // reset submission state
            });
    };


    return (
        <form onSubmit={(e) => { e.preventDefault(); onsubmit(email, password); }}>
            <p>Enter your email and password</p>
            <input
                type="email"
                value={email}
                style={{ margin: '0 20px 20px 10px', height: '40px', width: '400px', display: 'block' }}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                required
            />
            <input
                type="password"
                value={password}
                style={{ margin: '0 20px 20px 10px', height: '40px', width: '400px', display: 'block' }}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required
            />
            <button type="submit">Sign In</button>
        </form>
    );
}
