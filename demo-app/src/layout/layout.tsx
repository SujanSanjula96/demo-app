import { Box,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Stack
  } from '@mui/material';


import { useAuthContext } from '@asgardeo/auth-react';

export const Layout = () => {

  const { signOut } = useAuthContext();

    return (
      <AppBar position='static' color='transparent'>
        <Toolbar >
          <Stack direction='row' spacing={2}>
            <Button color='inherit' onClick={() => signOut()}>Logout</Button>
          </Stack>
        </Toolbar>
      </AppBar>
    )
  }