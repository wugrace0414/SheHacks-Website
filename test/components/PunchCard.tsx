import { useState } from 'react';

type PunchCardProps = {
  title: string;
  totalSpots?: number;
};

export default function PunchCard({ title, totalSpots = 10 }: PunchCardProps) {
  const [punched, setPunched] = useState<boolean[]>(Array(totalSpots).fill(false));

  const togglePunch = (index: number) => {
    const newPunched = [...punched];
    newPunched[index] = !newPunched[index];
    setPunched(newPunched);
  };

  const punchedCount = punched.filter(Boolean).length;

  return (
    <div className="w-full max-w-md bg-white border-4 border-[#ffccd3] rounded-[24px] shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="font-['Inter',sans-serif] text-[#a50036] text-[24px] font-semibold tracking-[-0.3125px] mb-2">
          {title}
        </h2>
        <p className="font-['Inter',sans-serif] text-[#a50036] text-[14px] opacity-70">
          {punchedCount} / {totalSpots} completed
        </p>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        {punched.map((isPunched, index) => (
          <button
            key={index}
            onClick={() => togglePunch(index)}
            className={`aspect-square rounded-full border-4 transition-all hover:scale-110 ${
              isPunched
                ? 'bg-[#a50036] border-[#a50036] shadow-md'
                : 'bg-white border-[#ffccd3] hover:border-[#ffb3c1]'
            }`}
            aria-label={`Spot ${index + 1}`}
          >
            {isPunched && (
              <svg
                className="w-full h-full p-2 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        ))}
      </div>

      {punchedCount === totalSpots && (
        <div className="bg-[#fff5f7] border-2 border-[#ffccd3] rounded-[16px] p-4 text-center">
          <p className="font-['Inter',sans-serif] text-[#a50036] text-[16px] font-semibold">
            🎉 Completed! Great job!
          </p>
        </div>
      )}
    </div>
  );
}
