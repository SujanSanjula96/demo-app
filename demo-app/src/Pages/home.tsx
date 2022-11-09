import { useEffect, useState, useMemo } from "react";

import { Route, Switch } from 'react-router-dom';
import  { useAuthContext } from '@asgardeo/auth-react';
import { UserProvider } from '../providers/UserProvider';
import jwt from 'jwt-decode'
import ReactJson from "react-json-view";
import { Avatar, Box, Button, Modal, TextField, Typography } from "@mui/material";
import JSONModal from "../components/JSONModal";
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { grey } from '@mui/material/colors';
import { MuiSnackbar } from "../components/snackbar";

import Actions from '../components/actions';
import { useUser } from '../providers/UserProvider';
import CopyToClipboardButton from "../components/copy-to-clipboard";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface IssueInterface {
  name?: string
}

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

const HomePage = () => {

    const [pageSize, setPageSize] = useState(5);

  const { state, signOut, getBasicUserInfo, getIDToken, getDecodedIDToken, getAccessToken, httpRequest } = useAuthContext();

  const [ decodedAccessToken, setDecodedAccessToken ] = useState<any>();
  const [ accessToken, setAccessToken ] = useState<any>();
  const [ decodedIDToken, setDecodedIDToken ] = useState<any>();
  const [ isOrganizationLoaded, setIsOrganizationLoaded] = useState<boolean>(false);
  const [ responseList, setResponseList ] = useState<IssueInterface[]>([]);
  const [ isLoaded, setIsLoaded ] = useState<boolean>(false);
  const [ openNewIssue, setOpenNewIssue ] = useState<boolean>(false);
  const [ newIssue,  setNewIssue ] = useState<string>("");
  const [ needRefresh, setNeedRefresh ] = useState<boolean>(true);
  const [ loadFailed, setLoadFailed ] = useState<boolean>(null);
  const [ scopeLoaded, setScopeLoaded ] = useState<boolean>(null);

  const [ openAlert, setOpenAlert ] = useState<boolean>(false);
  const [ alertMessage, setAlertMessage ] = useState<string>(undefined);
  const [ alertSeverity, setAlertSeverity ] = useState<any>(undefined);

  const scopes = useUser().scopes;
  const canClose = scopes.includes("urn:starkindustries:issueapi:close_issue");

  const appList = [{name: "Issue 1"},{name: "Issue 2"},{name: "Issue 3"}];

  const getIssueList = async () => {
    try{
        const response = await httpRequest({
          url: "https://19a0c28e-e423-4641-a4f3-d20572a06a9e-prod.e1-us-east-azure.preview-dv.choreoapis.dev/guhm/issueapi/1.0.0/issues",
      });

      const tempList = response.data;
      console.log(scopes);

      console.log(canClose);

      setResponseList(tempList);
      setIsLoaded(true);
    } catch (e) {
      setLoadFailed(true);
    }

 }


  useEffect(() => {
    
    if (needRefresh){
      getIssueList();
      setNeedRefresh(false);
    }
    

  }, [needRefresh]);

  useEffect(() =>{
    if (state?.isAuthenticated) {
      const getData = async () => {
        const accessToken = await getAccessToken();
        const decodedAccessToken = jwt(accessToken) as DecodedAccessTokenInterface;
        const decodedIDToken = await getDecodedIDToken();
        setAccessToken(accessToken);
        setDecodedAccessToken(decodedAccessToken);
        setDecodedIDToken(decodedIDToken);
        setIsOrganizationLoaded(true);
        
      };
      getData();

  }
  }, []);


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
        renderCell: (params) => <Actions params={params}
                                        setOpenAlert={setOpenAlert}
                                        setAlertMessage={setAlertMessage}
                                        setAlertSeverity={setAlertSeverity}
                                        setNeedRefresh={setNeedRefresh}
                                        canClose={canClose}
        />,
    },
    ],
    []
  );

  const handleClose = () => {
    setOpenNewIssue(false);
  }

  const handleChange = e => {
    setNewIssue(e.target.value);
  }

  const handleCreate = async () => {
    try{
      const response = await httpRequest({
        data: newIssue,
        method: "POST",
        url: "https://19a0c28e-e423-4641-a4f3-d20572a06a9e-prod.e1-us-east-azure.preview-dv.choreoapis.dev/guhm/issueapi/1.0.0/issues",
      });
      setNeedRefresh(true);
      setNewIssue("");
      setOpenNewIssue(false);
      setAlertMessage("Issue Created Successfully");
      setAlertSeverity('success');
      setOpenAlert(true);
    } catch (e) {
      setNewIssue("");
      setOpenNewIssue(false);
      setAlertMessage("Failed to create the issue");
      setAlertSeverity('error');
      setOpenAlert(true);
    }

  }
  
  if (isLoaded) {
  return ( 
    {isOrganizationLoaded} && {isLoaded} && {scopeLoaded} &&
    <Box sx={{mt:2}}>
        <Box component="span"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{width:"100%"}}>
            <Box m={2} sx={{width:"100%",  height:500} }>
                <Button variant='contained' sx={{mt:3}} onClick={() => {setOpenNewIssue(true)}} >
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

        <Modal
          open={openNewIssue}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create New Issue
            </Typography>
            <TextField
            required
            id="outlined-required"
            value={newIssue}
            label="Issue"
            onChange={handleChange}
            sx={{
              width: 300, mt:2, mb:3
            }}
            />
            <Box>
              <Button variant="contained" sx={{mr:2}} onClick={handleCreate}>
                Create
              </Button>
              <Button onClick={handleClose}>
                Cancel
              </Button> 
            </Box>
          </Box>
        </Modal>

        <Box sx={{backgroundColor:'#eeeeee'}}>

            <Box component="span"
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{height:100}}>
                <JSONModal title="Decoded ID Token" buttonLabel="Decoded ID Token" json={decodedIDToken}/>
                <JSONModal title="Decoded Choreo STS Token" buttonLabel="Decoded Choreo STS Token" json={decodedAccessToken}/>
                < CopyToClipboardButton copyString={accessToken} />
            </Box>

        </Box>
        <MuiSnackbar openAlert={openAlert} 
        setOpenAlert={setOpenAlert} 
        message={alertMessage}
        severity={alertSeverity}
      />

    </Box>
    

  );
          } 
  if (loadFailed) {
    return(
      <>
      <Box sx={{backgroundColor:'#eeeeee'}}>

      <Box component="span"
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{height:100,mt:5}}>
            <Typography variant="h4">
              You are not Authorized!
            </Typography>
      </Box>
      </Box>

      <Box sx={{backgroundColor:'#eeeeee', mt:10}}>

        <Box component="span"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{height:100}}>
            <JSONModal title="Decoded ID Token" buttonLabel="Decoded ID Token" json={decodedIDToken}/>
            <JSONModal title="Decoded Choreo STS Token" buttonLabel="Decoded Choreo STS Token" json={decodedAccessToken}/>
            < CopyToClipboardButton copyString={accessToken} />
        </Box>

        </Box>
        </>
  
    )
  }
};

export default HomePage;
