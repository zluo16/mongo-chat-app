import React, { Component } from 'react';
import io from 'socket.io-client'
import Messages from './components/messageList'
import './App.css';

// Connect to socket.io
const socketUrl = 'http://localhost:4000'
const socket = io.connect(socketUrl)

class App extends Component {

  state = {
    name: '',
    message: '',
    status: ''
  }

  componentWillMount() {
    socket.on('status', status => {
      this.setState({ status: status.message })
    })
  }

  // Handle input
  onSubmit = () => {
    let { name, message } = this.state
    let data = Object.assign({}, { name: name }, { message: message })

    // Emit to server input
    socket.emit('input', data)
  }

  // Handle change in inputs
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    return (
      <div className="App wrapper">
        <div className='title'>
          <h1>MongoChat</h1>
          <button id='clear'>Clear</button>
        </div>
        <input type='text' className='name-input' name='name' onChange={this.handleChange} />
        <div className='status'>
          <p>{this.state.status}</p>
        </div>
        <Messages messages={this.state.messages} />
        <form className='message-form' onSubmit={this.onSubmit}>
          <input className='message-input' type='text' name='message' onChange={this.handleChange} />
        </form>
      </div>
    );
  }
}

export default App;
