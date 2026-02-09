import React, { useState, useEffect, useRef, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import axios from 'axios';

const ChatPanel = ({ ride, user, userType, setChatPanelOpen }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const { socket } = useContext(SocketContext);
    const scrollRef = useRef(null);

    useEffect(() => {
        // Join the chat room
        socket.emit('join-chat', { rideId: ride._id });

        // Fetch history
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/chats/${ride._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setMessages(response.data);
            } catch (err) {
                console.error('Error fetching chat history:', err);
            }
        };
        fetchHistory();

        // Listen for new messages
        socket.on('receive-message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off('receive-message');
        };
    }, [ride._id, socket]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const messageData = {
            rideId: ride._id,
            senderId: user._id,
            senderType: userType,
            receiverId: userType === 'user' ? ride.captain : ride.user,
            receiverType: userType === 'user' ? 'captain' : 'user',
            content: input
        };

        socket.emit('send-message', messageData);
        setInput('');
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-t-3xl shadow-2xl border-t border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50 rounded-t-3xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
                        <i className="ri-user-3-fill"></i>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">
                            {userType === 'user' ? (ride.captain.fullname?.firstname || 'Captain') : (ride.user.fullname?.firstname || 'Rider')}
                        </h3>
                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Chat</p>
                    </div>
                </div>
                <button onClick={() => setChatPanelOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all">
                    <i className="ri-close-line text-2xl text-gray-400"></i>
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5]">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm text-sm ${msg.senderId === user._id
                                ? 'bg-green-500 text-white rounded-tr-none'
                                : 'bg-white text-gray-800 rounded-tl-none'
                            }`}>
                            <p>{msg.content}</p>
                            <span className={`text-[10px] block mt-1 text-right ${msg.senderId === user._id ? 'text-green-100' : 'text-gray-400'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-4 bg-gray-50 flex items-center gap-2 border-t border-gray-200">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-white border border-gray-300 rounded-full px-5 py-3 outline-none focus:border-green-500 transition-all text-sm"
                />
                <button type="submit" className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-all">
                    <i className="ri-send-plane-2-fill text-xl"></i>
                </button>
            </form>
        </div>
    );
};

export default ChatPanel;
