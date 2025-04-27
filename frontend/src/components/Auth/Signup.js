import React, { useState } from 'react';
import { Form, Button, Container, Card, InputGroup } from 'react-bootstrap';
import { MdPerson, MdEmail, MdLock } from 'react-icons/md';
import { FaUserTag } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import CommonInputField from '../common/CommonInputField';
import { Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        roleName: 'user'
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Signup Data:', formData);
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <Card className="p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Signup</h2>
                <Form onSubmit={handleSubmit}>
                    <CommonInputField
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        icon={<MdPerson />}
                        isRequired
                    />

                    <CommonInputField
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        icon={<MdEmail />}
                        isRequired
                    />

                    <Form.Group className="mb-3">
                        <InputGroup>
                            <InputGroup.Text>
                                <MdLock />
                            </InputGroup.Text>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <InputGroup>
                            <InputGroup.Text>
                                <FaUserTag />
                            </InputGroup.Text>
                            <Form.Select
                                name="roleName"
                                value={formData.roleName}
                                onChange={handleChange}
                                required
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>

                    <Button type="submit" className="w-100 mb-3">
                        Sign Up
                    </Button>
                </Form>

                <div className="text-center">
                    <span>Already have an account? </span>
                    <Link to="/login">Login</Link>
                </div>
            </Card>
        </Container>
    );
};

export default Signup;
