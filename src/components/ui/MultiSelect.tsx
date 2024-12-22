// src/components/ui/multi-select.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';

interface Option {
    id: string;
    name: string;
    [key: string]: string | number | boolean;
}

interface MultiSelectProps<T extends Option> {
  value: string[];
  options: T[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect<T extends Option>({ 
  value, 
  options, 
  onChange,
  placeholder = "Select options...",
  className = ""
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="h-[38px] border rounded-md bg-white cursor-pointer flex items-center relative overflow-hidden hover:border-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
      >
        {value.length === 0 ? (
          <span className="text-gray-400 px-2">{placeholder}</span>
        ) : (
          <div className="flex items-center px-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
            {value.map((optionId, index) => {
              const option = options.find(o => o.id === optionId);
              if (index < 2) {
                return (
                  <span 
                    key={optionId}
                    className="flex-shrink-0 bg-cyan-50 text-cyan-700 px-2 py-1 rounded-md text-sm flex items-center gap-1 mr-1"
                  >
                    {option?.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(value.filter(id => id !== optionId));
                      }}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                );
              }
              return null;
            })}
            {value.length > 2 && (
              <span className="flex-shrink-0 bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm">
                +{value.length - 2} more
              </span>
            )}
          </div>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10">
          {options.map(option => (
            <div
              key={option.id}
              onClick={() => {
                const newValue = value.includes(option.id)
                  ? value.filter(id => id !== option.id)
                  : [...value, option.id];
                onChange(newValue);
              }}
              className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
            >
              <div className="w-4 h-4 border rounded flex items-center justify-center">
                {value.includes(option.id) && <Check size={12} />}
              </div>
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}