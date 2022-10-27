import React, { useEffect, useState } from 'react';
import { Layout } from './layout';

import { Route, Switch } from 'react-router-dom';
import  { useAuthContext } from '@asgardeo/auth-react';
import { UserProvider } from '../providers/UserProvider';
import jwt from 'jwt-decode'
import Page1 from '../Pages/page1';


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
  const [ organization, setOrganization ] = useState<string>(null);
  const [ organizationUuid, setOrganizationUuid ] = useState<string>(null);
  const [ isOrganizationLoaded, setIsOrganizationLoaded] = useState<boolean>(false);

  useEffect((() =>{
    if (state?.isAuthenticated) {
      const getData = async () => {
        const basicUserInfo = await getBasicUserInfo();
        const accessToken = await getAccessToken();
        const decodedAccessToken = jwt(accessToken) as DecodedAccessTokenInterface;

        setOrganizationUuid(decodedAccessToken.organization.uuid);
        setOrganization(basicUserInfo.defaultTenant);
        setIsOrganizationLoaded(true);
      };
      getData();
    }
  }), []);

  return (
    {isOrganizationLoaded} &&
    <>
      < UserProvider user={{orgName: organization, orgId: organizationUuid}} >
        <div>
        <Layout />
            <Route exact path="/applications" >
              <Page1 />
            </Route >
      </div>
      </UserProvider>
    </>
  )
}
