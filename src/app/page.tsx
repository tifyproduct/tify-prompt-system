'use client';

import { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import PromptGrid from '@/components/PromptGrid';
import PromptBox from '@/components/PromptBox';
import promptsData from '@/data/prompts.json';

interface SelectedPrompt {
  categoryId: string;
  prompt: string;
}

interface PromptItem {
  id: string;
  name: string;
  prompt: string;
  image?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  tabs: {
    id: string;
    name: string;
    items: PromptItem[];
  }[];
}

const categories: Category[] = promptsData.categories;

const CATEGORY_ORDER = ['medium', 'subject', 'clothing', 'pose', 'outdoor', 'indoor', 'camera', 'lighting', 'processing', 'others'];

const formatDetailedPrompt = (selectedPrompts: SelectedPrompt[]): string => {
  if (selectedPrompts.length === 0) return '';

  const sortedPrompts = [...selectedPrompts].sort((a, b) => {
    const orderA = CATEGORY_ORDER.indexOf(a.categoryId);
    const orderB = CATEGORY_ORDER.indexOf(b.categoryId);
    return (orderA === -1 ? 999 : orderA) - (orderB === -1 ? 999 : orderB);
  });

  const medium = sortedPrompts.find(p => p.categoryId === 'medium');
  const subject = sortedPrompts.find(p => p.categoryId === 'subject');
  const clothing = sortedPrompts.find(p => p.categoryId === 'clothing');
  const pose = sortedPrompts.find(p => p.categoryId === 'pose');
  const outdoor = sortedPrompts.find(p => p.categoryId === 'outdoor');
  const indoor = sortedPrompts.find(p => p.categoryId === 'indoor');
  const camera = sortedPrompts.find(p => p.categoryId === 'camera');
  const lighting = sortedPrompts.find(p => p.categoryId === 'lighting');
  const processing = sortedPrompts.find(p => p.categoryId === 'processing');
  const others = sortedPrompts.find(p => p.categoryId === 'others');

  const parts: string[] = [];

  if (medium) {
    parts.push(medium.prompt);
  }

  if (subject) {
    parts.push(subject.prompt);
  }

  if (clothing) {
    parts.push(clothing.prompt);
  }

  if (pose) {
    parts.push(pose.prompt);
  }

  const setting = indoor || outdoor;
  if (setting) {
    parts.push(setting.prompt);
  }

  const light = lighting;
  if (light) {
    parts.push(light.prompt);
  }

  if (camera) {
    parts.push(camera.prompt);
  }

  if (processing) {
    parts.push(processing.prompt);
  }

  if (others) {
    parts.push(others.prompt);
  }

  return parts.join(', ');
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('medium');
  const [selectedTab, setSelectedTab] = useState('photography');
  const [selectedPrompts, setSelectedPrompts] = useState<SelectedPrompt[]>([]);

  const currentCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategory),
    [selectedCategory]
  );

  const currentItems = useMemo(() => {
    const tab = currentCategory?.tabs.find((t) => t.id === selectedTab);
    return tab?.items || [];
  }, [currentCategory, selectedTab]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = categories.find((c) => c.id === categoryId);
    if (category && category.tabs.length > 0) {
      setSelectedTab(category.tabs[0].id);
    }
  };

  const handleTabSelect = (tabId: string) => {
    setSelectedTab(tabId);
  };

  const handlePromptClick = (prompt: string, _id: string) => {
    setSelectedPrompts((prev) => {
      const existing = prev.find(p => p.categoryId === selectedCategory);
      if (existing) {
        if (existing.prompt === prompt) {
          return prev.filter(p => p.categoryId !== selectedCategory);
        } else {
          return prev.map(p => p.categoryId === selectedCategory ? { ...p, prompt } : p);
        }
      }
      return [...prev, { categoryId: selectedCategory, prompt }];
    });
  };

  const handleRemovePrompt = (prompt: string) => {
    setSelectedPrompts((prev) => prev.filter((p) => p.prompt !== prompt));
  };

  const handleClearAll = () => {
    setSelectedPrompts([]);
  };

  const detailedPrompt = useMemo(() => formatDetailedPrompt(selectedPrompts), [selectedPrompts]);
  const simplePrompt = selectedPrompts.map(p => p.prompt).join(', ');

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        selectedTab={selectedTab}
        onCategorySelect={handleCategorySelect}
        onTabSelect={handleTabSelect}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentCategory?.name} / {currentCategory?.tabs.find((t) => t.id === selectedTab)?.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Click on any image to add/remove from your prompt
          </p>
        </header>

        <div className="flex-1 overflow-y-auto">
          <PromptGrid
            items={currentItems}
            selectedPrompts={selectedPrompts.map(p => p.prompt)}
            onPromptClick={handlePromptClick}
          />
        </div>

        <PromptBox
          selectedPrompts={selectedPrompts.map(p => p.prompt)}
          onRemovePrompt={handleRemovePrompt}
          onClearAll={handleClearAll}
          detailedPrompt={detailedPrompt}
        />
      </div>
    </div>
  );
}