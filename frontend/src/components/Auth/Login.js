import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { MdEmail, MdLock } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import CommonInputField from '../common/CommonInputField';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: formData.email,
                password: formData.password
            });
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <Card className="p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Login</h2>
                {error && <div className="text-danger text-center mb-3">{error}</div>}
                <Form onSubmit={handleSubmit}>
                    <CommonInputField
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        icon={<MdEmail />}
                        isRequired
                    />

                    <CommonInputField
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        icon={<MdLock />}
                        isRequired
                    />

                    <Form.Group className="mb-3">
                        <Form.Check 
                            type="checkbox"
                            label="Show Password"
                            onChange={() => setShowPassword(prev => !prev)}
                        />
                    </Form.Group>

                    <Button type="submit" className="w-100 mb-3">
                        Login
                    </Button>
                </Form>

                <div className="text-center">
                    <span>Don't have an account? </span>
                    <Link to="/signup">Sign Up</Link>
                </div>
            </Card>
        </Container>
    );
};

export default Login;
