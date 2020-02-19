import React, { Component } from "react";
import { apiEndPoint } from "./config/index";
import axios from "axios";
import "./App.css";

type GithubLoginProps = {
  history: any,
  user: any,
  location: any
}

class GithubLogin extends Component<GithubLoginProps> {
  onSuccess = async (code: string) => {
    const { data, status } = await axios.get(
      `${apiEndPoint}/api/login/github/${code}`
    );
    if (status === 200) {
      console.log(data);
      localStorage.setItem("user", JSON.stringify(data));
      this.props.history.push("/");
    } else {
      alert("error occured");
    }
  };

  render() {
    const { search } = this.props.location;
    const { user } = this.props;
    console.log("---user---", this.props);
    if (search) {
      const [, code] = search.split("=");
      this.onSuccess(code);
      console.log("-code-", code);
    }
    return (
      <div className="App">
        <header className="App-header">Loggin to github.....</header>
      </div>
    );
  }
}

export default GithubLogin;
