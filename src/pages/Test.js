/* eslint-disable camelcase */
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect, useContext, useCallback } from "react";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Box,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  useTheme,
} from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import Dialogue from "../components/Dialogue"
import DeleteDialogue from "../components/DeleteDialogue";
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { TestApis } from '../utils/AxiosProvider';

// ----------------------------------------------------------------------



// ----------------------------------------------------------------------


export default function Test() {

  const [isOpen, setisOpen] = useState(false);

  const [action, setAction] = useState({action:"", itemKey: "", edits: {title:"", description:"", social_type: ""}});

  const [isOpenDelete, setisOpenDelete] = useState(false);

  const [name, setname] = useState("");

  const [projectData, setprojectData]  = useState([]);

  const theme = useTheme();

  const fields = [{fieldName: "Title", storeName: "title", type:"input"}, {fieldName: "Description", storeName: "description", type:"input"}, {fieldName: "Social Type", storeName: "social_type", type:"select"}];

  const testApis = useContext(TestApis);

    const loadData = async () => {
        const response = await testApis.get('/social_campaign').then((response) => {
          setprojectData(response.data);
    })
}


  useEffect(() => {
      loadData();
  },[])





const columns = [ 
  { field: "id", headerName:"ID" },
  {field: "title", headerName: "Title", cellClassName: "title-column--cell", minWidth: 300 },
  { field: "description", headerName:"Description",  minWidth: 300},       
  { field: "social_type", headerName:"Social Type" },
  { field: "action", headerName:"", minWidth: 200, headerAlign: "center", flex:1, renderCell: ({row: {id, title, description, social_type }}) => {
      return(
          <Box      
              m="0"
              p="0"
              display="flex"
              justifyContent="flex-start"
              alignItems= "left"
              
          >
              <Box
                  m="2px"
                  p="2px"
                  display="flex"
                  justifyContent="space-between"
                  backgroundColor={theme.palette.success.light}
                  borderRadius="4px"
                  sx={{ cursor: "pointer", color: theme.palette.common.white }}
                  onClick={()=> handleEdit("Edit",{ id, title, description, social_type })}
              >
                  {/* <EditOutlinedIcon /> */}
                  <Typography sx={{  my: "auto", text: "center", fontWeight: "bold", color: theme.palette.success.dark }}>
                      Edit
                  </Typography>
              </Box>
              <Box
                  m="2px"
                  p="4px"
                  display="flex"
                  justifyContent="space-between"
                  backgroundColor={theme.palette.error.light}
                  color={theme.palette.common.white}
                  borderRadius="4px"
                  sx={{ cursor: "pointer" }}
                  onClick={()=> deleteEntry(id, title, 'Delete')}
              >
                  {/* <DeleteForeverOutlinedIcon /> */}
                  <Typography sx={{ my: "auto", text: "center", fontWeight: "bold",  color:  theme.palette.error.dark }}>
                      Delete
                  </Typography>
              </Box>
          </Box>
      )

  } },
]


  function handleEdit(option, data){


    setAction(action =>({
        ...action,
        action : option,
        itemKey: data.id,
        edits: data
     }),
     )  
    setisOpen(true);
    

}

function handleClick(option, key){


    setAction(action =>({
        ...action,
        action : option,
        itemKey: key
     }),
     )  
    setisOpen(true);
    

}


const resetOpen = useCallback(() => {

    setisOpen(false);
    setisOpenDelete(false);
    setname("");
    setTimeout(()=>{

        const copyOfObject = { ...action }

        Object.keys(copyOfObject).forEach(k => { copyOfObject[k] = ""; })

        setAction( action => ({
            ...copyOfObject
          }));

        loadData();

    },200)
    

}, [action])


function deleteEntry(key, title, option) {
    console.log(key, title);
    setname(title);
    
    setAction(action =>({
        ...action,
        action : option,
        itemKey: key
     }),
     )  
    setisOpenDelete(true);
    
}
  return (
    <>
        <Helmet>
          <title> User | Minimal UI </title>
        </Helmet>
    <Box m="20px">
        <Dialogue isToggled={isOpen} toggleOff={resetOpen} objective={action.action} itemKey={action.itemKey} route="social_campaign" formFields={fields} edits={[action.edits]} label="social campaign" />

        <DeleteDialogue isToggled={isOpenDelete} toggleOff={resetOpen} objective={action.action} itemKey={action.itemKey} route="social_campaign" name={name} label="social campaign" />

        <Stack direction="row" alignItems="center"        justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
            Social Campaign
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}  onClick={()=> handleClick("Add")}>
              New Campaign
            </Button>
          </Stack>

            <Box
            m="40px 0 0 0"
      
            sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: theme.palette.grey[300],
                  borderBottom: "none",
                },
                "& .MuiDataGrid-columnHeader": {
                    backgroundColor: theme.palette.grey[300],
                    borderBottom: "none",
                  },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                  backgroundColor: theme.palette.grey[300],
                 
                 
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: theme.palette.common.white,
                },
                "& .MuiCheckbox-root": {
                  color: `${theme.palette.success.lighter} !important`,
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${theme.palette.grey[100]} !important`,
                    display: 'flex',
                  },
                '@media (max-width: 780px)' : {
                    width: "98vw",
                    margin: "40px -10px 0 -15px",

                },
                "&  .MuiDataGrid-filterForm": {
                    color: 'red',

                    flexWrap: 'wrap',
                    backgroundColor:'red',

                }
       

              }}
        >
          <DataGrid
                rows={projectData}
                columns={columns}
                initialState={{
                    ...projectData.initialState,
                    pagination: { paginationModel: { pageSize: 25 } },
                  }}
                  pageSizeOptions={[5, 10, 25]}
            /> 
        </Box>
    </Box>
    </>
    )

}
