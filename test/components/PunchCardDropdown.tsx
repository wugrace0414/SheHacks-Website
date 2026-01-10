import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

type PunchCardDropdownProps = {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  onAddNew: () => void;
};

export default function PunchCardDropdown({ options, selected, onSelect, onAddNew }: PunchCardDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full max-w-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[rgba(255,255,255,0.8)] border-2 border-[#ffccd3] border-solid w-full rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-4 flex items-center justify-between hover:bg-white transition-colors"
      >
        <span className="font-['Inter',sans-serif] text-[#a50036] text-[16px] tracking-[-0.3125px]">
          {selected}
        </span>
        <ChevronDown className={`size-5 text-[#a50036] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#ffccd3] rounded-[16px] shadow-lg overflow-hidden z-10">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className={`w-full p-4 text-left font-['Inter',sans-serif] text-[16px] tracking-[-0.3125px] hover:bg-[#fff5f7] transition-colors ${
                option === selected ? 'text-[#a50036] bg-[#fff5f7]' : 'text-[#a50036]'
              }`}
            >
              {option}
            </button>
          ))}
          <button
            onClick={() => {
              onAddNew();
              setIsOpen(false);
            }}
            className="w-full p-4 text-left font-['Inter',sans-serif] text-[16px] tracking-[-0.3125px] text-[#a50036] border-t-2 border-[#ffccd3] hover:bg-[#fff5f7] transition-colors font-medium"
          >
            + Add New Punch Card
          </button>
        </div>
      )}
    </div>
  );
}
