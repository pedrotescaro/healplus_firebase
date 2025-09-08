"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Send, 
  Bot, 
  Users, 
  X, 
  Lightbulb, 
  MessageCircle
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { realtimeDb } from "@/firebase/client-app";
import { ref, push, onValue, off, set, serverTimestamp } from "firebase/database";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
  isTyping?: boolean;
}

interface Conversation {
  id: string;
  patientName: string;
  patientId: string;
  condition: string;
  status: 'active' | 'waiting' | 'concluded';
  lastMessage: string;
  lastMessageTime: number;
  avatar: string;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    patientName: 'João Silva',
    patientId: 'js001',
    condition: 'Úlcera Venosa',
    status: 'active',
    lastMessage: 'Como devo cuidar da minha ferida durante o banho?',
    lastMessageTime: Date.now(),
    avatar: 'JS',
    messages: [
      {
        id: '1',
        text: 'Olá! Como posso ajudá-lo com sua úlcera venosa hoje?',
        sender: 'bot',
        timestamp: Date.now() - 3600000
      },
      {
        id: '2',
        text: 'Olá! Tenho algumas dúvidas sobre o cuidado com minha ferida.',
        sender: 'user',
        timestamp: Date.now() - 3500000
      },
      {
        id: '3',
        text: 'Claro! Estou aqui para ajudar. Qual é sua dúvida específica?',
        sender: 'bot',
        timestamp: Date.now() - 3400000
      },
      {
        id: '4',
        text: 'Como devo cuidar da minha ferida durante o banho?',
        sender: 'user',
        timestamp: Date.now() - 300000
      },
      {
        id: '5',
        text: 'Para cuidar da sua ferida durante o banho, siga estas orientações:\n\n• Use água morna, evite água muito quente\n• Seque bem a área após o banho\n• Evite esfregar a ferida\n• Use sabonete neutro\n\nGostaria de mais detalhes sobre algum desses pontos?',
        sender: 'bot',
        timestamp: Date.now() - 240000
      },
      {
        id: '6',
        text: 'Qual tipo de curativo impermeável você recomenda?',
        sender: 'user',
        timestamp: Date.now() - 120000
      },
      {
        id: '7',
        text: 'Para úlceras venosas, recomendo:\n\n• Filme transparente: Para feridas pequenas e superficiais\n• Curativo hidrocolóide: Para feridas com exsudato moderado\n• Curativo de espuma: Para feridas com exsudato abundante\n\nConsulte sempre seu médico para a escolha mais adequada ao seu caso.',
        sender: 'bot',
        timestamp: Date.now() - 60000
      }
    ]
  },
  {
    id: '2',
    patientName: 'Ana Costa',
    patientId: 'ac002',
    condition: 'Ferida Cirúrgica',
    status: 'concluded',
    lastMessage: 'Posso fazer exercícios com minha ferida?',
    lastMessageTime: Date.now() - 720000,
    avatar: 'AC',
    messages: [
      {
        id: '1',
        text: 'Olá Ana! Como está se sentindo após a cirurgia?',
        sender: 'bot',
        timestamp: Date.now() - 7200000
      },
      {
        id: '2',
        text: 'Estou bem, obrigada! Tenho uma dúvida sobre exercícios.',
        sender: 'user',
        timestamp: Date.now() - 7100000
      },
      {
        id: '3',
        text: 'Posso fazer exercícios com minha ferida?',
        sender: 'user',
        timestamp: Date.now() - 720000
      }
    ]
  },
  {
    id: '3',
    patientName: 'Pedro Lima',
    patientId: 'pl003',
    condition: 'Ferida Diabética',
    status: 'waiting',
    lastMessage: 'Quando devo trocar o curativo?',
    lastMessageTime: Date.now() - 3600000,
    avatar: 'PL',
    messages: [
      {
        id: '1',
        text: 'Olá Pedro! Como posso ajudá-lo com sua ferida diabética?',
        sender: 'bot',
        timestamp: Date.now() - 7200000
      },
      {
        id: '2',
        text: 'Quando devo trocar o curativo?',
        sender: 'user',
        timestamp: Date.now() - 3600000
      }
    ]
  }
];

