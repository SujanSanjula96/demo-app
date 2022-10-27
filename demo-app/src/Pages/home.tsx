import { useEffect, useState, useMemo } from "react";

import { Route, Switch } from 'react-router-dom';
import  { useAuthContext } from '@asgardeo/auth-react';
import { UserProvider } from '../providers/UserProvider';
import jwt from 'jwt-decode'
import ReactJson from "react-json-view";
import { Avatar, Box, Button, Typography } from "@mui/material";
import JSONModal from "../components/JSONModal";
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { grey } from '@mui/material/colors';

import Actions from '../components/actions'

const HomePage = () => {

    const [pageSize, setPageSize] = useState(5);

  const { state, signOut, getBasicUserInfo, getIDToken, getDecodedIDToken, getAccessToken, httpRequest } = useAuthContext();

  const [ decodedAccessToken, setDecodedAccessToken ] = useState<any>();
  const [ decodedIDToken, setDecodedIDToken ] = useState<any>();
  const [ isOrganizationLoaded, setIsOrganizationLoaded] = useState<boolean>(false);

  const appList = [{"applicationId":"0d98cf79-5bdd-4558-a7e7-bc6564a4d9c3","name":"Issue 1","throttlingPolicy":"10PerMin","description":"","status":"APPROVED","groups":[],"subscriptionCount":2,"attributes":{},"owner":"e2afcc83-d93b-4322-9bfd-f128793c9d8e","createdTime":"1665657919287","updatedTime":"1665657919287"},{"applicationId":"178f64ed-46fa-487c-b43c-f197a221a754","name":"Issue 2","throttlingPolicy":"Unlimited","description":"","status":"APPROVED","groups":[],"subscriptionCount":3,"attributes":{},"owner":"e2afcc83-d93b-4322-9bfd-f128793c9d8e","createdTime":"1666773265587","updatedTime":"1666773265587"},{"applicationId":"79e39144-b046-43c9-ae7e-61483d74db95","name":"Issue 3","throttlingPolicy":"10PerMin","description":"","status":"APPROVED","groups":[],"subscriptionCount":2,"attributes":{},"owner":"e2afcc83-d93b-4322-9bfd-f128793c9d8e","createdTime":"1666770198330","updatedTime":"1666770198330"}];

  useEffect((() =>{
    if (state?.isAuthenticated) {
      const getData = async () => {
        const basicUserInfo = await getBasicUserInfo();
        const accessToken = await getAccessToken();
        const decodedAccessToken = jwt(accessToken);
        const decodedIDToken = await getDecodedIDToken();
        setDecodedAccessToken(decodedAccessToken);
        setDecodedIDToken(decodedIDToken);
        setIsOrganizationLoaded(true);
        
      };
      getData();
    }
  }), []);
 
  const handleRead = async () => {
    const apiResponse = await httpRequest({
        url: "https://7f092d26-d233-4e7d-b0da-1a23893c68da-dev.e1-us-east-azure.preview-dv.choreoapis.dev/urow/sample-api/1.0.0/greeting?name=sujan"
      });
      console.log(apiResponse);
  }

  const columns = useMemo(
    () => [
      { field: 'name', 
        headerName: 'Issues', 
        flex: 9,
        renderCell: (params) => (
          <>
            <Typography sx={{ml:2}}>{params.row.name.split(":")}</Typography>
          </>
        )
      },
      {
        field: 'actions',
        headerName: 'Status',
        type: 'actions',
        flex: 1,
        renderCell: (params) => <Actions {...{ params }} />,
    },
    ],
    []
  );

  return ( 
    {isOrganizationLoaded} &&
    <Box sx={{mt:2}}>
        <Box component="span"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{width:"100%"}}>
            <Box m={2} sx={{width:"100%", backgroundColor:'#eeeeee', height:500} }>
                <Button variant='contained' sx={{mt:3}} onClick={handleRead} >
                    New Issue
                </Button>
                <Box m={2}>
                    <DataGrid
                        columns={columns}
                        rows={appList}
                        getRowId={(row) => row.applicationId}
                        rowsPerPageOptions={[5, 10, 20]}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        getRowSpacing={(params) => ({
                        top: params.isFirstVisible ? 0 : 5,
                        bottom: params.isLastVisible ? 0 : 5,
                        })}
                        sx={{
                        display: 'flex',
                        [`& .${gridClasses.row}`]: {
                            bgcolor: (theme) =>
                            theme.palette.mode === 'light' ? grey[200] : grey[900],
                        },
                        width: "100%",
                        height: 350
                        }}
                    />
                </Box>
            </Box>
        </Box>


        <Box sx={{backgroundColor:'#eeeeee'}}>

            <Box component="span"
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{height:100}}>
                <JSONModal title="Decoded ID Token" buttonLabel="Decoded ID Token" json={decodedIDToken}/>
                <JSONModal title="Decoded Choreo STS Token" buttonLabel="Decoded Choreo STS Token" json={decodedAccessToken}/>
            </Box>

        </Box>

    </Box>
    
  );
};

export default HomePage;
