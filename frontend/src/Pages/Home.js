import React from 'react';
import { Button, Card, Col, Row } from 'antd';
import "./Home.css"
import Rocket from "../images/rocket.png"
import Mail from "../images/mail.png"
import Meta from 'antd/es/card/Meta';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate=useNavigate()
    return(
        <div className="Home">
  <Row gutter={16} style={{paddingLeft:"200px"}}>
    <Col span={10}>
    <Card
    hoverable
    style={{ width: 340 }}
    bordered={false}
    onClick={()=>navigate("/contacts")}
    cover={<img alt="example" src={Rocket} style={{padding:"50px"}}/>}
  >
    Send Message
  </Card>
    </Col>
    <Col span={10}>
    <Card
    hoverable
    style={{ width: 440 }}
    bordered={false}
    onClick={()=>navigate("/receive")}
    cover={<img alt="example" src={Mail} />}
  >
    View Messages
  </Card>
    </Col>
   
  </Row></div>)
};
export default Home;