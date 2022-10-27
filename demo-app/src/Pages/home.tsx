import { useEffect, useState } from "react";

import { Route, Switch } from 'react-router-dom';
import  { useAuthContext } from '@asgardeo/auth-react';
import { UserProvider } from '../providers/UserProvider';
import jwt from 'jwt-decode'
import ReactJson from "react-json-view";
import { Box, Button } from "@mui/material";
import JSONModal from "../components/JSONModal";

const HomePage = () => {

  const { state, signOut, getBasicUserInfo, getIDToken, getDecodedIDToken, getAccessToken, httpRequest } = useAuthContext();

  const [ decodedAccessToken, setDecodedAccessToken ] = useState<any>();
  const [ decodedIDToken, setDecodedIDToken ] = useState<any>();
  const [ isOrganizationLoaded, setIsOrganizationLoaded] = useState<boolean>(false);

  useEffect((() =>{
    if (state?.isAuthenticated) {
      const getData = async () => {
        const basicUserInfo = await getBasicUserInfo();
        const accessToken = await getAccessToken();
        const decodedAccessToken = jwt(accessToken);
        const decodedIDToken = await getDecodedIDToken();

        console.log(basicUserInfo);
        console.log(decodedAccessToken);
        setDecodedAccessToken(decodedAccessToken);
        setDecodedIDToken(decodedIDToken);
        setIsOrganizationLoaded(true);
        
      };
      getData();
    }
  }), []);
 

  return ( 
    {isOrganizationLoaded} &&
    <Box sx={{ml:2, mt:2}}>
        <Box component="span"
            m={1}
            display="flex"
            justifyContent="flex-start"
            alignItems="center">
            <JSONModal title="Decoded ID Token" buttonLabel="View Decoded ID Token" json={decodedIDToken}/>
            <JSONModal title="Decoded Choreo STS Token" buttonLabel="View Decoded Choreo STS Token" json={decodedAccessToken}/>
            
        </Box>

    </Box>
  );
};

export default HomePage;
