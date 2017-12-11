import React, { Component } from 'react'
import io from 'socket.io-client'

// Connect to socket.io
const socketUrl = 'http://localhost:4000'
const socket = io.connect(socketUrl)

export default class Messages extends Component {

  constructor(props) {
    super(props)

    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    // Grab chats from sockets
    socket.on('output', (data) => {
      // Check if the chat has already been loaded
      if (this.state.messages.length > 0) {
        let newMess = this.state.messages
        newMess.push(data[0])
        // If it has then we add the new message at the end of the array
        this.setState({ messages: newMess })
      } else {
        // If it hasn't then we load the chat
        this.setState({ messages: data })
      }
    })
  }

  render() {
    const { messages } = this.state

    return (
      <div id='chat' className='boxed'>
        {messages.map(message => {
          return <p key={message._id}><strong>{message.name}: </strong>{message.message}</p>
        })}
      </div>
    )
  }
}
