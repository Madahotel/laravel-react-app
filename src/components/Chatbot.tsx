import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Welcome to RR Boerboels! How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const responses: Record<string, string> = {
    'hello': 'Hello! How can I help you today?',
    'hi': 'Hi there! What can I do for you?',
    'good morning': 'Good morning! How can I assist you?',
    'good afternoon': 'Good afternoon! How can I help?',
    'good evening': 'Good evening! What can I do for you?',
    'price': 'Our puppy prices vary based on lineage and characteristics. Contact us directly for a personalized quote.',
    'prices': 'Our puppy prices vary based on lineage and characteristics. Contact us directly for a personalized quote.',
    'puppy': 'We have regular litters. Check the "Litters" section to see available or upcoming puppies.',
    'puppies': 'We have regular litters. Check the "Litters" section to see available or upcoming puppies.',
    'litter': 'Our next litter is expected soon. Reserve yours now!',
    'litters': 'Our next litter is expected soon. Reserve yours now!',
    'reservation': 'To reserve a puppy, please fill out the form in the "Contact" section or call us directly.',
    'reserve': 'To reserve a puppy, please fill out the form in the "Contact" section or call us directly.',
    'visit': 'Visits are by appointment only. Use the contact form to schedule your visit to our facility in Madagascar.',
    'address': 'Our kennel is located in Antananarivo, Madagascar. Contact us for the exact address and to schedule a visit.',
    'location': 'Our kennel is located in Antananarivo, Madagascar. Contact us for the exact address and to schedule a visit.',
    'contact': 'You can reach us by email at contact@rrboerboels.com or by phone/WhatsApp. Check the Contact section for more details.',
    'phone': 'You can call or WhatsApp us at +261 34 12 345 67',
    'email': 'Our email is contact@rrboerboels.com',
    'stud': 'Our male Oliver is available for stud services to approved females. Contact us for more information.',
    'stud service': 'Our male Oliver is available for stud services to approved females. Full health documentation provided.',
    'male': 'Our breeding male Oliver is a champion with an excellent pedigree - son of CDH BULLET, International Champion.',
    'female': 'Our breeding female Iggy is an exceptional producer with a balanced temperament - daughter of iCONIC John Wick, Madagascar Puppy Champion October 2025.',
    'oliver': 'Oliver is our breeding male, son of CDH BULLET (International Champion). He is available for stud services.',
    'iggy': 'Iggy is our breeding female, daughter of iCONIC John Wick and Madagascar Puppy Champion October 2025.',
    'health': 'All our dogs are tested for hip and elbow dysplasia, cardiac issues, and genetic diseases. Check the Health section for more details.',
    'pedigree': 'All our dogs have certified pedigrees. Links are available on each dog\'s profile page.',
    'breed': 'The Boerboel is a South African working dog, powerful, loyal, and protective. Perfect for guarding and family companionship.',
    'boerboel': 'The Boerboel is a South African working dog, powerful, loyal, and protective. Perfect for guarding and family companionship.',
    'sabbs': 'We are SABBS (South African Boerboel Breeders Society) registered. All our dogs meet breed standards.',
    'registered': 'We are SABBS (South African Boerboel Breeders Society) registered. All our dogs meet breed standards.',
    'champion': 'Our dogs come from champion bloodlines. Oliver is son of CDH BULLET (International Champion), and Iggy is Madagascar Puppy Champion October 2025.',
    'bloodline': 'Our dogs come from champion bloodlines. Oliver is son of CDH BULLET (International Champion), and Iggy is Madagascar Puppy Champion October 2025.',
    'madagascar': 'We are located in Madagascar and breed high-quality Boerboels with champion bloodlines.',
    'thank': 'You\'re welcome! Feel free to ask if you have any other questions.',
    'thanks': 'You\'re welcome! Feel free to ask if you have any other questions.',
    'goodbye': 'Goodbye! We look forward to hearing from you at RR Boerboels!',
    'bye': 'Bye! Have a wonderful day!',
  };

  const defaultResponses = [
    'I\'m not sure I understand. Could you rephrase your question?',
    'I can help you with information about our puppies, reservations, stud services, or visits. What would you like to know?',
    'For more information, feel free to browse our website or contact us directly at contact@rrboerboels.com',
  ];

  const getResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    for (const keyword in responses) {
      if (lowerMessage.includes(keyword)) {
        return responses[keyword];
      }
    }

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInputValue('');

    setTimeout(() => {
      const botResponse = getResponse(userMessage);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chatbot-widget">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-toggle"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'active' : ''}`}>
        {/* Header */}
        <div className="bg-[#C79A6B] p-4 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-[#0B0B0C]">RR Boerboels</h4>
            <p className="text-xs text-[#0B0B0C]/70">Typically replies in minutes</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#0B0B0C] hover:text-[#0B0B0C]/70 transition-colors"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-[#C79A6B] text-[#0B0B0C]'
                    : 'bg-[#1C1C1E] text-[#F4F1EC] border border-[rgba(199,154,107,0.2)]'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[rgba(199,154,107,0.2)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-[#1C1C1E] border border-[rgba(199,154,107,0.2)] rounded-lg px-4 py-2 text-[#F4F1EC] placeholder-[#6B6560] focus:outline-none focus:border-[#C79A6B]"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 bg-[#C79A6B] rounded-lg flex items-center justify-center text-[#0B0B0C] hover:bg-[#D4AA7A] transition-colors"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
