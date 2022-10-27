import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { Delete, Edit, Preview } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useHistory, useLocation } from 'react-router-dom';

const Actions = ({ params }) => {

  const history = useHistory();
  const location = useLocation();

  return (
    <Box>
      <Tooltip title="Manage application roles">
        <Button variant='outlined'>
          Close
        </Button>
      </Tooltip>
    </Box>
  );
};

export default Actions;
