'use client';

import { useState } from 'react';

interface PromptBoxProps {
  selectedPrompts: string[];
  onRemovePrompt: (prompt: string) => void;
  onClearAll: () => void;
  detailedPrompt?: string;
}

export default function PromptBox({
  selectedPrompts,
  onRemovePrompt,
  onClearAll,
  detailedPrompt = '',
}: PromptBoxProps) {
  const [copied, setCopied] = useState(false);

  const fullPrompt = detailedPrompt || selectedPrompts.join(', ');

  const handleCopy = async () => {
    if (!fullPrompt) return;

    try {
      await navigator.clipboard.writeText(fullPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white border-t-4 border-yellow-400 shadow-lg">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Your Prompt ({selectedPrompts.length})
          </h3>
          <div className="flex gap-2">
            {selectedPrompts.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={handleCopy}
              disabled={!fullPrompt}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                fullPrompt
                  ? copied
                    ? 'bg-green-500 text-white'
                    : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {copied ? (
                <>
                  <svg
                    className="w-4 h-4"
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
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 min-h-[120px] max-h-[200px] overflow-y-auto bg-white">
        {selectedPrompts.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Click on any image above to add it to your prompt
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedPrompts.map((prompt, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm group"
              >
                {prompt}
                <button
                  onClick={() => onRemovePrompt(prompt)}
                  className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-yellow-200 transition-colors"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {fullPrompt && (
        <div className="px-4 pb-4">
          <textarea
            readOnly
            value={fullPrompt}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm resize-none"
            rows={3}
            placeholder="Your prompt will appear here..."
          />
        </div>
      )}
    </div>
  );
}