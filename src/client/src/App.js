import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Socket from './socket'
import {Conversation, Message, Sender} from './message'

class App extends Component {
    socket = new Socket()
    state = {
        text: '',
        user: new Sender(prompt("What's your name?")),
        conversation: new Conversation(),
    }
    componentDidMount() {
        this.socket.subscribeToMessages((data) => {
            this.setState(previouState => ({
                state: previouState.conversation.addMessage(data)
            }));
        });
    }
    onKeyPress = event => {
         if (event.key == " ") {
              if (this.state.text == " ") {
                   this.setState({text: ""})
              } else {
                   this.handleSubmit();
              }
         }
    }
    handleSubmit = async e => {
        if (e) {
             e.preventDefault();
        }
        let newMessage = new Message(this.state.user, this.state.text)
        this.setState(previousState => ({
            text: "",
            conversation: previousState.conversation.addMessage(newMessage),
        }));
        this.socket.sendMessage(newMessage);
    };
    render() {
        return (
          <div className="App">
            <header className="App-header">
              <img src={logo} alt="logo" />
	      <p>Welcome to ChatNow, {JSON.stringify(this.state.user.name)}</p>
            </header>
            <form onSubmit={this.handleSubmit}>
                <p>
                    <strong>Say Something:</strong>
                </p>
                <input
                    type="text"
                    value={this.state.text}
                    onKeyPress={this.onKeyPress}
                    onChange={e => this.setState({ text: e.target.value })}/>
            </form>
            {this.state.conversation.messages.slice().reverse().map((value, index) => {
                  return <p key={index}><b>{value.sender.name}: </b>{value.text}</p>
            })}
          </div>
        );
    }
}

export default App;
