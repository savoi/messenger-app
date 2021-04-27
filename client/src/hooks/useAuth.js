import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from 'contexts/UserContext';
import { getWithJWT } from "api/APIUtils";

export default function useAuth() {
  let history = useHistory();
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState(null);

  // Set user in context and push them to dashboard
  const setUserContext = async () => {
    return await getWithJWT('/user')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error fetching user.');
        }
      })
      .then(user => {
        setUser(user['current_user']);
        history.push('/dashboard');
      })
      .catch((err) => {
        setError(err.message);
    })
  }

  // Register user
  const registerUser = async (data) => {
     const { username, email, password } = data;
     return await fetch('/register', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({username, email, password})
     })
     .then(response => {
       if (!response.ok) {
         return response.json().then(json => { throw json; });
       }
       return response;
     })
     .then(async () => {
       await setUserContext();
     })
     .catch((err) => {
         setError(err.message);
    })
  };

  // login user
  const loginUser = async (data) => {
    return await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(json => { throw json; });
      }
      return response;
    })
    .then(async () => {
      await setUserContext();
    })
    .catch((err) => {
      setError(err.message);
    })
  };

  const logoutUser = async () => {
    return await fetch('/logout', {
      method: 'POST'
    })
    .then(async () => {
      setUser(null);
    })
    .catch((err) => {
      setError(err.response.data);
    })
  }

  return {
   registerUser,
   loginUser,
   logoutUser,
   error,
   setUserContext
  }
}
