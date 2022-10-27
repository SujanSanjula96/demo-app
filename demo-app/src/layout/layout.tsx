import { Box,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Stack
  } from '@mui/material';

import { useUser } from '../providers/UserProvider';
import { useAuthContext } from '@asgardeo/auth-react';

export const Layout = () => {

  const { signOut } = useAuthContext();
  const org = useUser().orgName ;

    return (
      <AppBar position='static' color='transparent'>
        <Toolbar >
          <Box sx={{...{
                          bgcolor: 'background.paper',
                          borderColor: 'text.primary',
                          m: 1,
                          border: 1,
                          width: 120,
                          height: 30,
                        }, borderRadius: '16px' }}>
            <Typography variant='subtitle1' component='div' align='center' sx={{ flexGrow: 1 }}>
              {org}
            </Typography>
          </Box>
          <Stack direction='row' spacing={2}>
            <Button color='inherit' onClick={() => signOut()}>Logout</Button>
          </Stack>
        </Toolbar>
      </AppBar>
    )
  }