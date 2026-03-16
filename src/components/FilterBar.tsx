import { FILTER_CHIPS } from '@/lib/mock-data';

interface FilterBarProps {
  activeFilters: string[];
  onToggle: (key: string) => void;
}

export const FilterBar = ({ activeFilters, onToggle }: FilterBarProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {FILTER_CHIPS.map(chip => (
        <button
          key={chip.key}
          onClick={() => onToggle(chip.key)}
          className={`filter-chip whitespace-nowrap ${
            activeFilters.includes(chip.key) ? 'filter-chip-active' : ''
          }`}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
};
