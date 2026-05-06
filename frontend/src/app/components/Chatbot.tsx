import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Je suis l'assistant GreenCycle. Comment puis-je vous aider avec le recyclage aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const botResponses: { [key: string]: string } = {
    plastique: "Le plastique doit être trié par type. Les bouteilles et flacons vont dans le bac jaune. Pensez à les vider et à retirer les bouchons !",
    verre: "Le verre se recycle à l'infini ! Déposez vos bouteilles et bocaux dans les conteneurs verts. Attention : pas de vaisselle ou miroirs.",
    papier: "Le papier et le carton vont dans le bac bleu. Évitez le papier gras ou souillé qui ne peut pas être recyclé.",
    métal: "Les métaux (canettes, boîtes de conserve) se recyclent dans le bac jaune. Inutile de les laver, il suffit de les vider.",
    organique: "Les déchets organiques peuvent être compostés ! Épluchures, marc de café, coquilles d'œufs... créez votre compost.",
    électronique: "Les déchets électroniques doivent être apportés en déchetterie ou dans des points de collecte spéciaux. Ne les jetez jamais à la poubelle !",
    points: "Vous gagnez des GreenPoints en créant des collectes et en recyclant. Plus vous recyclez, plus vous montez dans le classement !",
    default: "Excellente question ! En matière de recyclage, l'essentiel est de trier correctement. Posez-moi des questions sur le plastique, le verre, le papier, le métal, l'organique ou l'électronique !"
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    return botResponses.default;
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);

    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);

    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl text-gray-900 mb-2">Chatbot Recyclage</h2>
          <p className="text-gray-600">
            Posez vos questions sur le recyclage et obtenez des réponses instantanées
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'bot' ? 'bg-[#2ecc71]' : 'bg-blue-500'
                }`}>
                  {message.sender === 'bot' ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message bubble */}
                <div className={`max-w-[70%] ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.sender === 'bot'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-[#2ecc71] text-white'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pose ta question sur le recyclage..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71] bg-white"
              />
              <button
                onClick={handleSend}
                className="px-6 py-3 bg-[#2ecc71] text-white rounded-lg hover:bg-[#27ae60] transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Suggestions */}
            <div className="mt-3 flex flex-wrap gap-2">
              {['Plastique', 'Verre', 'Papier', 'Points'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputText(suggestion)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
