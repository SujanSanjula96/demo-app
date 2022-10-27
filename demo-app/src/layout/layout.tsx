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
      <AppBar position='static' color='transparent' sx={{height:75}}>
        <Toolbar >
          <Typography variant="h4" flex={1}>
            Issue Management Dashboard
          </Typography>
          <Stack direction='row' spacing={2}>
            <Button variant='contained'  onClick={() => signOut()}>Logout</Button>
          </Stack>
        </Toolbar>
      </AppBar>
    )
  }