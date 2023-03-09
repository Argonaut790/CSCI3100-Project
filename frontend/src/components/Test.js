import { Component } from "react";
import axios from "axios";

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { username, email, password } = this.state;
    try{
      await axios.post("http://localhost:5500/test",
      {username, email, password});
      console.log("POST SUCCESSFULLY");
    }catch(e){
      console.log(e);
      console.log("can't POST!");
    }
  }

  // handleSubmit(e) {
  //   e.preventDefault();
  //   const { username, email, password } = this.state;
  //   console.log(username, email, password);
  //   fetch("http://localhost:5500/test", {
  //       method:"POST", 
  //       crossDomain:true,
  //       headers:{
  //           "Content-Type":"application/json",
  //       },
  //       body:JSON.stringify({
  //           username,
  //           email,
  //           password
  //       })
  //   }).then(res => res.json())
  //   .then((data) => {
  //       console.log(data, "stored in db")
  //   })
  // }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} action="POST">
          <label>
            Username:
            <input type="text" name="username" onChange={(e) => this.setState({username:e.target.value})} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" onChange={(e) => this.setState({email:e.target.value})} required />
          </label>
          <label>
            Password:
            <input type="password" name="password" onChange={(e) => this.setState({password:e.target.value})} required />
          </label>
          <button type="submit">Create Account</button>
        </form>
      </div>
    );
  }
}