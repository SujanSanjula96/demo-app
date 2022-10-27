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

import Actions from '../components/actions';

interface IssueInterface {
  name?: string
}

const HomePage = () => {

    const [pageSize, setPageSize] = useState(5);

  const { state, signOut, getBasicUserInfo, getIDToken, getDecodedIDToken, getAccessToken, httpRequest } = useAuthContext();

  const [ decodedAccessToken, setDecodedAccessToken ] = useState<any>();
  const [ decodedIDToken, setDecodedIDToken ] = useState<any>();
  const [ isOrganizationLoaded, setIsOrganizationLoaded] = useState<boolean>(false);
  const [ responseList, setResponseList ] = useState<IssueInterface[]>([]);
  const [ isLoaded, setIsLoaded ] = useState<boolean>(false);

  const appList = [{name: "Issue 1"},{name: "Issue 2"},{name: "Issue 3"}];

  const getApplicationList = async () => {
    const response = await httpRequest({
        url: "https://7f092d26-d233-4e7d-b0da-1a23893c68da-prod.e1-us-east-azure.preview-dv.choreoapis.dev/urow/echo-service/1.0.0/names",
    });

    const tempList = response.data.map((issue) => {
      return {
          name: issue
      }
    });

    console.log(tempList);
    setResponseList(tempList);
    setIsLoaded(true);
 }

  useEffect(() => {
    getApplicationList();

  }, []);

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
 

  const columns = useMemo(
    () => [
      { field: 'name', 
        headerName: 'Issues', 
        flex: 9,
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
    {isOrganizationLoaded} && {isLoaded} &&
    <Box sx={{mt:2}}>
        <Box component="span"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{width:"100%"}}>
            <Box m={2} sx={{width:"100%",  height:500} }>
                <Button variant='contained' sx={{mt:3}} onClick={() => {console.log("")}} >
                    New Issue
                </Button>
                <Box m={2}>
                    <DataGrid
                        columns={columns}
                        rows={responseList}
                        getRowId={(row) => row.name}
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
