"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { UserData } from "../data/data";
import useInputContentWidth from "../hooks/useInputContentWidth";
import AutocompleteItem from "../components/AutocompleteItem";
import Chip from "../components/Chip";

interface AutocompleteFormsProps {
  items: UserData[];
}

const AutocompleteForm: React.FC<AutocompleteFormsProps> = ({ items }) => {
  const [selectedChip, setSelectedChip] = useState<UserData[]>([]);
  const [filteredChip, setFilteredChip] = useState<UserData[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [highlightSelectedIndex, setHighlightSelectedIndex] = useState<
    number | null
  >(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputContentWidth = useInputContentWidth(inputValue, inputRef);
  const inputWidth = useMemo(() => {
    const listWidth = listRef.current?.offsetWidth || 0;
    return listWidth > inputContentWidth ? inputContentWidth : listWidth;
  }, [inputContentWidth]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setHighlightedIndex(null);
  };

  const handleInputFocus = (): void => {
    setIsInputFocused(true);
  };

  const handleInputBlur = (): void => {
    setIsInputFocused(false);
    setHighlightSelectedIndex(null);
    setHighlightedIndex(null);
  };

  useEffect(() => {
    const cleanedInputValue = inputValue.replace(/\s+/g, " ").trim();
    setFilteredChip(
      items.filter(
        (item) =>
          !selectedChip.includes(item) &&
          (cleanedInputValue === "" ||
            item.name.toLowerCase().includes(cleanedInputValue.toLowerCase()))
      )
    );
  }, [inputValue, selectedChip, items]);

  const handleItemClick = (item: UserData): void => {
    if (isInputFocused) {
      setHighlightSelectedIndex(null);
      inputRef.current?.focus();
      setSelectedChip([...selectedChip, item]);
      setInputValue("");
      setHighlightedIndex(null);
    }
  };

  const handleChipRemove = (item: UserData): void => {
    inputRef.current?.focus();
    const updatedItems = selectedChip.filter(
      (selectedItem) => selectedItem !== item
    );
    setSelectedChip(updatedItems);
    setHighlightSelectedIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const arrowDown = "ArrowDown";
    const arrowUp = "ArrowUp";
    const enter = "Enter";
    const backspace = "Backspace";

    if (e.key === arrowDown || e.key === arrowUp) {
      e.preventDefault();
      const direction = e.key === arrowDown ? 1 : -1;
      let newIndex =
        highlightedIndex === null
          ? direction === 1
            ? 0
            : filteredChip.length - 1
          : (highlightedIndex + direction + filteredChip.length) %
            filteredChip.length;

      if (highlightedIndex === 0 && direction === -1) {
        newIndex = 0;
      }

      if (highlightedIndex === filteredChip.length - 1 && direction === 1) {
        newIndex = filteredChip.length - 1;
      }

      setHighlightedIndex(newIndex);
      // Scroll the highlighted item into view
      const listItem = document.getElementById(`list-item-${newIndex}`);
      listItem?.scrollIntoView({ behavior: "auto", block: "nearest" });
    } else if (e.key === enter && highlightedIndex !== null) {
      e.preventDefault();
      handleItemClick(filteredChip[highlightedIndex]);
    } else if (e.key === backspace && inputValue.length === 0) {
      e.preventDefault();
      setIsInputFocused(false);
      if (selectedChip.length > 0) {
        if (highlightSelectedIndex === null) {
          setHighlightSelectedIndex(selectedChip.length - 1);
        } else {
          handleChipRemove(selectedChip[selectedChip.length - 1]);
          setHighlightSelectedIndex(null);
          setIsInputFocused(true);
        }
      }
    }
  };

  return (
    <div className="relative mt-12">
      <div className="group cursor-text relative flex justify-start gap-2 border-b-2 border-solid py-1 my-2 focus-within:border-blue-400 px-1 text-sm">
        <ul
          className="flex items-center justify-start gap-1 flex-wrap"
          ref={listRef}
        >
          {(selectedChip || []).map((item, index) => (
            <Chip
              item={item}
              index={index}
              highlightSelectedIndex={highlightSelectedIndex}
              handleChipRemove={handleChipRemove}
            />
          ))}
          <li className="min-w-max py-2 pl-2" style={{ width: inputWidth }}>
            <input
              ref={inputRef}
              type="text"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="p-0 m-0 border-transparent focus:border-transparent focus:ring-0 w-full outline-none"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Add new user..."
            />
            <AutocompleteItem
              item={filteredChip}
              highlightedIndex={highlightedIndex}
              setHighlightedIndex={setHighlightedIndex}
              handleItemClick={handleItemClick}
              inputValue={inputValue}
              isInputFocused={isInputFocused}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AutocompleteForm;
