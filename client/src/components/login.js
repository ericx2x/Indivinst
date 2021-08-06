import React, { Component } from 'react';
import axios from 'axios';
var sha256 = require('sha256');

axios.defaults.withCredentials = true;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordShown: true,
      passEntered: false,
      pass: "",
    };
  }

  componentDidMount(){
    axios.get(`${this.props.baseURL}/api/password/${this.state.pass}`).then((response) => {
      if(response.data.logged){
          this.setState({ passEntered: true, passwordShown: false, checkPass: response.data.password, checkSessionID: response.data.sessionID});
        }
        }).catch(function (error) {
        return JSON.stringify(error);
      });
  }
  
  handlePassEnter(e){
    this.setState({
      pass: e.target.value
    });
  }

  handleSubmitPass(e) {
    axios.post(`${this.props.baseURL}/api/password`, {password: sha256(this.state.pass)}).then((response) => {
             if(response.data==="logged"){
                  this.setState({ passEntered: true });
                  this.setState({
                    message: this.state.value,
                    passwordShown: false,
                  });
             } else {
                  this.setState({
                     incorrectPassword: "You've entered an incorrect password.",
                     message: this.state.value
                });
                setTimeout(()=>{
                  this.setState({
                    incorrectPassword: "",
                    verificationMessage: ""
                  });
                },2000)

             }
        }).catch(function (error) {
        return JSON.stringify(error);
    });
      e.preventDefault();
  }


handleLogout(){
        axios.post(`${this.props.baseURL}/api/password/logout`).then((response) => {
            window.location.reload();
             
        }).catch(function (error) {
        return JSON.stringify(error);
    });
  }

  render() {


    var passwordShown = {
      display: this.state.passwordShown ? "block" : "none"
    };
      
    var hidden = {
      display: this.state.passwordShown ? "none" : "block"
    }
    return (
      <div className="login">
          <div className="header">
            <h1>Login</h1><br/>
          </div>
          <form style={ passwordShown } method="get" className="pure-form pure-form-aligned" onSubmit={this.handleSubmitPass.bind(this)}>
          <fieldset>
            <div className="pure-control-group">
              <div className='pure-control-group'>
                <label>Password</label>
                <input onChange={this.handlePassEnter.bind(this)} id="passenter" type="password" value={this.state.pass} placeholder="Eric's use only"/>
                  <p className="verificationMessage"> {this.state.incorrectPassword} </p>
              </div>
            </div>
            <div className="pure-controls">
              <button type="submit" className="pure-button pure-button-primary messageSubmit-button">Submit</button>
            </div>
          </fieldset>
        </form><button style={ hidden } className="pure-button pure-button-primary logout-button" onClick={this.handleLogout.bind(this)}>Logout</button>
        <p style={ hidden }>You're logged in.</p>
      </div>
    );
  }
}

export default Login;
