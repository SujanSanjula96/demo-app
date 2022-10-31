import React, { useEffect, useState } from 'react';
import { Layout } from './layout';

import { Route, Switch } from 'react-router-dom';
import  { useAuthContext } from '@asgardeo/auth-react';
import { UserProvider } from '../providers/UserProvider';
import jwt from 'jwt-decode'
import HomePage from '../Pages/home';


interface OrganizationInterface {
  handle?: string,
  uuid?: string
}

interface DecodedAccessTokenInterface {
  aud?: [],
  aut?: string,
  azp?: string,
  exp?: number,
  iat?: number,
  idp_claims?: {},
  iss?: string,
  jti?: string,
  nbf?: number,
  organization?: OrganizationInterface,
  organizations?: [],
  scope?: string,
  sub?: string
}

export const Dashboard = () => {

  const { state, getAccessToken } = useAuthContext();

  const [ isOrganizationLoaded, setIsOrganizationLoaded] = useState<boolean>(false);
  const [ scopes, setScopes ] = useState<string>("");

  useEffect((() =>{
    if (state?.isAuthenticated) {
      const getData = async () => {

        const accessToken = await getAccessToken();
        const decodedAccessToken = await jwt(accessToken) as DecodedAccessTokenInterface;

        await setScopes(decodedAccessToken.scope);
        console.log(decodedAccessToken.scope);
        console.log(scopes);
        setIsOrganizationLoaded(true);
      };
      getData();
    }
  }), []);

  if (scopes !== "") {
    return (
      {isOrganizationLoaded} &&
      <>
        < UserProvider user={{scopes: scopes}} >
          <div>
            <Layout />
                <Route exact path="/issues" >
                  <HomePage />
                </Route >
          </div>
        </UserProvider >
      </>
    )
  }

}
