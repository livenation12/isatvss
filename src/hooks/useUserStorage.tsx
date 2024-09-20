import useLocalStorage from './useLocalStorage';

// Define the UserStore interface
interface UserStore {
    isAuthenticated: boolean;
    email: string
    id: string
}

// Default user store object
export const defaultUserStore: UserStore = {
    isAuthenticated: false,
    email: '',
    id: ''
};

// Custom hook to manage user storage
export default function useUserStorage() {
    const [user, setUser, removeUser] = useLocalStorage("user", defaultUserStore);

    return [user, setUser, removeUser];
}
