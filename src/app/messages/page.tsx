'use client';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { SocketDataContext } from '@/context/SocketContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, User, ChevronLeft,
  MoreVertical, Search, Phone, Video,
  Clock, Check, CheckCheck, MapPin, Camera, Trash2, Image as ImageIcon, Navigation
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
        fetchConversations(currentUser);
        if (selectedConversation && (msg.sender === selectedConversation.partnerId || msg.receiver === selectedConversation.partnerId || msg.sender?._id === selectedConversation.partnerId)) {
          setSelectedConversation((prev: any) => {
            const exists = prev.messages.some((m: any) => m._id === msg._id);
            if (exists) return prev;
            return {
              ...prev,
              messages: [...prev.messages, msg]
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
        messages: [...prev.messages, newMsg]
      }));
      if (!payloadOverride) setInputMessage('');
      fetchConversations(currentUser);

      if (socket) socket.emit('message', newMsg);
    } catch (err) {
      console.error("Send failed", err);
      showToast("Failed to send transmission", "error");
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
    }, (err) => showToast("Location access denied", "error"));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      sendMessage({
        contentType: 'image',
        mediaUrl: reader.result as string,
        content: 'Image Transmission'
      });
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div className="h-screen bg-slate-50 flex items-center justify-center text-indigo-600"><div className="w-12 h-12 border-[6px] border-indigo-600 border-t-transparent animate-spin rounded-full"></div></div>;

  return (
    <div className='h-screen flex bg-slate-50 text-slate-900 font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900'>

      {/* Conversations Sidebar */}
      <div className={`w-full md:w-[400px] flex flex-col bg-white border-r border-slate-100 transition-all shadow-2xl z-50 ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <MessageSquare className="w-5 h-5 text-white" />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Matrix.</h2>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">Chat Hub</p>
               </div>
            </div>
            <button onClick={() => router.back()} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-inner">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
            <input type="text" placeholder="Search interactions..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold outline-none focus:bg-white focus:border-indigo-100 transition-all" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-4 space-y-2">
          {conversations.map((conv) => (
            <motion.div
              key={conv.partnerId}
              onClick={() => setSelectedConversation(conv)}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-5 p-5 rounded-[2rem] cursor-pointer transition-all border-2 ${selectedConversation?.partnerId === conv.partnerId ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-100' : 'bg-white border-transparent hover:bg-slate-50'}`}
            >
              <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center font-black text-xl ${selectedConversation?.partnerId === conv.partnerId ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600 shadow-inner'}`}>
                {conv.partnerName?.firstname?.[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h4 className={`font-black text-sm truncate ${selectedConversation?.partnerId === conv.partnerId ? 'text-white' : 'text-slate-900'}`}>{conv.partnerName?.firstname}</h4>
                  <span className={`text-[9px] font-black uppercase ${selectedConversation?.partnerId === conv.partnerId ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className={`text-[11px] font-bold truncate ${selectedConversation?.partnerId === conv.partnerId ? 'text-indigo-100' : 'text-slate-500'}`}>{conv.lastMessage}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className={`flex-1 flex flex-col relative ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
        {selectedConversation ? (
          <>
            <div className="p-6 md:p-8 border-b border-slate-100 bg-white/95 backdrop-blur-xl flex items-center justify-between z-10">
              <div className="flex items-center gap-5">
                <button onClick={() => setSelectedConversation(null)} className="md:hidden p-3 bg-slate-50 rounded-2xl"><ChevronLeft className="w-6 h-6" /></button>
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-100">
                  {selectedConversation.partnerName?.firstname?.[0]}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{selectedConversation.partnerName?.firstname} {selectedConversation.partnerName?.lastname}</h4>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1.5">{selectedConversation.partnerType} • Secure Connection</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all"><Phone className="w-5 h-5" /></button>
                <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-12 space-y-10 bg-slate-50/30">
              {selectedConversation.messages.map((msg: any, idx: number) => {
                const isMine = msg.sender === currentUser?._id || msg.sender?._id === currentUser?._id;
                return (
                  <motion.div key={msg._id || idx} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[70%] p-6 rounded-[2.5rem] shadow-sm relative ${isMine ? 'bg-slate-900 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'}`}>
                      
                      {/* Content Renderer */}
                      {(msg.contentType === 'text' || !msg.contentType || (!['image', 'location'].includes(msg.contentType))) && (
                        <p className="text-sm font-bold leading-relaxed">{msg.content || '[Empty Message]'}</p>
                      )}
                      
                      {msg.contentType === 'image' && (
                        <div className="rounded-3xl overflow-hidden mb-2 max-w-[220px] sm:max-w-[280px] shadow-lg border-2 border-white/10">
                           <img src={msg.mediaUrl} alt="Transmission" className="w-full h-auto object-cover max-h-[350px] hover:scale-105 transition-transform cursor-pointer" onClick={() => window.open(msg.mediaUrl, '_blank')} />
                        </div>
                      )}

                      {msg.contentType === 'location' && (
                        <div className="space-y-4">
                           <div className="w-full h-44 rounded-3xl bg-slate-100 overflow-hidden relative border border-slate-200">
                             <iframe 
                                width="100%" height="100%" frameBorder="0" 
                                src={`https://www.google.com/maps?q=${msg.locationData.lat},${msg.locationData.lng}&z=15&output=embed`}
                             />
                           </div>
                           <button onClick={() => window.open(`https://www.google.com/maps?q=${msg.locationData.lat},${msg.locationData.lng}`)} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 ${isMine ? 'bg-white/10 text-white' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'}`}>
                              <Navigation className="w-3.5 h-3.5" /> Navigate to Target
                           </button>
                        </div>
                      )}

                      <div className={`flex items-center gap-2 mt-4 justify-end ${isMine ? 'text-slate-400' : 'text-slate-400'}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMine && <CheckCheck className="w-4 h-4 text-indigo-400" />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Input Hub */}
            <div className="px-6 md:px-12 pb-12 pt-6 bg-white border-t border-slate-50">
              <div className="flex items-center gap-4 sm:gap-6 bg-slate-50 p-4 rounded-[2.5rem] border border-slate-100 shadow-inner max-w-6xl mx-auto ring-1 ring-black/[0.02]">
                <div className="flex gap-1">
                  <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="p-4 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-full transition-all active:scale-95"><Camera className="w-6 h-6" /></button>
                  <button onClick={shareLocation} className="p-4 text-slate-400 hover:text-emerald-500 hover:bg-white rounded-full transition-all active:scale-95"><MapPin className="w-6 h-6" /></button>
                </div>
                
                <div className="flex-1">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Enter message protocol..."
                    className="w-full bg-transparent border-none py-2 px-2 text-sm font-black outline-none placeholder:text-slate-300 text-slate-900"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage()}
                  className="p-5 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-100 hover:bg-slate-900 transition-all border border-indigo-500"
                >
                  <Send className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50">
            <div className="w-36 h-36 bg-white rounded-[4rem] flex items-center justify-center shadow-2xl shadow-indigo-100/50 mb-10 border border-white">
              <MessageSquare className="w-14 h-14 text-indigo-600" />
            </div>
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 italic leading-none">COMMUNICATION<br />CENTER.</h3>
            <p className="max-w-xs text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] leading-loose">Secure end-to-end encryption active. Select a partner to initialize transmission.</p>
          </div>
        )}
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
