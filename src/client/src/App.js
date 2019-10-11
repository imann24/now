import React, { Component } from 'react';
import Modal from 'react-modal';
import logo from './logo.svg';
import './App.css';
import Socket from './socket'
import {Conversation, Message, Sender} from './message'

class App extends Component {
    socket = new Socket(document.location.pathname.replace('/', ''))
    state = {
        text: '',
        user: new Sender(prompt('What\'s your name?')),
        numberToInvite: '',
        conversation: new Conversation(),
        shouldShowInviteModal: false,
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
            text: '',
            conversation: previousState.conversation.addMessage(newMessage),
        }));
        this.socket.sendMessage(newMessage);
    }

    showInviteModal = () => {
        this.setState({ shouldShowInviteModal: true });
    }

    hideInviteModal = () => {
        this.setState({ shouldShowInviteModal: false });
    }

    handleInviteNumberChange = event => {
        this.setState({numberToInvite: event.target.value});
    }

    sendChatInvite = () => {
        this.socket.inviteToChat(this.state.user.name,
                                 this.state.numberToInvite);
    }

    render() {
        return (
          <div className='App'>
            <header className='App-header'>
              <img src={logo} className='App-logo' alt='logo' />
            </header>

            <Modal isOpen={this.state.shouldShowInviteModal}
                   onRequestClose={this.hideInviteModal}
                   style={{
                       content: {
                           margin: 'auto',
                           width: '25vw',
                           height: '15vh' }}}
                   contentLabel='Invite Modal'
                   ariaHideApp={false}>
                   <div id='invite-modal-header'>
                       <b>Invite a friend to chat with you...</b>
                   </div>
                   <div>
                       <label>Phone</label>
                       <input onChange={this.handleInviteNumberChange}></input>
                   </div>
                   <div>
                       <button id='invite-send-button' onClick={(event) => {
                           this.sendChatInvite();
                           this.hideInviteModal(); }}>Send</button>
                   </div>
            </Modal>
            <button onClick={this.showInviteModal}>Invite</button>

            <form onSubmit={this.handleSubmit}>
                <p>
                    <strong>Say Something, {this.state.user.name}:</strong>
                </p>
                <input
                    type='text'
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
