import React, { Component } from 'react';
import Header from './components/header/header'
import Login from './components/login/login'
import axios from 'axios';
import $ from 'jquery';
import jwt_decode from "jwt-decode";


class App extends Component {

  ensurePageAccess() {






    let route = window.location.pathname;

  }

  async getAuth() {
    var body = { session: localStorage.getItem("session") };
    var headers = { 'Content-Type': 'application/json' };
    axios.post('http://localhost:8080/session/validate', body, { headers })
      .then(response => {
        this.setState({
          auth: true
        });
      })
      .catch(errorM => {
        this.setState({
          auth: false
        });
      })
      ;
  }

  constructor(props) {
    super(props);
    this.state = { auth: false };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidUpdate() {
    let contacts = new Map()
    contacts.set('Jessie', { phone: "213-555-1234", address: "123 N 1st Ave" })

    console.log('updt ' + window.location.pathname + ' - ' + contacts.get('Jessie'));
    Object.keys(contacts.get('Jessie')).forEach(key => {
      console.log(key, contacts.get('Jessie')[key]);
    });

    var token = "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJzb2Z0dGVrSldUIiwic3ViIjoiYWRtaW4iLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiLCJST0xFX0RFViJdLCJpYXQiOjE2MzY0ODg5MzIsImV4cCI6MTYzNjQ4OTUzMn0.jHaWX6y7-wfCsM1ggHpMkuDPOdME841wZBiB3BTBcQUezUbS6o5I-SjUCiWBl841szKvWds";
    var decoded = jwt_decode(token);

    console.log(decoded);
  }

  componentDidMount() {
    //document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('keypress', this.handleClickOutside);
    this.getAuth();
  }

  componentWillUnmount() {
    //document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('keypress', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleStatusChange() {
    this.setState({
      auth: true
    });
  }

  handleClickOutside(event) {
    console.log('event!');
    if (event.keyCode === 32 || event.keyCode === 13 || event.which === 1) {
      if (this.state.auth != false) {
        this.getAuth();
      }
    }
  }

  render() {
    if (this.state.auth === false) {
      return (
        <div>
          <Login />
        </div >
      );
    }
    return (
      <div>
        <Header />
      </div>
    );
  }
}

export default App;