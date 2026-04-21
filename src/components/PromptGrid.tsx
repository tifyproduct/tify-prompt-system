'use client';

interface PromptItem {
  id: string;
  name: string;
  prompt: string;
  image?: string;
}

interface PromptGridProps {
  items: PromptItem[];
  selectedPrompts: string[];
  onPromptClick: (prompt: string, id: string) => void;
}

export default function PromptGrid({
  items,
  selectedPrompts,
  onPromptClick,
}: PromptGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {items.map((item) => {
        const isSelected = selectedPrompts.includes(item.prompt);
        return (
          <button
            key={item.id}
            onClick={() => onPromptClick(item.prompt, item.id)}
            className={`group relative overflow-hidden rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              isSelected
                ? 'ring-4 ring-yellow-400 shadow-yellow-400/50'
                : 'ring-2 ring-transparent hover:ring-yellow-400/50'
            }`}
          >
            <div className="aspect-[3/2] bg-gray-800 flex items-center justify-center">
              <img
                src={item.image || `https://placehold.co/300x200/374151/9CA3AF?text=${encodeURIComponent(item.name.substring(0, 20))}`}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 pt-8">
              <p className="text-white text-xs font-medium truncate">{item.name}</p>
            </div>
            {isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}