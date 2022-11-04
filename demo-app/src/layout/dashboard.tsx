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

  const { state, getAccessToken, getBasicUserInfo } = useAuthContext();

  const [ isOrganizationLoaded, setIsOrganizationLoaded] = useState<boolean>(false);
  const [ scopes, setScopes ] = useState<string>("");
  const [ displayName, setDisplayName ] = useState<string>("");
  const [ email, setEmail ] = useState<string>("");

  useEffect((() =>{
    if (state?.isAuthenticated) {
      const getData = async () => {

        const basicUserInfo = await getBasicUserInfo();
        const accessToken = await getAccessToken();
        const decodedAccessToken = await jwt(accessToken) as DecodedAccessTokenInterface;

        if (basicUserInfo.hasOwnProperty('displayName')) {
          setDisplayName(basicUserInfo.displayName);
        } else {
          const username = basicUserInfo.username.match(/^([^@]*)@/)[1];
          setDisplayName(username);
        }

        setEmail(basicUserInfo.username);

        await setScopes(decodedAccessToken.scope);
        console.log(basicUserInfo);
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
        < UserProvider user={{scopes: scopes, email: email, displayName: displayName }} >
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
