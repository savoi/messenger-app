import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from 'contexts/UserContext';
import Loading from 'components/Loading';


export default function PublicRoute(props) {
   const { user, isLoading } = useContext(UserContext);
   const { component: Component, ...rest } = props;
   if(isLoading) {
      return <Loading/>
   }
   if(!user){
      return ( <Route {...rest} render={(props) =>
           (<Component {...props}/>)
            }
         />
       )}
   // redirect to dashboard if there is a user
   return <Redirect
      to={{
        pathname: '/dashboard',
        state: {
          from: props.location
        }
      }}
    />
}
