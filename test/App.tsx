import { useState } from 'react';
import PunchCardDropdown from './components/PunchCardDropdown';
import PunchCard from './components/PunchCard';

type PunchCardData = {
  id: string;
  title: string;
};

export default function App() {
  const [cards, setCards] = useState<PunchCardData[]>([
    { id: '1', title: 'Tried A New Recipe' },
    { id: '2', title: 'Read A Cozy Book' },
    { id: '3', title: 'Hosted A Dinner Party' },
  ]);
  const [selectedCardId, setSelectedCardId] = useState(cards[0].id);
  const [showNewCardInput, setShowNewCardInput] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const selectedCard = cards.find((card) => card.id === selectedCardId);

  const handleAddNewCard = () => {
    setShowNewCardInput(true);
  };

  const handleCreateCard = () => {
    if (newCardTitle.trim()) {
      const newCard = {
        id: Date.now().toString(),
        title: newCardTitle.trim(),
      };
      setCards([...cards, newCard]);
      setSelectedCardId(newCard.id);
      setNewCardTitle('');
      setShowNewCardInput(false);
    }
  };

  const handleCancelNewCard = () => {
    setNewCardTitle('');
    setShowNewCardInput(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f7] to-[#ffe8ec] flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <PunchCardDropdown
          options={cards.map((card) => card.title)}
          selected={selectedCard?.title || ''}
          onSelect={(title) => {
            const card = cards.find((c) => c.title === title);
            if (card) setSelectedCardId(card.id);
          }}
          onAddNew={handleAddNewCard}
        />

        {showNewCardInput && (
          <div className="bg-white border-2 border-[#ffccd3] rounded-[16px] shadow-lg p-6 space-y-4">
            <h3 className="font-['Inter',sans-serif] text-[#a50036] text-[18px] font-semibold">
              Create New Punch Card
            </h3>
            <input
              type="text"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter punch card title..."
              className="w-full p-3 border-2 border-[#ffccd3] rounded-[12px] font-['Inter',sans-serif] text-[#a50036] text-[16px] focus:outline-none focus:border-[#a50036]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateCard();
                if (e.key === 'Escape') handleCancelNewCard();
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateCard}
                className="flex-1 bg-[#a50036] text-white py-2 px-4 rounded-[12px] font-['Inter',sans-serif] text-[16px] hover:bg-[#8a002e] transition-colors"
              >
                Create
              </button>
              <button
                onClick={handleCancelNewCard}
                className="flex-1 bg-white border-2 border-[#ffccd3] text-[#a50036] py-2 px-4 rounded-[12px] font-['Inter',sans-serif] text-[16px] hover:bg-[#fff5f7] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {selectedCard && !showNewCardInput && (
          <PunchCard title={selectedCard.title} />
        )}
      </div>
    </div>
  );
}
