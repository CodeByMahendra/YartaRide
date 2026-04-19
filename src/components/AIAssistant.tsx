"use client";

import { useState, useRef, useEffect } from "react";
import "remixicon/fonts/remixicon.css";
import { MessageSquare, X, Send } from "lucide-react";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>([
    { role: 'assistant', content: 'Hello! I am the YatraRide AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: input.trim() }];
    setMessages(newMessages as any);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input.trim(),
          history: messages 
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }] as any);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: "Sorry, an error occurred. Please try again later." }] as any);
      }
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: "Network error. Please check your connection." }] as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl mb-4 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] flex flex-col overflow-hidden border border-gray-100 flex-shrink-0">
          {/* Header */}
          <div className="bg-yellow-400 p-4 flex justify-between items-center text-gray-900 border-b">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full p-2 shadow-sm flex items-center justify-center">
                <i className="ri-robot-2-fill text-xl text-yellow-500"></i>
              </div>
              <div>
                <h3 className="font-bold text-sm">YatraRide AI</h3>
                <p className="text-xs font-semibold opacity-80">Online</p>
              </div>
            </div>
            <button onClick={() => {
              setIsOpen(false);
              setMessages([{ role: 'assistant', content: 'Hello! I am the YatraRide AI Assistant. How can I help you today?' }]);
            }} className="hover:bg-yellow-500 p-1 rounded-full transition-colors cursor-pointer">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-yellow-400 text-gray-900 rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-none p-3 shadow-sm border border-gray-100 flex gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about YatraRide..."
                className="w-full bg-gray-100 border-none rounded-full py-3 pr-12 pl-4 text-sm outline-none focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-medium text-black"
                style={{ color: "black" }}
              />
              <button 
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="absolute right-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 p-2 rounded-full cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-xl rounded-full w-14 h-14 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
}
