'use client';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { SocketDataContext } from '@/context/SocketContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  MessageSquare, Send, User, ChevronLeft,
  Search, Phone, CheckCheck, MapPin, Camera, Navigation
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

const ChatPage = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        const userRes = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null);

        let userData = null;
        if (userRes?.data?.user) {
          userData = { ...userRes.data.user, type: 'user' };
          setCurrentUser(userData);
        } else {
          const capRes = await axios.get('/api/captain/profile', {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => null);

          if (capRes?.data?.captain) {
            userData = { ...capRes.data.captain, type: 'captain' };
            setCurrentUser(userData);
          }
        }
        await fetchConversations(userData);
      } catch (err: any) {
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
      const fetchedConvs = response.data.conversations || [];
      setConversations(fetchedConvs);
      setLoading(false);

      const params = new URLSearchParams(window.location.search);
      const partnerId = params.get('partnerId');
      const partnerType = params.get('partnerType');
      const partnerName = params.get('partnerName');
      const partnerProfileImage = params.get('partnerProfileImage');
      const rideId = params.get('rideId');

      if (partnerId && partnerType && partnerId !== 'undefined') {
        const existingConv = fetchedConvs.find((c: any) => c.partnerId === partnerId);
        if (existingConv) {
          setSelectedConversation({
            ...existingConv,
            partnerProfileImage: existingConv.partnerProfileImage || partnerProfileImage
          });
        } else {
          setSelectedConversation({
            partnerId,
            partnerType,
            partnerName: { firstname: partnerName, lastname: '' },
            partnerProfileImage,
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
        fetchConversations(currentUser);
        if (selectedConversation && (msg.sender === selectedConversation.partnerId || msg.receiver === selectedConversation.partnerId || msg.sender?._id === selectedConversation.partnerId)) {
          setSelectedConversation((prev: any) => {
            const exists = prev.messages?.some((m: any) => m._id === msg._id);
            if (exists) return prev;
            return {
              ...prev,
              messages: [...(prev.messages || []), msg]
            };
          });
        }
      });
      return () => socket.off('new-message');
    }
  }, [socket, selectedConversation]);

  const sendMessage = async (payloadOverride?: any) => {
    if ((!inputMessage.trim() && !payloadOverride) || !selectedConversation) return;

    const token = localStorage.getItem('token');
    try {
      const basePayload = {
        receiverId: selectedConversation.partnerId,
        receiverModel: selectedConversation.partnerType,
        rideId: selectedConversation.ride || selectedConversation.messages?.[0]?.ride,
        contentType: payloadOverride?.contentType || 'text'
      };

      const payload = payloadOverride ? { ...basePayload, ...payloadOverride } : { ...basePayload, content: inputMessage };

      const res = await axios.post('/api/messages', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newMsg = res.data.message;
      setSelectedConversation((prev: any) => ({
        ...prev,
        messages: [...(prev.messages || []), newMsg]
      }));
      if (!payloadOverride) setInputMessage('');
      fetchConversations(currentUser);

      if (socket) socket.emit('message', newMsg);
    } catch (err: any) {
      console.error("Send failed", err);
      showToast("Failed to send message", "error");
    }
  };

  const shareLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation not supported", "error");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      sendMessage({
        contentType: 'location',
        locationData: { lat: latitude, lng: longitude, address: 'Current Location' }
      });
  }, () => showToast("Location access denied", "error"));
};

const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onloadend = () => {
    sendMessage({
      contentType: 'image',
      mediaUrl: reader.result as string,
        content: 'Photo'
    });
  };
  reader.readAsDataURL(file);
};

if (loading) return (
  <div className="h-screen bg-slate-50 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full"></div>
  </div>
);

