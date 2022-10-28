import { Snackbar, Button, Alert, AlertProps, AlertColor, Slide } from '@mui/material'
import { useState, forwardRef } from 'react'

interface SnackbarProps {
    openAlert?: boolean;
    setOpenAlert(data: boolean): void;
    message?: string;
    severity?: AlertColor;
}

const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(
  function SnackbarAlert(props, ref) {
    return <Alert elevation={6} sx={{ fontSize: 18, alignItems:'center' }} ref={ref} {...props} />
  }
)

export const MuiSnackbar = (props : SnackbarProps) => {

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }
    props.setOpenAlert(false)
  }

  function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
  }

  
  return (
    <>
      <Snackbar open={props.openAlert} autoHideDuration={6000} onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        /*TransitionComponent={TransitionUp} */
      >
        <SnackbarAlert onClose={handleClose} severity={props.severity} >
          {props.message}
        </SnackbarAlert>
      </Snackbar>
    </>
  )
}