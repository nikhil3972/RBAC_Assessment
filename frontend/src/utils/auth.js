export const isAuthenticated = () => {
    return localStorage.getItem('token') ? true : false;
};

export const isAdmin = () => {
    const role = localStorage.getItem('role');
    return role === 'admin';
};
