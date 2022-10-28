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

const HomePage = () => {

    const [pageSize, setPageSize] = useState(5);

  const { state, signOut, getBasicUserInfo, getIDToken, getDecodedIDToken, getAccessToken, httpRequest } = useAuthContext();

  const [ decodedAccessToken, setDecodedAccessToken ] = useState<any>();
  const [ decodedIDToken, setDecodedIDToken ] = useState<any>();
  const [ isOrganizationLoaded, setIsOrganizationLoaded] = useState<boolean>(false);
  const [ responseList, setResponseList ] = useState<IssueInterface[]>([]);
  const [ isLoaded, setIsLoaded ] = useState<boolean>(false);
  const [ openNewIssue, setOpenNewIssue ] = useState<boolean>(false);
  const [ newIssue,  setNewIssue ] = useState<string>("");
  const [ needRefresh, setNeedRefresh ] = useState<boolean>(true);
  const [ loadFailed, setLoadFailed ] = useState<boolean>(null);

  const [ openAlert, setOpenAlert ] = useState<boolean>(false);
  const [ alertMessage, setAlertMessage ] = useState<string>(undefined);
  const [ alertSeverity, setAlertSeverity ] = useState<any>(undefined);

  const appList = [{name: "Issue 1"},{name: "Issue 2"},{name: "Issue 3"}];

  const getIssueList = async () => {
    try{
        const response = await httpRequest({
          url: "https://7f092d26-d233-4e7d-b0da-1a23893c68da-prod.e1-us-east-azure.preview-dv.choreoapis.dev/urow/issuemanagementapi/1.0.0/names",
      });

      const tempList = response.data.map((issue) => {
        return {
            name: issue
        }
      });

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
        renderCell: (params) => <Actions params={params}
                                        setOpenAlert={setOpenAlert}
                                        setAlertMessage={setAlertMessage}
                                        setAlertSeverity={setAlertSeverity}
                                        setNeedRefresh={setNeedRefresh}
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
        url: "https://7f092d26-d233-4e7d-b0da-1a23893c68da-prod.e1-us-east-azure.preview-dv.choreoapis.dev/urow/issuemanagementapi/1.0.0/names",
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
    {isOrganizationLoaded} && {isLoaded} && 
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
    )
  }
};

export default HomePage;
