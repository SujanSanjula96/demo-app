import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { Delete, Edit, Preview } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuthContext } from '@asgardeo/auth-react';

const Actions = ( props ) => {

  const history = useHistory();
  const location = useLocation();
  const { state, signOut, getBasicUserInfo, getIDToken, getDecodedIDToken, getAccessToken, httpRequest } = useAuthContext();

  const handleDelete = async () => {
    try{
      const response = await httpRequest({
        data: props.params.row.name,
        method: "DELETE",
        url: "https://7f092d26-d233-4e7d-b0da-1a23893c68da-prod.e1-us-east-azure.preview-dv.choreoapis.dev/urow/issuemanagementapi/1.0.0/names",
      });
      props.setNeedRefresh(true);
      props.setAlertMessage("Issue closed successfully");
      props.setAlertSeverity('success');
      props.setOpenAlert(true);
    } catch (e) {
      props.setAlertMessage("Failed to close the issue");
      props.setAlertSeverity('error');
      props.setOpenAlert(true);
    }

  }

  return (
    <Box>
      <Tooltip title="Manage application roles">
        <Button variant='outlined' onClick={handleDelete}>
          Close
        </Button>
      </Tooltip>
    </Box>
  );
};

export default Actions;
