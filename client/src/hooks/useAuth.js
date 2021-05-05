import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getWithJWT, makeAuthCall } from "api/APIUtils";
import { UserContext } from "contexts/UserContext";

export default function useAuth() {
  let history = useHistory();
  const [error, setError] = useState(null);
  const { setUser } = useContext(UserContext);

  // Set user context based on current JWT tokens
  const setUserContext = async () => {
    async function getUser() {
      const response = await getWithJWT('/user');
      const responseJson = await response.json();
      if (response.ok) {
        setUser(responseJson['current_user']);
      } else {
        throw new Error('Error fetching user.');
      }
    }
    getUser().catch(err => {
      setUser(null);
      setError(err.message);
    });
  };

  const registerUser = async (data) => {
    return await makeAuthCall('/register', data)
    .then(response => {
      setUserContext();
      setError(response.message);
    })
    .catch(err => {
      setError(err.message);
    });
  }

  const loginUser = async (data) => {
    return await makeAuthCall('/login', data)
    .then(() => {
      setUserContext();
      history.push('/dashboard');
    })
    .catch(err => {
      setError(err.message);
    });
  }

  const logoutUser = async () => {
    async function logout() {
      await fetch('/logout', {
        method: 'POST'
      })
      setUser(null);
      history.push('/login');
    }
    return await logout().catch(err => {
      setError(err.response.data);
    })
  };

  return {
   registerUser,
   loginUser,
   logoutUser,
   error
  }
}
