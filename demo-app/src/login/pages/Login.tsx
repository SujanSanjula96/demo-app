/*
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein is strictly forbidden, unless permitted by WSO2 in accordance with
 * the WSO2 Commercial License available at http://wso2.com/licenses.
 * For specific language governing the permissions and limitations under
 * this license, please see the license as well as any agreement you’ve
 * entered into with WSO2 governing the purchase of this software and any
 * associated services.
 */

import { useHistory, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Hooks, useAuthContext, SecureRoute } from "@asgardeo/auth-react";

import React, { useEffect, useState } from "react";
import { CircularProgress } from '@mui/material';

interface LocationDefinition {
  state: { returnToUrl: string };
}

function Login() {

  const history = useHistory();
  const location: LocationDefinition = useLocation();
  const returnToUrl = location.state?.returnToUrl || '';
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  const { state, signIn, signOut, on } = useAuthContext();

  useEffect(() => {
    if (!state?.isAuthenticated) {
        return;
    } else {
      
      history.replace("applications");
    }
  }, [ state?.isAuthenticated ]);

  const loginButton = (
    <Button 
      onClick={ () => {
        setIsLoading(true);
        signIn();
      } }
      variant="contained"
      style={{color: 'white', backgroundColor: '#ff7300'}}
    >
      Sign In
    </Button>
  );

  return (
    
    <>
      { (!state?.isLoading && !isLoading) &&
      <div >
        <Box display="flex" justifyContent="center" alignItems="center" justifyItems='center' alignContent='center' sx={{mt:15}}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            justifyItems='center'
            sx={{width:600, height:400, backgroundColor:'#eeeeee', borderRadius:5}}
          >
            <Box >

              <Typography variant='h4' sx={{mb:12}}>
                SAMPLE APPLICATION
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Box>
                  {loginButton}
                </Box>
              </Box>

            </Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              mt={3}
            >

            </Box>
          </Box>
        </Box>
      </div>
      }
      { (isLoading || state?.isLoading)  && 
      <div >
        <Box justifyContent="center" alignItems="center" justifyItems='center' alignContent='center' sx={{mt:30}} >
          <CircularProgress />
        </Box>
      </div>
      }
    </>
  );
}

export default Login;
