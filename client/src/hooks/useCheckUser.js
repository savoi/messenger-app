import { useState, useEffect } from 'react';
import { getWithJWT } from "api/APIUtils"

export default function useCheckUser() {
    const [user, setUser] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
      async function checkUser() {
        const response = await getWithJWT('/user');
        if (response.ok) {
          const jsonResponse =  await response.json();
          setUser(jsonResponse['current_user']);
          setLoading(false);
        } else {
          throw new Error('Error fetching user.');
        }
      }
      checkUser().catch(err => {
        setLoading(false);
      });
    }, []);

    return {
        user,
        setUser,
        isLoading
    }
}
