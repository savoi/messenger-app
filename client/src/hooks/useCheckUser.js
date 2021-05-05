import { useState, useEffect } from 'react';
import { getUser } from "api/APIUtils"

export default function useCheckUser() {
    const [user, setUser] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
      getUser()
      .then(response => {
        setUser(response);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
    }, []);

    return {
        user,
        setUser,
        isLoading
    }
}
