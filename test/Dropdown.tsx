type OptionTextProps = {
  text: string;
};

function OptionText({ text }: OptionTextProps) {
  return (
    <div className="absolute left-[-193.5px] size-0 top-[-109px]">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#a50036] text-[16px] top-[-3px] tracking-[-0.3125px] w-0">{text}</p>
    </div>
  );
}

export default function Dropdown() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] border-2 border-[#ffccd3] border-solid relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] size-full" data-name="Dropdown">
      <OptionText text="Tried A New Recipe" />
      <OptionText text="Read A Cozy Book" />
      <OptionText text="hosted a dinner party" />
    </div>
  );
}