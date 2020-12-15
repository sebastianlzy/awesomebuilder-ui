import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
class App extends Component {
  state = {
    response: '',
    post: '',
  };
  componentDidMount() {
    this.callApi()
        .then(res => this.setState({ response: res.hostname }))
        .catch(err => this.setState({ response: JSON.stringify(err) }));
  }
  callApi = async () => {
    const response = await fetch('/api/get-instance-hostname');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log(body)
    return body;
  };
  render() {
    return (
        <div className="App">
          <p>{this.state.response}</p>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>

        </div>
    );
  }
}
export default App;