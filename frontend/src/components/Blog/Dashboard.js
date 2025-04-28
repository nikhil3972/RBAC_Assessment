import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editPostId, setEditPostId] = useState(null);
    const [role, setRole] = useState('');

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/blogs', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts', error);
        }
    };

    useEffect(() => {
        fetchPosts();
        const userRole = localStorage.getItem('role');
        setRole(userRole);
    }, []);

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (editPostId) {
                await axios.put(`http://localhost:5000/api/blogs/${editPostId}`, 
                { title, content }, 
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } else {
                await axios.post('http://localhost:5000/api/blogs', 
                { title, content }, 
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            }
            setTitle('');
            setContent('');
            setEditPostId(null);
            setShowModal(false);
            fetchPosts();
        } catch (error) {
            console.error('Error creating/updating blog', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchPosts();
        } catch (error) {
            console.error('Error deleting blog', error);
        }
    };

    const handleEdit = (post) => {
        setTitle(post.title);
        setContent(post.content);
        setEditPostId(post._id);
        setShowModal(true);
    };

    return (
        <Container className="py-5">
            <h2 className="text-center mb-5">Dashboard</h2>

            {role === 'admin' && (
                <Button variant="primary" className="mb-4" onClick={() => setShowModal(true)}>
                    Create New Blog
                </Button>
            )}

            <h4 className="mb-4">Blog Posts</h4>

            <Row xs={1} md={2} lg={2} className="g-4">
                {posts.length === 0 ? (
                    <p>No posts available.</p>
                ) : (
                    posts.map((post) => (
                        <Col key={post._id}>
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title>{post.title}</Card.Title>
                                    <Card.Text>{post.content}</Card.Text>
                                    <Card.Text><strong>Author Name:</strong> {post.author?.name}</Card.Text>
                                    <Card.Text><strong>Author Email:</strong> {post.author?.email}</Card.Text>
                                    {role === 'admin' && (
                                        <div className="d-flex justify-content-between mt-3">
                                            <Button variant="info" onClick={() => handleEdit(post)}>Edit</Button>
                                            <Button variant="danger" onClick={() => handleDelete(post._id)}>Delete</Button>
                                        </div>
                                    )}
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    <div><strong>Created:</strong> {new Date(post.createdAt).toLocaleString()}</div>
                                    <div><strong>Updated:</strong> {new Date(post.updatedAt).toLocaleString()}</div>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editPostId ? 'Edit Blog' : 'Create Blog'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateOrUpdate}>
                        <Form.Group className="mb-3" controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter blog title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Enter blog content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {editPostId ? 'Update Blog' : 'Create Blog'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Dashboard;
