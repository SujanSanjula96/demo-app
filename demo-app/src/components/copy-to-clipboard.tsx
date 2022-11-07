import { Button, Snackbar } from '@mui/material'
import { useState } from 'react'

interface propsDefinition {
  copyString?: string;
}

const CopyToClipboardButton = ( props: propsDefinition ) => {
const [open, setOpen] = useState(false)
const handleClick = () => {
  setOpen(true)
  navigator.clipboard.writeText(props.copyString);
}
return (
    <>
      <Button onClick={handleClick} variant="contained" sx={{mr:3}}>Copy Choreo STS Token</Button>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        message="Copied"
      />
    </>
  )
}
export default CopyToClipboardButton
