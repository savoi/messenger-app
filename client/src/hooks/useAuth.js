import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getUser, makeAuthCall } from "api/APIUtils";
import { UserContext } from "contexts/UserContext";

export default function useAuth() {
  let history = useHistory();
  const [error, setError] = useState(null);
  const { setUser } = useContext(UserContext);

  // Set user context based on current JWT tokens
  const setUserContext = async () => {
    try {
      const response = await getUser();
      setUser(response);
    } catch(err) {
      setUser(null);
      setError(err.message);
    }
  };

  const registerUser = async (data) => {
    try {
      await makeAuthCall('/register', data);
      setUserContext();
      history.push('/dashboard');
    } catch(err) {
      setError(err.message);
    }
  }

  const loginUser = async (data) => {
    try {
      await makeAuthCall('/login', data);
      setUserContext();
      history.push('/dashboard');
    } catch(err) {
      setError(err.message);
    }
  }

  const logoutUser = async () => {
    try {
      await fetch('/logout', { method: 'POST' });
      setUser(null);
      history.push('/login');
    } catch(err) {
      setError(err.response.data);
    }
  };

  return {
   registerUser,
   loginUser,
   logoutUser,
   error
  }
}
