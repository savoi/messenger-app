import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from './UserContext';
import Loading from './Loading';


export default function PrivateRoute(props) {
   const { user, isLoading } = useContext(UserContext);
   const { component: Component, ...rest } = props;
   if(isLoading) {
      return <Loading/>
   }
   if(user){
      return ( <Route {...rest} render={(props) =>
           (<Component {...props}/>)
            }
         />
       )}
   // redirect if there is no user
   return <Redirect
      to={{
        pathname: '/login',
        state: {
          from: props.location
        }
      }}
    />
}
