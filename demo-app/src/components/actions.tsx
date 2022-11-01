import { Box, Button, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import { Delete, Edit, PanoramaSharp, Preview } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuthContext } from '@asgardeo/auth-react';
import { useEffect, useState } from 'react';
import React from 'react';

const Actions = ( props ) => {

  const history = useHistory();
  const location = useLocation();
  const { httpRequest } = useAuthContext();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleDelete = async () => {
    try{
      const response = await httpRequest({
        data: {
          status: "Closed"
        },
        method: "PATCH",
        url: "https://7f092d26-d233-4e7d-b0da-1a23893c68da-prod.e1-us-east-azure.preview-dv.choreoapis.dev/urow/issueapi/1.0.0/issues/" + props.params.row.name ,
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

  if ( props.canClose && props.params.row.status === "Open" ) {
    return (
      <Box>
        <Tooltip title="Close the issue">
            <Button variant='contained' onClick={handleDelete}>
              CLOSE
            </Button>
        </Tooltip>
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
            <Button variant='contained' disabled onClick={handleDelete}>
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