export function AdvancedChat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter(conv =>
    conv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'waiting': return 'bg-orange-500';
      case 'concluded': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'ATIVA';
      case 'waiting': return 'AGUARDANDO';
      case 'concluded': return 'CONCLUÍDA';
      default: return 'DESCONHECIDA';
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes} min`;
    if (hours < 24) return `${hours}h`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: Date.now()
    };

    // Add user message
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
      lastMessage: newMessage,
      lastMessageTime: Date.now()
    };

    setConversations(prev => 
      prev.map(conv => conv.id === selectedConversation.id ? updatedConversation : conv)
    );
    setSelectedConversation(updatedConversation);
    setNewMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(newMessage, selectedConversation.condition),
        sender: 'bot',
        timestamp: Date.now()
      };

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, botResponse],
        lastMessage: botResponse.text,
        lastMessageTime: Date.now()
      };

      setConversations(prev => 
        prev.map(conv => conv.id === selectedConversation.id ? finalConversation : conv)
      );
      setSelectedConversation(finalConversation);
      setIsTyping(false);
    }, 2000);
  };

  const generateBotResponse = (userMessage: string, condition: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('banho') || message.includes('água')) {
      return 'Para o banho com feridas, use água morna e seque bem a área. Evite esfregar e use sabonete neutro.';
    }
    
    if (message.includes('curativo') || message.includes('bandagem')) {
      return 'O tipo de curativo depende da sua condição. Para ' + condition.toLowerCase() + ', recomendo consultar seu médico para a escolha mais adequada.';
    }
    
    if (message.includes('exercício') || message.includes('atividade')) {
      return 'Atividades físicas devem ser moderadas e aprovadas pelo seu médico. Evite exercícios que possam traumatizar a área da ferida.';
    }
    
    if (message.includes('dor') || message.includes('desconforto')) {
      return 'Se estiver sentindo dor, pode ser normal no processo de cicatrização. Se a dor for intensa ou persistente, procure seu médico.';
    }
    
    return 'Entendo sua preocupação. Para uma orientação mais específica sobre ' + condition.toLowerCase() + ', recomendo que consulte seu médico ou enfermeiro especializado.';
  };

  const handleEscalate = () => {
    if (!selectedConversation) return;
    
    const updatedConversation = {
      ...selectedConversation,
      status: 'waiting' as const
    };
    
    setConversations(prev => 
      prev.map(conv => conv.id === selectedConversation.id ? updatedConversation : conv)
    );
    setSelectedConversation(updatedConversation);
  };

  const handleEndConversation = () => {
    if (!selectedConversation) return;
    
    const updatedConversation = {
      ...selectedConversation,
      status: 'concluded' as const
    };
    
    setConversations(prev => 
      prev.map(conv => conv.id === selectedConversation.id ? updatedConversation : conv)
    );
    setSelectedConversation(updatedConversation);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Sidebar - Active Conversations */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Conversas Ativas</h2>
          <p className="text-sm text-gray-500 mb-4">Selecione uma conversa para visualizar.</p>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={cn(
                  "p-4 rounded-lg cursor-pointer transition-colors mb-2",
                  selectedConversation?.id === conversation.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                )}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className={cn(
                      "text-white text-sm font-semibold",
                      getStatusColor(conversation.status)
                    )}>
                      {conversation.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.patientName}
                      </h3>
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs", getStatusColor(conversation.status))}
                      >
                        {getStatusText(conversation.status)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">{conversation.condition}</p>
                    <p className="text-xs text-gray-500 mb-2">{formatTime(conversation.lastMessageTime)}</p>
                    
                    <p className="text-sm text-gray-700 truncate">
                      "{conversation.lastMessage}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className={cn(
                      "text-white text-sm font-semibold",
                      getStatusColor(selectedConversation.status)
                    )}>
                      {selectedConversation.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedConversation.patientName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Paciente - {selectedConversation.condition}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEscalate}
                    className="flex items-center space-x-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>Escalar</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleEndConversation}
                    className="flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Encerrar</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                        message.sender === 'user'
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-gray-200 text-gray-900"
                      )}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === 'bot' && (
                          <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          <p className={cn(
                            "text-xs mt-1",
                            message.sender === 'user' ? "text-blue-100" : "text-gray-500"
                          )}>
                            {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-gray-500" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex space-x-2 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Sugerir Resposta</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEscalate}
                  className="flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Escalar para Humano</span>
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecione uma conversa
              </h3>
              <p className="text-gray-500">
                Escolha uma conversa da lista para começar a conversar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
