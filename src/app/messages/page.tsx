'use client';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { SocketDataContext } from '@/context/SocketContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, Send, User, ChevronLeft,
    MoreVertical, Search, Phone, Video,
    Clock, Check, CheckCheck, MapPin
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

const ChatPage = () => {
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const { socket } = useContext(SocketDataContext);
    const { showToast } = useToast();
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                // Try user profile first
                const userRes = await axios.get('/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => null);

                let userData = null;
                if (userRes?.data?.user) {
                    userData = { ...userRes.data.user, type: 'user' };
                    setCurrentUser(userData);
                } else {
                    // Try captain profile
                    const capRes = await axios.get('/api/captain/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch(() => null);

                    if (capRes?.data?.captain) {
                        userData = { ...capRes.data.captain, type: 'captain' };
                        setCurrentUser(userData);
                    }
                }

                // After fetching user data, fetch conversations and handle query params
                await fetchConversations(userData);
            } catch (err) {
                console.error("Auth error", err);
            }
        };

        fetchUserData();
    }, []);

    const fetchConversations = async (user: any) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/api/messages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const fetchedConvs = response.data.conversations;
            setConversations(fetchedConvs);
            setLoading(false);

            // Handle query params for initiating new chat
            const params = new URLSearchParams(window.location.search);
            const partnerId = params.get('partnerId');
            const partnerType = params.get('partnerType');
            const partnerName = params.get('partnerName');
            const rideId = params.get('rideId');

            if (partnerId && partnerType && partnerId !== 'undefined') {
                const existingConv = fetchedConvs.find((c: any) => c.partnerId === partnerId);
                if (existingConv) {
                    setSelectedConversation(existingConv);
                } else {
                    // Create a virtual conversation for new chat
                    setSelectedConversation({
                        partnerId,
                        partnerType,
                        partnerName: { firstname: partnerName, lastname: '' },
                        messages: [],
                        ride: rideId
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching conversations", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selectedConversation]);

    useEffect(() => {
        if (socket) {
            socket.on('new-message', (msg: any) => {
                // Update conversations list
                fetchConversations(currentUser);

                // If the message is for the currently open conversation, add it
                if (selectedConversation && (msg.sender === selectedConversation.partnerId || msg.receiver === selectedConversation.partnerId)) {
                    setSelectedConversation((prev: any) => ({
                        ...prev,
                        messages: [...prev.messages, msg]
                    }));
                }
            });

            return () => socket.off('new-message');
        }
    }, [socket, selectedConversation]);

    const sendMessage = async () => {
        if (!inputMessage.trim() || !selectedConversation) return;
        if (selectedConversation.partnerId === 'undefined') {
            showToast("Invalid recipient. Please try again from the ride page.", "error");
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const res = await axios.post('/api/messages', {
                receiverId: selectedConversation.partnerId,
                receiverModel: selectedConversation.partnerType,
                content: inputMessage,
                rideId: selectedConversation.ride || selectedConversation.messages?.[0]?.ride
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const newMsg = res.data.message;
            setSelectedConversation((prev: any) => ({
                ...prev,
                messages: [...prev.messages, newMsg]
            }));
            setInputMessage('');
            fetchConversations(currentUser); // Update side list

            if (socket) {
                socket.emit('message', newMsg);
            }
        } catch (err) {
            console.error("Send failed", err);
            showToast("Failed to send message", "error");
        }
    };

    if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-indigo-500"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full"></div></div>;

    return (
        <div className='h-screen flex bg-slate-950 text-white font-sans overflow-hidden'>

            {/* Conversations Sidebar */}
            <div className={`w-full md:w-96 flex flex-col border-r border-slate-800 transition-all ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 md:p-6 bg-slate-900/50">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black text-white tracking-tighter">Messages.</h2>
                        <button onClick={() => router.back()} className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full bg-slate-800 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-4 space-y-2">
                    {conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full opacity-40 text-center px-8">
                            <MessageSquare className="w-12 h-12 mb-4" />
                            <p className="font-bold">No active conversations yet.</p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <motion.div
                                key={conv.partnerId}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => setSelectedConversation(conv)}
                                className={`flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all border ${selectedConversation?.partnerId === conv.partnerId ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-600/20' : 'bg-slate-900 border-slate-800 hover:border-indigo-500/30'}`}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-indigo-400 font-black border border-indigo-500/20">
                                    {conv.partnerName?.firstname?.[0] || 'U'}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-black text-sm text-white leading-none tracking-tight truncate">
                                            {conv.partnerName?.firstname} {conv.partnerName?.lastname}
                                        </h4>
                                        <span className="text-[9px] font-bold text-slate-500">{new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className={`text-xs truncate ${selectedConversation?.partnerId === conv.partnerId ? 'text-indigo-100' : 'text-slate-500'}`}>
                                        {conv.lastMessage}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col transition-all ${selectedConversation ? 'flex' : 'hidden md:flex bg-slate-900/40'}`}>
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 md:p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedConversation(null)} className="md:hidden p-2 bg-slate-800 rounded-xl text-slate-400">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black border border-indigo-500/20">
                                    {selectedConversation.partnerName?.firstname?.[0]}
                                </div>
                                <div>
                                    <h4 className="font-black text-white tracking-tight">{selectedConversation.partnerName?.firstname} {selectedConversation.partnerName?.lastname}</h4>
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">
                                        {selectedConversation.partnerType}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all"><Phone className="w-4 h-4" /></button>
                                <button className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all"><MoreVertical className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 space-y-6 bg-slate-950">
                            {selectedConversation.messages.map((msg: any, idx: number) => {
                                const isMine = msg.sender === currentUser?._id || msg.sender?._id === currentUser?._id;
                                return (
                                    <motion.div
                                        key={msg._id || idx}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] md:max-w-[70%] p-4 rounded-3xl ${isMine ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-900 text-slate-200 rounded-bl-none border border-slate-800'}`}>
                                            <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                            <div className={`flex items-center gap-1.5 mt-2 justify-end ${isMine ? 'text-indigo-200' : 'text-slate-500'}`}>
                                                <span className="text-[9px] font-bold">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                {isMine && <CheckCheck className="w-3 h-3" />}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 md:p-6 bg-slate-900/50 backdrop-blur-xl border-t border-slate-800">
                            <div className="flex items-center gap-4 max-w-5xl mx-auto">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Type your message..."
                                        className="w-full bg-slate-800 border-2 border-slate-700 focus:border-indigo-600 rounded-[2rem] py-4 px-6 text-sm font-bold outline-none transition-all placeholder:text-slate-500"
                                    />
                                </div>
                                <button
                                    onClick={sendMessage}
                                    className="p-4 bg-indigo-600 rounded-full text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-90 transition-all"
                                >
                                    <Send className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-40 p-12 text-center">
                        <div className="w-24 h-24 bg-slate-800 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-700">
                            <MessageSquare className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tighter mb-2">Unified Inbox.</h3>
                        <p className="max-w-xs text-sm font-medium">Select a conversation from the sidebar to start chatting with users or captains.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
