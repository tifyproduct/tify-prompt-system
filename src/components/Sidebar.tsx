'use client';

import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
  tabs: {
    id: string;
    name: string;
    items: {
      id: string;
      name: string;
      prompt: string;
      image?: string;
    }[];
  }[];
}

interface SidebarProps {
  categories: Category[];
  selectedCategory: string;
  selectedTab: string;
  onCategorySelect: (categoryId: string) => void;
  onTabSelect: (tabId: string) => void;
}

export default function Sidebar({
  categories,
  selectedCategory,
  selectedTab,
  onCategorySelect,
  onTabSelect,
}: SidebarProps) {
  const currentCategory = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-yellow-400">PromptMania</h1>
        <p className="text-xs text-gray-400 mt-1">Visual AI Prompt Builder</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onCategorySelect(category.id);
                if (category.tabs.length > 0) {
                  onTabSelect(category.tabs[0].id);
                }
              }}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                selectedCategory === category.id
                  ? 'bg-yellow-500/20 text-yellow-400 border-l-4 border-yellow-400'
                  : 'hover:bg-gray-800 text-gray-300 border-l-4 border-transparent'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {currentCategory && currentCategory.tabs.length > 0 && (
        <div className="p-4 border-t border-gray-800 bg-gray-800/50">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Tabs
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentCategory.tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabSelect(tab.id)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-yellow-500 text-gray-900 font-medium'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
