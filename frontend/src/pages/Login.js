import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import API from '../api/axios';
import './Auth.css';

function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await API.post('/auth/login', {email, password});
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('name', response.data.name);
            navigate('/uploads');
        } catch(err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <p className="auth-app-name">🎙 SpeechApp</p>
                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">Log in to continue your practice</p>

                <input
                    className="auth-input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="auth-btn" onClick={handleLogin}>Log in</button>

                {error && <p className="auth-error">{error}</p>}

                <p className="auth-link">
                    Don't have an account? <a href="/signup">Sign up</a>
                </p>
            </div>
        </div>
    );
}

export default Login;