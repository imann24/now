import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Socket from './socket'
import {Conversation, Message, Sender} from './message'

class App extends Component {
    socket = new Socket(document.location.pathname.replace('/', ''))
    state = {
        text: '',
        user: new Sender(prompt('What\'s your name?')),
        conversation: new Conversation(),
    }
    componentDidMount() {
        this.socket.subscribeToMessages((data) => {
            this.setState(previouState => ({
                state: previouState.conversation.addMessage(data)
            }));
        });
        if (!this.state.user.name) {
            this.setState({user: new Sender('Anonymous')});
        }
    }
    onKeyPress = event => {
         if (event.key === ' ') {
              if (this.state.text === ' ') {
                   this.setState({text: ''});
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
              <img src={logo} className="App-logo" alt="logo" />
            </header>
            <form onSubmit={this.handleSubmit}>
                <p>
                    <strong>Say Something, {this.state.user.name}:</strong>
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
