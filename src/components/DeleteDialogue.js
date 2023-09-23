import { useState , useEffect } from "react";
import { useTheme, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



const Delete = ({ isToggled, toggleOff, objective, itemKey, route, name }) => {

    const theme = useTheme();
    const [open, setOpen] = useState(false);
   


    const hanldeSubmit = (event, route, action, key)=> {

            console.log(route, action, key);
            handleClose();
    }


    useEffect(() => {
        if(isToggled){
        setOpen(true);
        }
    },[isToggled]);


    const handleClose = () => {

        setOpen(false);
        toggleOff(false);
   
  
    

    
    }


  return ( 
        <Dialog 
            open={open} 
            onClose={handleClose}  
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" variant="h2" display="flex" justifyContent="center"sx={{textTransform: "uppercase"}}>
                {objective} {route}
            </DialogTitle>

            <DialogContent color={theme.palette.grey[100]}>
                <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete : {name}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} sx={{ color: theme.palette.grey[100]}}>Cancel</Button>
                <Button onClick={event => hanldeSubmit(event, route, objective, itemKey)} sx={{ color: theme.palette.grey[100]}}>Delete</Button> 
            </DialogActions>
        </Dialog>
  
  );
};
export default Delete;