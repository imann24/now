import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Socket from './socket'

class App extends Component {
    socket = new Socket()
    state = {
        post: '',
        conversation: [],
    };
    componentDidMount() {
        this.socket.subscribeToMessages((data) => {
            const lastElementIdx = this.state.conversation.length - 1;
            const mostRecentMessage = this.state.conversation[lastElementIdx];
            if (mostRecentMessage && mostRecentMessage.startsWith("YOU")) {
                this.setState(prevState => ({
                    conversation: [...prevState.conversation.slice(0, lastElementIdx), mostRecentMessage.concat(" " + data)]
                }));
            } else {
                this.setState(prevState => ({
                    conversation: [...prevState.conversation, "YOU: " + data]
                }));
            }
        });
    }
    onKeyPress = event => {
         if (event.key == " ") {
              if (this.state.post == " ") {
                   this.setState({post: ""})
              } else {
                   this.handleSubmit();
              }
         }
    }
    handleSubmit = async e => {
        if (e) {
             e.preventDefault();
        }
        const lastElementIdx = this.state.conversation.length - 1;
        const mostRecentMessage = this.state.conversation[lastElementIdx];
        if (mostRecentMessage && mostRecentMessage.startsWith("ME")) {
             this.setState(prevState => ({
                  conversation: [...prevState.conversation.slice(0, lastElementIdx), mostRecentMessage.concat(" " + this.state.post)]
             }));
        } else {
             this.setState(prevState => ({
                  conversation: [...prevState.conversation, "ME: " + this.state.post]
             }));
        }
        this.socket.sendMessage(this.state.post);
        this.setState({post: ""})
    };
    render() {
        return (
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
            </header>
            <form onSubmit={this.handleSubmit}>
                <p>
                    <strong>Say Something:</strong>
                </p>
                <input
                    type="text"
                    value={this.state.post}
                    onKeyPress={this.onKeyPress}
                    onChange={e => this.setState({ post: e.target.value })}/>
            </form>
            {this.state.conversation.slice().reverse().map((value, index) => {
                 if (value.startsWith("YOU: ")) {
                      return <p key={index}><b>YOU: </b>{value.replace("YOU: ", "")}</p>
                 } else if (value.startsWith("ME: ", "")) {
                      return <p key={index}><b>ME: </b>{value.replace("ME: ", "")}</p>
                 }
            })}
          </div>
        );
    }
}

export default App;
