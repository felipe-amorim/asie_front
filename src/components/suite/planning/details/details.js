import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from 'axios';
import $ from 'jquery';
import { toast } from 'react-toastify';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

const ProductDetails = _ => {
  const updated = () => toast.success("Product " + _name + " updated successfully");
  const unauthorized = () => toast.error("Unauthorized");
  const conflictExists = () => toast.error("Product name already exists");
  const generalError = () => toast.error("Something went wrong");

  const { state } = useLocation();
  const [description, setDescription] = React.useState("");
  const [backButton, setBackButton] = React.useState("Back");
  const [backButtonColor, setBackButtonColor] = React.useState("primary");
  const [sendButtonLoading, setSendButtonLoading] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [kname, setKname] = React.useState("");
  const [kdescription, setKdescription] = React.useState("");
  const [nameEquals, setNameEquals] = React.useState(true);
  const [descriptionEquals, setDescriptionEquals] = React.useState(true);
  const [authError, setAuthError] = React.useState("");

  var _name;
  var _description;
  var nameLenght = 6;
  var descriptionLenght = 6;

  useEffect(() => {
    getProductDetails();
  }, [])

  async function getProductDetails() {
    var headers = { 'Authorization': localStorage.getItem("session") };
    axios.get('http://localhost:8080/products/' + state.auth.id, { headers })
      .then(response => {
        var respData = response.data;
        setKname(respData.name);
        setKdescription(respData.description);
        setDescription(respData.description);
      })
      ;
  }

  function textChangeName(e) {
    if (e.target.value === kname) {
      setNameEquals(true);
      if (descriptionEquals) {
        setSendButtonLoading(true);
        setBackButton("Back");
        setBackButtonColor("primary");
      }else{
        setSendButtonLoading(false);
        setBackButton("Cancel");
        setBackButtonColor("error");
      }
    } else {
      setNameEquals(false);
      setSendButtonLoading(false);
      setBackButton("Cancel");
      setBackButtonColor("error");
    }
  }

  function textChangeDesc(e) {
    if (e.target.value === kdescription) {
      setDescriptionEquals(true);
      if (nameEquals) {
        setSendButtonLoading(true);
        setBackButton("Back");
        setBackButtonColor("primary");
      }else{
        setSendButtonLoading(false);
        setBackButton("Cancel");
        setBackButtonColor("error");
      }
    } else {
      setDescriptionEquals(false);
      setSendButtonLoading(false);
      setBackButton("Cancel");
      setBackButtonColor("error");
    }
  }

  function handleClick() {
    setLoading(true);
    let err = "";
    _name = $('#name').val();
    if (!_name || _name.length < nameLenght) {
      err = err + "name";
    }
    _description = $('#description').val();
    if (!_description || _description.length < descriptionLenght) {
      err = err + "description";
    }
    setAuthError(err);
    if (err === "" && _name && _description) {
      putProduct();
    } else {
      setLoading(false);
    }
  }

  async function putProduct() {
    let _status;
    var body = { name: _name, description: _description };
    var headers = { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("session") };
    axios.put('http://localhost:8080/products/' + state.auth.id, body, { headers })
      .then(response => {
        $("#cancel")[0].click();
        updated();
      })
      .catch(errorM => {
        _status = errorM.response.status;
        if (_status === 403) {
          unauthorized();
        } else if (_status === 409) {
          conflictExists();
        } else if (_status >= 400) {
          generalError();
        }
      })
      .finally(errorM => {
        setLoading(false);
      });
  }

  return (
    <div>
      <Typography variant="h5" component="div">
        Product details
      </Typography>
      <hr />
      <div>
        <Grid item xs={4}
          sx={{ marginTop: 2 }}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <TextField
                id="name"
                placeholder="Name"
                fullWidth
                name="name"
                label="Name"
                variant="filled"
                defaultValue={state.auth.name}
                onChange={textChangeName}
                helperText={authError.includes("name") ? "The product name must be at least " + nameLenght + " characters" : ""}
                error={authError.includes("name")}
              />
            </Grid>
            <Grid item>
              <TextField
                id="description"
                type="description"
                placeholder="Description"
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Description"
                variant="filled"
                defaultValue={description}
                onChange={textChangeDesc}
                helperText={authError.includes("description") ? "The product description must be at least " + descriptionLenght + " characters" : ""}
                error={authError.includes("description")}
              />
            </Grid>
            <Grid item>
              <Toolbar className="right-content">
                <Button
                  id="cancel"
                  variant="contained"
                  color={backButtonColor}
                  type="submit"
                  sx={{ minWidth: 150, margin: 1 }}
                  component={NavLink} to="/planning"
                >
                  {backButton}
                </Button>
                <LoadingButton
                  id="submit"
                  onClick={handleClick}
                  loading={loading}
                  variant="contained"
                  className="button-block"
                  sx={{ minWidth: 150, margin: 1 }}
                  color="primary"
                  loading={sendButtonLoading}
                  loadingIndicator="Submit"
                >
                  Submit
                </LoadingButton>
              </Toolbar>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ProductDetails;