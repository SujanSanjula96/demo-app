import { Box, Button, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import { Delete, Edit, PanoramaSharp, Preview } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuthContext } from '@asgardeo/auth-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from 'react';
import { apiUrl } from '../config';


const Actions = ( props ) => {

  const history = useHistory();
  const location = useLocation();
  const { httpRequest } = useAuthContext();

  const [ openDialog, setOpenDialog ] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  }

  const handleDialogClose = () => {
    setOpenDialog(false);
  }

   

  function DeleteDialog() {
    return (
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure to close the issue?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogClose} >Cancel</Button>
          <Button onClick={handleDelete} variant='contained'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const handleDelete = async () => {
    try{
      const response = await httpRequest({
        data: {
          status: "Closed"
        },
        method: "PATCH",
        url: apiUrl + "/issues/" + props.params.row.id ,
      });
      props.setNeedRefresh(true);
      props.setAlertMessage("Issue closed successfully");
      props.setAlertSeverity('success');
      props.setOpenAlert(true);
      setOpenDialog(false);
    } catch (e) {
      props.setAlertMessage("Failed to close the issue");
      props.setAlertSeverity('error');
      props.setOpenAlert(true);
      setOpenDialog(false);
    }

  }

  if ( props.canClose && props.params.row.status === "Open" ) {
    return (
      <Box>
        <Tooltip title="Close the issue">
            <Button variant='contained' onClick={handleDialogOpen}>
              CLOSE
            </Button>
        </Tooltip>
        <DeleteDialog />
      </Box>
    );
  }

  if ( props.params.row.status === "Closed" ) {
    return (
      <Box>
        <Typography> CLOSED </Typography>
      </Box>
    );
  }

  if (!props.canClose && props.params.row.status === "Open" ) {
    return(
      <>
      <Box         
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}>
            <Button variant='contained' disabled >
              CLOSE
            </Button>
            
      </Box>
            <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: 'none',
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Typography sx={{ p: 1 }}>You are not authorized to close the issue.</Typography>
          </Popover>
          </>
    )
  }
};

export default Actions;
