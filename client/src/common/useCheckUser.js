import { useState, useEffect } from 'react';
import { getWithJWT } from "./APIUtils"

export default function useCheckUser() {
    const [user, setUser] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
      async function checkUser() {
        await getWithJWT('/user')
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error fetching user.');
          }
        })
        .then(user => {
          setUser(user.current_user);
          setLoading(false);
        }).catch(err => {
            setLoading(false);
        });
      }
      checkUser();
    }, []);

    return {
        user,
        setUser,
        isLoading
    }
}
