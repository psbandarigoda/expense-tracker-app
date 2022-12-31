import { Button, Input, Row } from 'antd';
import { Link } from 'react-router-dom';
import './App.css';
function App() {
  return (
    <div className='loginMainBg'>
      <h1 style={{ margin: "0px" }}>Welcome to Personal Expense Tracker Web App</h1>
      <h1 style={{ fontSize: "20px" }}>Login to continue</h1>

      <div style={{ width: "500px" }}>
        <div style={{ marginTop: "10px", marginBottom: "20px" }}>
          <Row>
            <span style={{ fontSize: "20px", marginBottom: "5px" }}>Username</span>
            <Input style={{ height: "52px", fontSize: "18px" }} />
          </Row>
        </div>

        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          <Row>
            <span style={{ fontSize: "20px", marginBottom: "5px" }}>Password</span>
            <Input type='password' style={{ height: "52px", fontSize: "18px" }} />
          </Row>
        </div>

        <div style={{ marginTop: "50px", marginBottom: "10px", display: "flex", justifyContent: "center" }}>
          <Row>
            <Link to={"/main"}>
              <Button style={{
                fontSize: "20px", width: "fit-content", height: "fit-content", backgroundColor: "teal",
                color: "white", fontWeight: "bold", border: "1px solid transparent", borderRadius: "20px"
              }}>LOGIN</Button>
            </Link>
          </Row>
        </div>
      </div>
    </div >
  );
}

export default App;