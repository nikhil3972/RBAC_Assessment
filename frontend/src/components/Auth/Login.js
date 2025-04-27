import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { MdEmail, MdLock } from 'react-icons/md';
import CommonInputField from '../common/CommonInputField';
import { Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login Data:', formData);
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <Card className="p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Login</h2>
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
                        type={showPassword ? "text" : "password"}
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
                    <Link to="/signup">Signup</Link>
                </div>
            </Card>
        </Container>
    );
};

export default Login;
