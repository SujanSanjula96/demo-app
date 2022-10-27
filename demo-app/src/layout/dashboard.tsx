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

  const { state, signOut, getBasicUserInfo, getIDToken, getDecodedIDToken, getAccessToken, httpRequest } = useAuthContext();

  const [ isOrganizationLoaded, setIsOrganizationLoaded] = useState<boolean>(false);

  useEffect((() =>{
    if (state?.isAuthenticated) {
      const getData = async () => {
        const basicUserInfo = await getBasicUserInfo();
        const accessToken = await getAccessToken();
        const decodedAccessToken = jwt(accessToken) as DecodedAccessTokenInterface;

        console.log(basicUserInfo);
        console.log(decodedAccessToken);
        setIsOrganizationLoaded(true);
      };
      getData();
    }
  }), []);

  return (
    {isOrganizationLoaded} &&
    <>
        <div>
        <Layout />
            <Route exact path="/applications" >
              <HomePage />
            </Route >
      </div>
    </>
  )
}