return (
            <div className='h-screen flex bg-slate-50 text-slate-900 font-sans overflow-hidden'>
              {/* Conversations List */}
              <div className={`w-full md:w-80 lg:w-96 flex flex-col bg-white border-r border-slate-200 transition-all z-20 ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => router.back()} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <h2 className="text-lg font-bold text-slate-900">Messages</h2>
                    </div>
                  </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search chats..."
                        className="w-full bg-slate-100 rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                      {conversations.map((conv) => (
                          <div
              key={conv.partnerId}
                          onClick={() => setSelectedConversation(conv)}
                          className={`flex items-center gap-3 p-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${selectedConversation?.partnerId === conv.partnerId ? 'bg-indigo-50/70' : ''
                            }`}
                        >
                            <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                              {conv.partnerProfileImage ? (
                  <img src={conv.partnerProfileImage} className="w-full h-full object-cover" alt="Profile" />
                              ) : (
                  <span>{conv.partnerName?.firstname?.[0] || 'U'}</span>
                              )}
                            </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                        {conv.partnerName?.firstname} {conv.partnerName?.lastname}
                                      </h4>
                                      <span className="text-[10px] text-slate-400">
                                        {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">{conv.lastMessage || 'Start conversation'}</p>
                                  </div>
                              </div>
          ))}

                              {conversations.length === 0 && (
                                <div className="p-8 text-center text-slate-400 text-xs">
                                  No messages yet
                                </div>
                              )}
                            </div>
                          </div>

                            {/* Chat Area */}
                            <div className={`flex-1 flex flex-col bg-slate-50 ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
                              {selectedConversation ? (
          <>
                                        {/* Chat Header */}
                                        <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm">
                                          <div className="flex items-center gap-3 min-w-0">
                                            <button
                                              onClick={() => setSelectedConversation(null)}
                                              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                                            >
                                              <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                                              {selectedConversation.partnerProfileImage ? (
                    <img src={selectedConversation.partnerProfileImage} className="w-full h-full object-cover" alt="Partner" />
                                              ) : (
                    <span>{selectedConversation.partnerName?.firstname?.[0] || 'U'}</span>
                                              )}
                                            </div>
                                              <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-slate-900 truncate">
                                                  {selectedConversation.partnerName?.firstname} {selectedConversation.partnerName?.lastname}
                                                </h4>
                                                <p className="text-[11px] text-emerald-600 font-medium capitalize">
                                                  {selectedConversation.partnerType || 'Driver'} • Active
                                                </p>
                                              </div>
                                            </div>
                                          </div>

                                              {/* Messages Feed */ }
                                              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                                                {(selectedConversation.messages || []).map((msg: any, idx: number) => {
                                                  const isMine = msg.sender === currentUser?._id || msg.sender?._id === currentUser?._id;
                                                  return (
                                                            <div key={msg._id || idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                              <div
                                                                className={`max-w-[80%] sm:max-w-md p-3 rounded-2xl text-xs sm:text-sm shadow-sm ${isMine
                                                                    ? 'bg-indigo-600 text-white rounded-br-xs'
                                                                    : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80'
                                                                  }`}
                                                              >
                                                                {msg.contentType === 'location' ? (
                                                                  <div className="space-y-2">
                                                                    <p className="font-semibold">Shared Location</p>
                                                                    <button
                                                                      onClick={() => window.open(`https://www.google.com/maps?q=${msg.locationData?.lat},${msg.locationData?.lng}`)}
                                                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${isMine ? 'bg-white text-indigo-700' : 'bg-indigo-600 text-white'
                                                                        }`}
                                                                    >
                                                                      <Navigation className="w-3.5 h-3.5" /> Open in Maps
                                                                    </button>
                                                                  </div>
                                                                ) : msg.contentType === 'image' ? (
                                                                  <img src={msg.mediaUrl} alt="Photo" className="rounded-xl max-h-60 object-cover" />
                                                                ) : (
                                                                  <p className="leading-relaxed">{msg.content}</p>
                                                                )}

                                                                  <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${isMine ? 'text-indigo-200' : 'text-slate-400'
                                                                    }`}>
                                                                    <span>{new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                    {isMine && <CheckCheck className="w-3 h-3" />}
                                                                  </div>
                                                                </div>
                                                            </div>
                                                            );
              })}
                                                          </div>

                                                            {/* Input Bar */}
                                                            <div className="p-3 bg-white border-t border-slate-200">
                                                              <div className="flex items-center gap-2 max-w-4xl mx-auto">
                                                                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                                                                <button
                                                                  onClick={() => fileInputRef.current?.click()}
                                                                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
                                                                >
                                                                  <Camera className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                  onClick={shareLocation}
                                                                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
                                                                >
                                                                  <MapPin className="w-5 h-5" />
                                                                </button>

                <input
                                                                  type="text"
                                                                  value={inputMessage}
                                                                  onChange={(e) => setInputMessage(e.target.value)}
                                                                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                                                  placeholder="Type a message..."
                                                                  className="flex-1 bg-slate-100 border-none rounded-xl py-2 px-3.5 text-xs sm:text-sm outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-900"
                                                                />

                                                                <button
                                                                  onClick={() => sendMessage()}
                                                                  disabled={!inputMessage.trim()}
                                                                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition-colors"
                                                                >
                                                                <Send className="w-4 h-4" />
                                                              </button>
                                                            </div>
                                                          </div>
                                                        </>
                                                        ) : (
                                                            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                                                              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-3">
                                                                <MessageSquare className="w-7 h-7" />
                                                              </div>
                                                              <h3 className="text-base font-bold text-slate-800">Your Conversations</h3>
                                                              <p className="text-xs text-slate-500 mt-1 max-w-xs">Select a chat on the left to start messaging your driver or passenger.</p>
                                                            </div>
        )}
                                                          </div>
                                                        </div>
                                                        );
};

                                                        export default ChatPage;