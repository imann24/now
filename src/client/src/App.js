import 'bootstrap/dist/css/bootstrap.min.css';

import React, { Component } from 'react';
import Modal from 'react-modal';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
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
        memberCount: 1,
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
        this.socket.onReady(() => {
            this.socket.join(this.state.user.id);
        });
        this.socket.onMemberCountChange((count) => {
            alert(count);
            this.setState({memberCount: count});
        });
    }
    componentWillUnmount() {
        this.socket.leave(this.state.user.id);
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

            <Modal id='invite-modal'
                   isOpen={this.state.shouldShowInviteModal}
                   onRequestClose={this.hideInviteModal}
                   style={{
                       content: {
                           margin: 'auto',
                           width: '30vw',
                           height: '22.5vh' }}}
                   contentLabel='Invite Modal'
                   ariaHideApp={false}>
                   <div id='invite-modal-header'>
                       <b>Invite a friend to chat with you...</b>
                   </div>
                   <div>
                       <InputGroup className="mb-3">
                           <InputGroup.Prepend>
                           <InputGroup.Text id="basic-addon1">Phone</InputGroup.Text>
                           </InputGroup.Prepend>
                           <FormControl placeholder="(000) 000-0000"
                                        aria-label="(000) 000-0000"
                                        aria-describedby="basic-addon1"
                                        onChange={this.handleInviteNumberChange}/>
                       </InputGroup>
                   </div>
                   <div>
                       <Button id='invite-send-button'
                               variant='primary'
                               onClick={(event) => {
                           this.sendChatInvite();
                           this.hideInviteModal(); }}>Send</Button>
                   </div>
            </Modal>

            {this.state.memberCount < 2 &&
                <Button variant='primary'
                        onClick={this.showInviteModal}>Invite</Button>
            }

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
