// Importando o React
import React from "react";
// Importando os components necessários da lib react-materialize
import { Row, Col, Card, Input, Button} from 'react-materialize';
// Importando o componenet UserProfile
import Preloader from "react-materialize/lib/Preloader";

var contador = 2;

function showAlert(){
  localStorage.setItem("session","123456");
}

const Loading = () => (
  <Row>
    <Col m={0} s={12}>
      <Col s={12}>
      <Preloader
        active
        color="blue"
        flashing={false}
        size="big"
      />
    </Col>
    </Col>
  </Row>
);


export default Loading;