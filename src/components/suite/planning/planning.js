import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './planning.scss'
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Planning() {
  const [isDeleted, setDelete] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [auth, setAuth] = React.useState(null);
  const [_idd, setIdd] = React.useState(0);

  const deleted = () => {
    setDelete(true);
    toast.success("Product deleted successfully");
  }
  const generalError = () => {
    toast.error("Something went wrong");
  }
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getProducts();
  }, [])

  useEffect(() => {
    if (isDeleted) {
      getProducts();
    }
  }, [isDeleted])

  async function getProducts() {
    var headers = { 'Authorization': localStorage.getItem("session") };
    axios.get('http://localhost:8080/products', { headers })
      .then(response => {
        setAuth(response.data);
      })
      .catch(errorM => {
        setAuth(null);
      });
  }

  async function deleteProj() {
    var headers = { 'Authorization': localStorage.getItem("session") };
    axios.delete('http://localhost:8080/products/' + _idd, { headers })
      .then(response => {
        deleted();
        handleClose();
        setDelete(false);
      })
      .catch(errorM => {
        generalError();
      });
  }


  function clicando(e) {
    var idd = e.target.id;

    if (idd.length <= 0) {
      idd = e.target.parentNode.id;
      if (idd.length <= 0) {
        idd = e.target.parentNode.parentNode.id;
      }
    }
    setIdd(idd);
    handleClickOpen();
  }

  let dialogContent = (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {"Delete a product"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          This action is irreversible, confirm the delete?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={deleteProj} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );

  let createNewProduct = (
    <div>
      <Toolbar>
        <Typography variant="h5" component="div">
          Planning
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
        <Button color="inherit" variant="contained" color="success" component={NavLink} to="/create-new-product">Create</Button>
      </Toolbar>
      <hr />
    </div>
  );


  if (auth && Object.keys(auth).length > 0) {
    return (
      <div>
        {createNewProduct}
        {dialogContent}
        <Box sx={{ flexGrow: 1, marginTop: 3 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {auth.map(block => (
              <Grid key={block.id} item xs={2} sm={4} md={4}>
                <Card sx={{ minWidth: 275, minHeight: 200 }}>
                  <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      Product:
                    </Typography>
                    <Typography variant="h5" component="div">
                      {block.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {block.description}
                    </Typography>
                  </CardContent>
                  <Toolbar className="prod-block">
                    <Button
                      aria-label="delete"
                      id={block.id}
                      onClick={clicando}
                      color="error"
                    >
                      Delete
                    </Button>
                    <Button component={NavLink} to={{
                      pathname: `/product-details/${block.id}`,
                      state: { auth: block }
                    }}>
                      Details
                    </Button>

                  </Toolbar>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>

    );
  } else {
    return (
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        No Product found
      </Typography>
    );
  }
};
