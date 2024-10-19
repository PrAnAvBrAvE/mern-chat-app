import { useState, createContext, useContext, useEffect } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({children}) => {
    
    const [authUser, setAuthUser] = useState(() => {
        const user = localStorage.getItem('chat-user');
        return user ? JSON.parse(user) : null;
    });

    // Sync authUser state with localStorage
    useEffect(() => {
        if (authUser) {
            // If logged in, save user to localStorage
            localStorage.setItem('chat-user', JSON.stringify(authUser));
        } else {
            // If logged out, remove user from localStorage
            localStorage.removeItem('chat-user');
        }
    }, [authUser]); // Run this effect whenever authUser changes

    return (
        <AuthContext.Provider value={{authUser, setAuthUser}}>
            {children}
        </AuthContext.Provider>
    );
}