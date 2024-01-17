// Chip.tsx
import React from "react";
import { UserData } from "../data/data";

interface ChipProps {
  item: UserData;
  index: number;
  highlightSelectedIndex: number | null;
  handleChipRemove: (item: UserData) => void;
}

const Chip: React.FC<ChipProps> = ({
  item,
  index,
  highlightSelectedIndex,
  handleChipRemove,
}) => {
  return (
    <li
      key={index}
      id={`chip-${index}`}
      className={`flex items-center justify-between bg-gray-300 rounded-full pr-3 gap-3 max-w-full  ${
        index === highlightSelectedIndex ? "border-blue-400 border-2" : ""
      }`}
    >
      <img src={item.picture} alt={item.name} className="rounded-full" />
      <span className="font-normal whitespace-nowrap overflow-hidden text-ellipsis">
        {item.name}
      </span>
      <button
        type="button"
        className="cursor-pointer text-lg"
        onClick={() => handleChipRemove(item)}
      >
        x
      </button>
    </li>
  );
};

export default Chip;
