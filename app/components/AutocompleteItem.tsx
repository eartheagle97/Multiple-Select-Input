// AutocompleteItem.tsx
import React from "react";
import { UserData } from "../data/data";

interface AutocompleteItemProps {
  item: UserData[];
  highlightedIndex: number | null;
  setHighlightedIndex: (index: number | null) => void;
  handleItemClick: (item: UserData) => void;
  inputValue: string;
  isInputFocused: boolean;
}

const AutocompleteItem: React.FC<AutocompleteItemProps> = ({
  item,
  highlightedIndex,
  setHighlightedIndex,
  handleItemClick,
  inputValue,
  isInputFocused,
}) => {
  const highlightMatchedPart = (
    name: string,
    inputValue: string
  ): React.ReactNode => {
    const index = name.toLowerCase().indexOf(inputValue.toLowerCase());

    if (index === -1) {
      return name;
    }

    const prefix = name.substring(0, index);
    const matchedPart = name.substring(index, index + inputValue.length);
    const suffix = name.substring(index + inputValue.length);

    return (
      <>
        {prefix}
        <span className="font-bold text-slate-400">{matchedPart}</span>
        {suffix}
      </>
    );
  };

  return (
    <div
      className={`absolute min-w-0 group-focus-within:visible shadow-2xl bg-white border-borderGray border top-full mt-1 ${
        isInputFocused ? "" : "hidden"
      }`}
    >
      <ul className="max-h-72 overflow-y-auto">
        {item.map((item, index) => (
          <li
            key={index}
            id={`list-item-${index}`}
            className={`cursor-pointer p-2 my-1 hover:bg-gray-100 flex items-center px-4 ${
              index === highlightedIndex ? "bg-gray-100" : ""
            }`}
            onMouseEnter={() => setHighlightedIndex(index)}
            onMouseDown={(e) => {
              e.preventDefault();
              handleItemClick(item);
            }}
            tabIndex={0}
          >
            <div className="flex items-center w-52">
              <img
                src={item.picture}
                alt={item.name}
                className="rounded-full mx-2 w-10 h-10"
              />
              <p className="font-bold">
                {highlightMatchedPart(item.name, inputValue)}
              </p>
            </div>
            <p className="font-normal text-gray-400">{item.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutocompleteItem;
