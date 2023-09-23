import { useState , useEffect, Fragment, useContext } from "react";
import { Box, useTheme } from "@mui/material";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useForm , Controller, useFieldArray, useFormContext } from "react-hook-form";
import FormHelperText from '@mui/material/FormHelperText';
import { TestApis } from '../utils/AxiosProvider';

const requiredFields = {
    social_campaign: { required: ['title', 'description', 'social_type'], params: {title:"", description:"", social_type: ""} } ,
    project: { required: [''], params: {} },
    customer: { required: [''], params: {} },
    agent: { required: ['first_name','last_name','email','contact'], params: {first_name:"", last_name:"", email:"", contact:"", position:""} },
  };


const Dialogue = ({ isToggled, toggleOff, objective, itemKey, route, formFields, edits, label }) => {

    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");   

   const [inputs, setInputs] = useState(requiredFields[route].params);

   let defaults;

   if(objective === 'Edit' && edits.length > 0){

        defaults = edits;

   }else{

        defaults = requiredFields[route].params;

   }


   const { handleSubmit, control, register, reset, getValues, formState, clearErrors, formState: { isDirty, errors }, } = useForm({ defaultValues: inputs , mode: "onBlur" });


   useEffect(() => {

 

    if(formState.isSubmitSuccessful){
        reset();
    }

   },[formState, reset])


    const testApis = useContext(TestApis);


    const validationHelper = {
        title: {
            required: "A title is required ",
        },
        description: {
            required: "A description is required ",
        },
        social_type: {
            required: "A social type is required ",

        },
        first_name: {
            required: "A first name is required ",

        },
        last_name: {
            required: "A last name is required ",

        },
        email: {
            required: "An email is required ",

        },
        contact: {
            required: "A conatct number is required ",

        },
       
    }



const hanldeOnSubmit = (data, route, action, key, inputs)=> {


            let apiURL;

            if( objective === 'Edit' ) {

                apiURL =`/${route}/update/${itemKey}`;
            
            }else{
                
                apiURL =  `/${route}/post`; 
            }

            console.log(apiURL);
            console.log(data);

      
                const apiCall = async () => {
                    const response = await testApis.post(apiURL, inputs).then((response) => {
                        
                        handleClose();
                       
                })
            }
        
         apiCall();

        
    } 

    
    const handleChange = ( field, value ) => {

              
            setInputs(inputs =>({
            ...inputs,
            [field] : value,
            }),
            )  
      

    }


     useEffect(() => {

        if(isToggled){

            if(edits.length > 0){

                reset(edits[0]);

                Object.entries(edits[0]).map(entry => {
                    const key = entry[0];
                    const value = entry[1];
            
                    setInputs(inputs =>({
                        ...inputs,
                        [key] : value,
                    }),
                    ) 

                    return key;
                });

    
        }

            setOpen(true);
        }
    },[isToggled]);


    const handleClose = () => {

       const copyOfObject = { ...inputs }

        Object.keys(copyOfObject).forEach(k => { copyOfObject[k] = ""; })

        setInputs( inputs => ({
            ...copyOfObject
          })); 

       
        setOpen(false);
        toggleOff();
       
       
    
    }


    const handleSelect = (name , value) => {
       

        setInputs(inputs =>({
            ...inputs,
            [name] : value,
         }),
         )  
    };


  return ( 
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle variant="h2" display="flex" justifyContent="center"sx={{textTransform: "uppercase"}}>{objective} {label}</DialogTitle>
        <DialogContent color={theme.palette.grey[100]}>
            <DialogContentText>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            </DialogContentText>



            {formFields.map((item, index) => {

                const currentField = item.storeName;

                const isRequired = requiredFields[route].required.includes(currentField);

        
                return (

                    <Fragment key={index}>

                    { item.type === 'select' ?

              <Controller
                        control={control}
                        name={currentField}
                        rules={{ required: isRequired  }}
                        render={({
                        field: { onChange, value, onBlur },
                        fieldState: { error } ,
                        })=> ( 

                            <Box sx={{ my:"10px" }}>
                            <InputLabel id="demo-simple-select-helper-label">{item.fieldName}</InputLabel>
                            <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            label="Age"
                            onChange={onChange}
                            {...register(item.storeName, { required: isRequired , onChange: (e) => {


                                   handleSelect(e.target.name, e.target.value);
                                 

                                } })}
                            error={ error !== undefined }
                            value={inputs[item.storeName]}
                            sx={{ width: '100%'}}
                            >
                                <MenuItem value="">
                                <em>None</em>
                                </MenuItem>
                                <MenuItem value="facebook">Facebook</MenuItem>
                                <MenuItem value="instagram">Instagram</MenuItem>
                                <MenuItem value="twitter">Twitter</MenuItem>
                            </Select>
                            <FormHelperText>{ error ? 'A social type is required' : '' }</FormHelperText>
                        </Box>

                        )}

                        />  

                        :  
                        
                        <Controller
                        control={control}
                        name={currentField}
                        rules={{
                            required: { value: isRequired , message: "Required" },
                        }}
                        render={({
                           field : { value, onChange, onBlur },
                           fieldState: { error, invalid, isDirty } ,
                        
                        })=> ( 
                        
                            <TextField
                            {...register(item.storeName, { required: isRequired , onChange: (e) => {

                                
                           
                                handleChange(item.storeName, e.target.value);
                                clearErrors(currentField);

                            } })}
                           
                            margin="dense"
                            id={item.fieldName}
                            label={item.fieldName}
                            type={item.fieldType}
                            error={  error !== undefined }
                            helperText={ error ? validationHelper[item.storeName].required : '' }                         
                            fullWidth
                            variant="standard"
                            value ={inputs[item.storeName]}
                            sx={{
                                '& .css-1rwfsi4-MuiFormLabel-root-MuiInputLabel-root.Mui-focused' : {
                                    color: theme.palette.success.darker,
        
                                }
                            }}
                           // onChange={event => handleChange(event, item.storeName)}
                            multiline
                            />

           
                    )}
        
                 />}

               
                    </Fragment>
                )
            })}
      
        </DialogContent>
        <DialogActions>
        <Button onClick={()=>{ handleClose();  clearErrors();}} sx={{ color: theme.palette.grey[400]}}>Cancel</Button>
        <Button onClick={handleSubmit(data => hanldeOnSubmit(data, route, objective, itemKey, inputs))} sx={{ color: theme.palette.info[500]}}>Submit</Button> 
        </DialogActions>
        </Dialog>
  
  );
};

export default Dialogue;