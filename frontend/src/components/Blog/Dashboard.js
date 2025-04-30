import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";
import { isAdmin, isAuthenticated } from "../../utils/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; 

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editPostId, setEditPostId] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      const response = await axios.get("http://localhost:5000/api/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(
        Array.isArray(message) ? message.join("\n") : message || "Failed to fetch blogs.",
        { style: { whiteSpace: "pre-line" } }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      setRole(isAdmin() ? "admin" : "user");
      fetchPosts();
    }
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      if (editPostId) {
        await axios.put(
          `http://localhost:5000/api/blogs/${editPostId}`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Blog updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/blogs",
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Blog created successfully");
      }
      resetForm();
      fetchPosts();
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(
        Array.isArray(message) ? message.join("\n") : message || "Failed to create/update blog.",
        { style: { whiteSpace: "pre-line" } }
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Blog deleted successfully");
      fetchPosts();
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(
        Array.isArray(message) ? message.join("\n") : message || "Failed to delete blog.",
        { style: { whiteSpace: "pre-line" } }
      );
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditPostId(post._id);
    setShowModal(true);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditPostId(null);
    setShowModal(false);
  };

  return (
    <>
      <Row className="bg-dark text-white py-3 px-4 align-items-center">
        <Col>
          <h3 className="mb-0">📝 Blog Dashboard</h3>
        </Col>
        <Col className="text-end">
          <Button variant="outline-light" onClick={() => navigate("/login")}>
            Logout
          </Button>
        </Col>
      </Row>

      <Container className="py-5">
        {role === "admin" && (
          <div className="text-end mb-4">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              + Create New Blog
            </Button>
          </div>
        )}

        <h4 className="mb-4">📚 Blog Posts</h4>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" />
          </div>
        ) : (
          <Row xs={1} md={2} lg={2} className="g-4">
            {posts.length === 0 ? (
              <p>No posts available.</p>
            ) : (
              posts.map((post) => (
                <Col key={post._id}>
                  <Card className="h-100 blog-card">
                    <Card.Header className="bg-primary text-white">
                      <Card.Title className="mb-0">{post.title}</Card.Title>
                    </Card.Header>
                    <Card.Body className="bg-light">
                      <Card.Text className="text-muted">{post.content}</Card.Text>
                      <Card.Text>
                        <strong>Author:</strong> {post.author?.name} <br />
                        <strong>Email:</strong> {post.author?.email}
                      </Card.Text>
                      {role === "admin" && (
                        <div className="d-flex justify-content-between mt-3">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleEdit(post)}
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(post._id)}
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                    <Card.Footer className="bg-white text-muted small">
                      <div>
                        <strong>Created:</strong> {new Date(post.createdAt).toLocaleString()}
                      </div>
                      <div>
                        <strong>Updated:</strong> {new Date(post.updatedAt).toLocaleString()}
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        )}

        {/* Modal for create/edit */}
        <Modal show={showModal} onHide={resetForm} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editPostId ? "✏️ Edit Blog" : "📝 Create Blog"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleCreateOrUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Blog Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter blog title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Blog Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Write your blog content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="text-end">
                <Button variant="secondary" className="me-2" onClick={resetForm}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editPostId ? "Update" : "Create"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default Dashboard;
