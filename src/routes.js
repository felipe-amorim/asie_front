import React from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import PropTypes from 'prop-types';
import Login from "./components/login/login";

class PrivateRoute extends React.Component {
    estaAutenticado = () => {
        //this.getAuth();
        //console.log('routes');
        if (localStorage.getItem('sessiona')) {
            //console.log('routes true');
            return true
        } else {
            //console.log('routes false');
            return false
        }
    }

    render() {
        const { component: Component, ...props } = this.props
        if (this.estaAutenticado()) {
            return <Component {...props} />
        }
         //else {
          return <Redirect to="/" />
          //return <Component {...Login} />
          //return <Component {...Login} />
        //}
    }
}
//PrivateRoute.propTypes = {
//    children: PropTypes.element.isRequired,
//};

export default PrivateRoute;
