import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../App';
import Socket from '../socket'
import { Sender } from '../message'

let mockSocket = {
    subscribeToMessages: jest.fn(),
    sendMessage: jest.fn(),
    inviteToChat: jest.fn(),
    handleUserCountChange: jest.fn(),
    join: jest.fn(),
};
jest.mock('../socket', () => {
    return jest.fn().mockImplementation(() => {
        return mockSocket;
    });
});

beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
});

afterEach(() => {
    jest.clearAllMocks();
});

it('renders without crashing', () => {
    window.prompt = function(){};
    const div = document.createElement('div');

    ReactDOM.render(<App />, div);

    expect(Socket).toBeCalled();

    ReactDOM.unmountComponentAtNode(div);
});

it('shows invite modal on invite button click', () => {
    const wrapper = Enzyme.shallow(<App />)

    wrapper.find('#display-invite-modal-button').simulate('click');

    expect(wrapper.state().shouldShowInviteModal).toBeTruthy();
});

it('sends an invite on send button click', () => {
    const number = '1234567890';
    const userName = 'me';
    const wrapper = Enzyme.shallow(<App />)
    wrapper.setState({user: new Sender(userName)});

    wrapper.find('#display-invite-modal-button').simulate('click');
    wrapper.find('#number-invite-input').simulate('change', {
        target: { value: number }
    });
    wrapper.find('#invite-send-button').simulate('click');

    expect(wrapper.state().shouldShowInviteModal).toBeFalsy();
    expect(mockSocket.inviteToChat.mock.calls.length).toBe(1);
    expect(mockSocket.inviteToChat.mock.calls[0][0]).toBe(userName);
    expect(mockSocket.inviteToChat.mock.calls[0][1]).toBe(number);
});
