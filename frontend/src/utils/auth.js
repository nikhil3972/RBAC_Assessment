export const isAuthenticated = () => {
    return sessionStorage.getItem('token') ? true : false;
};

export const isAdmin = () => {
    const role = sessionStorage.getItem('role');
    return role === 'admin';
};
