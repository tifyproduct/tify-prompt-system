// Tify Prompt System - Main Application

const WEBHOOK_URL = 'https://id.tify.cloud/webhook/prompt-admin';
const CATEGORY_ORDER = ['medium', 'subject', 'clothing', 'pose', 'outdoor', 'indoor', 'camera', 'lighting', 'processing', 'others'];

// Categories configuration
const categories = [
    { id: 'medium', name: 'Medium', icon: '📸' },
    { id: 'subject', name: 'Subject', icon: '👤' },
    { id: 'clothing', name: 'Clothing', icon: '👕' },
    { id: 'pose', name: 'Pose', icon: '🏃' },
    { id: 'outdoor', name: 'Outdoor', icon: '🌍' },
    { id: 'indoor', name: 'Indoor', icon: '🛌' },
    { id: 'camera', name: 'Camera', icon: '🎥' },
    { id: 'lighting', name: 'Lighting', icon: '💡' },
    { id: 'processing', name: 'Processing', icon: '🎞️' },
    { id: 'others', name: 'Others', icon: '📦' }
];

// State
let selectedCategory = 'medium';
let selectedTab = null;
let selectedPrompts = [];
let promptsData = { categories: [] };

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadPromptsData();
    renderCategories();
    selectCategory('medium');
});

// Load prompts data from localStorage or fetch
async function loadPromptsData() {
    const stored = localStorage.getItem('promptsData');
    if (stored) {
        promptsData = JSON.parse(stored);
    } else {
        // Default data structure
        promptsData = await fetchPromptsFromAPI();
        localStorage.setItem('promptsData', JSON.stringify(promptsData));
    }
}

async function fetchPromptsFromAPI() {
    try {
        const response = await fetch(WEBHOOK_URL + '?action=list', {
            method: 'GET'
        });
        if (response.ok) {
            return await response.json();
        }
    } catch (e) {
        console.log('Using default prompts data');
    }
    return getDefaultPromptsData();
}

// Default prompts data
function getDefaultPromptsData() {
    return {
        categories: [
            {
                id: 'medium',
                name: 'Medium',
                icon: '📸',
                tabs: [
                    { id: 'photography', name: 'Photography', items: [
                        { id: 'ph1', name: 'Tight Portrait', prompt: 'This is a tight portrait photo' },
                        { id: 'ph2', name: 'Portrait', prompt: 'This is a portrait photo' },
                        { id: 'ph3', name: 'Cinematic Portrait', prompt: 'This is a cinematic portrait photo' },
                        { id: 'ph4', name: 'Model Shoot', prompt: 'This is a model shoot photo' },
                        { id: 'ph5', name: 'Candid', prompt: 'This is a spontaneous candid photograph' },
                        { id: 'ph6', name: 'Black & White', prompt: 'This is a classic black-and-white photograph' },
                        { id: 'ph7', name: 'Street Photography', prompt: 'This is a street photography shot' },
                        { id: 'ph8', name: 'Night Photography', prompt: 'This is a night photography shot' },
                        { id: 'ph9', name: 'Landscape', prompt: 'This is a landscape photograph' },
                        { id: 'ph10', name: 'Wildlife', prompt: 'This is a wildlife photograph' }
                    ]},
                    { id: 'anime', name: 'Anime', items: [
                        { id: 'an1', name: 'Anime', prompt: 'Anime style illustration' },
                        { id: 'an2', name: 'Studio Ghibli', prompt: 'Studio Ghibli style' },
                        { id: 'an3', name: 'Pixel Art', prompt: 'Pixel art style' },
                        { id: 'an4', name: 'Digital Painting', prompt: 'Digital painting style' },
                        { id: 'an5', name: '3D Render', prompt: '3D render style' }
                    ]},
                    { id: 'traditional', name: 'Traditional Art', items: [
                        { id: 'ta1', name: 'Pencil Sketch', prompt: 'Pencil sketch' },
                        { id: 'ta2', name: 'Watercolor', prompt: 'Watercolor painting' },
                        { id: 'ta3', name: 'Oil Painting', prompt: 'Oil painting' },
                        { id: 'ta4', name: 'Acrylic Painting', prompt: 'Acrylic painting' }
                    ]}
                ]
            },
            {
                id: 'subject',
                name: 'Subject',
                icon: '👤',
                tabs: [
                    { id: 'age', name: 'Age Group', items: [
                        { id: 'ag1', name: 'Infant / Baby', prompt: 'an infant / baby' },
                        { id: 'ag2', name: 'Toddler', prompt: 'a toddler' },
                        { id: 'ag3', name: 'Child (6-10)', prompt: 'a child (6-10 years old)' },
                        { id: 'ag4', name: 'Teenager', prompt: 'a teenager' },
                        { id: 'ag5', name: 'Young Adult (20s)', prompt: 'a young adult in their 20s' },
                        { id: 'ag6', name: 'Adult (30s-40s)', prompt: 'an adult in their 30s-40s' },
                        { id: 'ag7', name: 'Elderly / Senior', prompt: 'an elderly / senior person' }
                    ]},
                    { id: 'ethnicity', name: 'Ethnicity', items: [
                        { id: 'et1', name: 'Caucasian / White', prompt: 'caucasian / white person' },
                        { id: 'et2', name: 'Black / African', prompt: 'black / african person' },
                        { id: 'et3', name: 'East Asian', prompt: 'east asian person' },
                        { id: 'et4', name: 'South Asian', prompt: 'south asian / indian person' },
                        { id: 'et5', name: 'Hispanic / Latino', prompt: 'hispanic / latino person' },
                        { id: 'et6', name: 'Middle Eastern', prompt: 'middle eastern person' }
                    ]},
                    { id: 'body', name: 'Body Type', items: [
                        { id: 'bm1', name: 'Athletic', prompt: 'with athletic build' },
                        { id: 'bm2', name: 'Slim', prompt: 'with slim build' },
                        { id: 'bm3', name: 'Muscular', prompt: 'with muscular build' },
                        { id: 'bm4', name: 'Curvy', prompt: 'with curvy figure' }
                    ]},
                    { id: 'hair', name: 'Hair', items: [
                        { id: 'hf1', name: 'Short Hair', prompt: 'with short hair' },
                        { id: 'hf2', name: 'Long Hair', prompt: 'with long hair' },
                        { id: 'hf3', name: 'Curly Hair', prompt: 'with curly hair' },
                        { id: 'hf4', name: 'Straight Hair', prompt: 'with straight hair' },
                        { id: 'hf5', name: 'Bald', prompt: 'bald' }
                    ]},
                    { id: 'eyes', name: 'Eyes', items: [
                        { id: 'ey1', name: 'Blue Eyes', prompt: 'with blue eyes' },
                        { id: 'ey2', name: 'Brown Eyes', prompt: 'with brown eyes' },
                        { id: 'ey3', name: 'Green Eyes', prompt: 'with green eyes' }
                    ]}
                ]
            },
            {
                id: 'clothing',
                name: 'Clothing',
                icon: '👕',
                tabs: [
                    { id: 'formal', name: 'Formal', items: [
                        { id: 'cf1', name: 'Business Suit', prompt: 'wearing a business suit' },
                        { id: 'cf2', name: 'Tuxedo', prompt: 'wearing a tuxedo' },
                        { id: 'cf3', name: 'Evening Gown', prompt: 'wearing an evening gown' },
                        { id: 'cf4', name: 'Dress Shirt', prompt: 'wearing a dress shirt' }
                    ]},
                    { id: 'casual', name: 'Casual', items: [
                        { id: 'cc1', name: 'T-Shirt', prompt: 'wearing a t-shirt' },
                        { id: 'cc2', name: 'Jeans', prompt: 'wearing jeans' },
                        { id: 'cc3', name: 'Hoodie', prompt: 'wearing a hoodie' },
                        { id: 'cc4', name: 'Jacket', prompt: 'wearing a jacket' }
                    ]},
                    { id: 'uniform', name: 'Uniform', items: [
                        { id: 'cu1', name: 'Military Uniform', prompt: 'wearing military uniform' },
                        { id: 'cu2', name: 'Police Uniform', prompt: 'wearing police uniform' },
                        { id: 'cu3', name: 'Doctor Coat', prompt: 'wearing doctor coat' },
                        { id: 'cu4', name: 'Chef Uniform', prompt: 'wearing chef uniform' }
                    ]}
                ]
            },
            {
                id: 'pose',
                name: 'Pose',
                icon: '🏃',
                tabs: [
                    { id: 'action', name: 'Action', items: [
                        { id: 'pa1', name: 'Standing', prompt: 'standing' },
                        { id: 'pa2', name: 'Sitting', prompt: 'sitting' },
                        { id: 'pa3', name: 'Walking', prompt: 'walking' },
                        { id: 'pa4', name: 'Running', prompt: 'running' },
                        { id: 'pa5', name: 'Dancing', prompt: 'dancing' },
                        { id: 'pa6', name: 'Jumping', prompt: 'jumping' }
                    ]},
                    { id: 'expression', name: 'Expression', items: [
                        { id: 'pe1', name: 'Smiling', prompt: 'with gentle smile' },
                        { id: 'pe2', name: 'Laughing', prompt: 'laughing' },
                        { id: 'pe3', name: 'Serious', prompt: 'with serious expression' },
                        { id: 'pe4', name: 'Thoughtful', prompt: 'with thoughtful expression' }
                    ]},
                    { id: 'orientation', name: 'Orientation', items: [
                        { id: 'po1', name: 'Front View', prompt: 'front view' },
                        { id: 'po2', name: 'Side Profile', prompt: 'side profile' },
                        { id: 'po3', name: 'Three-Quarter', prompt: 'three-quarter view' },
                        { id: 'po4', name: 'Back View', prompt: 'back view' }
                    ]}
                ]
            },
            {
                id: 'outdoor',
                name: 'Outdoor',
                icon: '🌍',
                tabs: [
                    { id: 'nature', name: 'Nature', items: [
                        { id: 'on1', name: 'Forest', prompt: 'in forest' },
                        { id: 'on2', name: 'Beach', prompt: 'at beach' },
                        { id: 'on3', name: 'Mountain', prompt: 'at mountain' },
                        { id: 'on4', name: 'River', prompt: 'at river' },
                        { id: 'on5', name: 'Waterfall', prompt: 'at waterfall' }
                    ]},
                    { id: 'urban', name: 'Urban', items: [
                        { id: 'ou1', name: 'City Street', prompt: 'on city street' },
                        { id: 'ou2', name: 'Park', prompt: 'in park' },
                        { id: 'ou3', name: 'Downtown', prompt: 'in downtown' },
                        { id: 'ou4', name: 'Neon Plaza', prompt: 'at neon plaza' }
                    ]},
                    { id: 'weather', name: 'Weather', items: [
                        { id: 'ow1', name: 'Sunny', prompt: 'sunny and bright weather' },
                        { id: 'ow2', name: 'Cloudy', prompt: 'partly cloudy weather' },
                        { id: 'ow3', name: 'Rainy', prompt: 'rainy weather' },
                        { id: 'ow4', name: 'Golden Hour', prompt: 'golden hour lighting' }
                    ]}
                ]
            },
            {
                id: 'indoor',
                name: 'Indoor',
                icon: '🛌',
                tabs: [
                    { id: 'home', name: 'Home', items: [
                        { id: 'ih1', name: 'Living Room', prompt: 'in living room' },
                        { id: 'ih2', name: 'Bedroom', prompt: 'in bedroom' },
                        { id: 'ih3', name: 'Kitchen', prompt: 'in kitchen' },
                        { id: 'ih4', name: 'Bathroom', prompt: 'in bathroom' }
                    ]},
                    { id: 'commercial', name: 'Commercial', items: [
                        { id: 'ic1', name: 'Office', prompt: 'in office' },
                        { id: 'ic2', name: 'Studio', prompt: 'in studio' },
                        { id: 'ic3', name: 'Gym', prompt: 'in gym' },
                        { id: 'ic4', name: 'Cafe', prompt: 'in cafe' }
                    ]}
                ]
            },
            {
                id: 'camera',
                name: 'Camera',
                icon: '🎥',
                tabs: [
                    { id: 'type', name: 'Camera Type', items: [
                        { id: 'ct1', name: 'DSLR', prompt: 'shot with DSLR camera' },
                        { id: 'ct2', name: '35mm Film', prompt: 'shot on 35mm film' },
                        { id: 'ct3', name: 'Vintage Polaroid', prompt: 'shot with vintage polaroid' },
                        { id: 'ct4', name: 'Smartphone', prompt: 'smartphone candid style' }
                    ]},
                    { id: 'shot', name: 'Shot Size', items: [
                        { id: 'cs1', name: 'Close-up', prompt: 'close-up shot' },
                        { id: 'cs2', name: 'Medium Shot', prompt: 'medium shot' },
                        { id: 'cs3', name: 'Full Body', prompt: 'full body shot' },
                        { id: 'cs4', name: 'Wide Shot', prompt: 'wide shot' }
                    ]},
                    { id: 'angle', name: 'Angle', items: [
                        { id: 'ca1', name: 'Eye Level', prompt: 'eye level angle' },
                        { id: 'ca2', name: 'Low Angle', prompt: 'low angle shot' },
                        { id: 'ca3', name: 'High Angle', prompt: 'high angle shot' }
                    ]}
                ]
            },
            {
                id: 'lighting',
                name: 'Lighting',
                icon: '💡',
                tabs: [
                    { id: 'source', name: 'Light Source', items: [
                        { id: 'ls1', name: 'Direct Sunlight', prompt: 'with direct sunlight' },
                        { id: 'ls2', name: 'Soft Light', prompt: 'with soft light' },
                        { id: 'ls3', name: 'Neon Lights', prompt: 'with neon lights' },
                        { id: 'ls4', name: 'Studio Strobes', prompt: 'with studio strobes' }
                    ]},
                    { id: 'effects', name: 'Effects', items: [
                        { id: 'le1', name: 'Bokeh', prompt: 'with bokeh effect' },
                        { id: 'le2', name: 'Lens Flare', prompt: 'with lens flare' },
                        { id: 'le3', name: 'Volumetric', prompt: 'with volumetric god rays' }
                    ]}
                ]
            },
            {
                id: 'processing',
                name: 'Processing',
                icon: '🎞️',
                tabs: [
                    { id: 'color', name: 'Color Grade', items: [
                        { id: 'pc1', name: 'High Contrast', prompt: 'with high contrast' },
                        { id: 'pc2', name: 'Muted Colors', prompt: 'with muted colors' },
                        { id: 'pc3', name: 'Warm Palette', prompt: 'with warm palette' },
                        { id: 'pc4', name: 'Cool Palette', prompt: 'with cool palette' }
                    ]},
                    { id: 'filter', name: 'Filter', items: [
                        { id: 'pf1', name: 'Vignette', prompt: 'with vignette' },
                        { id: 'pf2', name: 'Film Grain', prompt: 'with film grain' },
                        { id: 'pf3', name: 'Sepia', prompt: 'with sepia filter' }
                    ]}
                ]
            },
            {
                id: 'others',
                name: 'Others',
                icon: '📦',
                tabs: [
                    { id: 'mood', name: 'Mood', items: [
                        { id: 'om1', name: 'Playful', prompt: 'with playful mood' },
                        { id: 'om2', name: 'Romantic', prompt: 'with romantic mood' },
                        { id: 'om3', name: 'Mysterious', prompt: 'with mysterious mood' },
                        { id: 'om4', name: 'Epic', prompt: 'with epic mood' }
                    ]}
                ]
            }
        ]
    };
}

// Render categories in sidebar
function renderCategories() {
    const nav = document.getElementById('categoryNav');
    nav.innerHTML = categories.map(cat => `
        <button class="category-btn ${cat.id === selectedCategory ? 'active' : ''}" 
                onclick="selectCategory('${cat.id}')">
            <span class="category-icon">${cat.icon}</span>
            <span>${cat.name}</span>
        </button>
    `).join('');
}

// Select category
function selectCategory(categoryId) {
    selectedCategory = categoryId;
    renderCategories();
    
    const category = promptsData.categories.find(c => c.id === categoryId);
    if (category && category.tabs.length > 0) {
        selectTab(category.tabs[0].id);
    }
}

// Select tab
function selectTab(tabId) {
    selectedTab = tabId;
    renderTabs();
    renderGrid();
}

// Render tabs
function renderTabs() {
    const category = promptsData.categories.find(c => c.id === selectedCategory);
    const tab = category?.tabs.find(t => t.id === selectedTab);
    
    document.getElementById('currentCategoryTitle').textContent = 
        `${category?.name || ''} / ${tab?.name || ''}`;
    
    const tabsContainer = document.getElementById('tabsContainer');
    tabsContainer.innerHTML = category?.tabs.map(t => `
        <button class="tab-btn ${t.id === selectedTab ? 'active' : ''}" 
                onclick="selectTab('${t.id}')">
            ${t.name}
        </button>
    `).join('');
}

// Render prompt grid
function renderGrid() {
    const category = promptsData.categories.find(c => c.id === selectedCategory);
    const tab = category?.tabs.find(t => t.id === selectedTab);
    const items = tab?.items || [];
    
    const grid = document.getElementById('promptGrid');
    
    if (items.length === 0) {
        grid.innerHTML = '<div class="empty-state">No items in this category</div>';
        return;
    }
    
    grid.innerHTML = items.map(item => {
        const isSelected = selectedPrompts.some(p => 
            p.categoryId === selectedCategory && p.prompt === item.prompt
        );
        return `
            <div class="prompt-card ${isSelected ? 'selected' : ''}" 
                 onclick="togglePrompt('${item.prompt.replace(/'/g, "\\'")}')">
                <div class="prompt-card-check">✓</div>
                <div class="prompt-card-image">
                    ${item.name}
                </div>
                <div class="prompt-card-content">
                    <p class="prompt-card-title">${item.name}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Toggle prompt selection
function togglePrompt(prompt) {
    const existing = selectedPrompts.find(p => p.categoryId === selectedCategory);
    
    if (existing) {
        if (existing.prompt === prompt) {
            selectedPrompts = selectedPrompts.filter(p => p.categoryId !== selectedCategory);
        } else {
            selectedPrompts = selectedPrompts.map(p => 
                p.categoryId === selectedCategory ? { ...p, prompt } : p
            );
        }
    } else {
        selectedPrompts.push({ categoryId: selectedCategory, prompt });
    }
    
    renderGrid();
    updatePromptBox();
}

// Update prompt box display
function updatePromptBox() {
    const count = selectedPrompts.length;
    document.getElementById('promptCount').textContent = count;
    
    const tagsContainer = document.getElementById('promptTags');
    tagsContainer.innerHTML = selectedPrompts.length === 0 
        ? '<p class="placeholder">Click on any item above to add it to your prompt</p>'
        : selectedPrompts.map(p => `
            <span class="prompt-tag">
                ${p.prompt}
                <button onclick="removePrompt('${p.prompt.replace(/'/g, "\\'")}')">✕</button>
            </span>
        `).join('');
    
    const output = formatDetailedPrompt();
    document.getElementById('promptOutput').value = output;
    
    document.getElementById('btnClearAll').style.display = count > 0 ? 'block' : 'none';
    document.getElementById('btnCopy').disabled = count === 0;
}

// Format detailed prompt (ordered)
function formatDetailedPrompt() {
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
    
    const parts = [];
    
    if (medium) parts.push(medium.prompt);
    if (subject) parts.push(subject.prompt);
    if (clothing) parts.push(clothing.prompt);
    if (pose) parts.push(pose.prompt);
    
    const setting = indoor || outdoor;
    if (setting) parts.push(setting.prompt);
    
    if (lighting) parts.push(lighting.prompt);
    if (camera) parts.push(camera.prompt);
    if (processing) parts.push(processing.prompt);
    if (others) parts.push(others.prompt);
    
    return parts.join(', ');
}

// Remove prompt
function removePrompt(prompt) {
    selectedPrompts = selectedPrompts.filter(p => p.prompt !== prompt);
    renderGrid();
    updatePromptBox();
}

// Clear all prompts
function clearAllPrompts() {
    selectedPrompts = [];
    renderGrid();
    updatePromptBox();
}

// Copy prompt
async function copyPrompt() {
    const output = document.getElementById('promptOutput').value;
    if (!output) return;
    
    try {
        await navigator.clipboard.writeText(output);
        const btn = document.getElementById('btnCopy');
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = '📋 Copy';
            btn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Helper function untuk delete item
async function deleteItem(id, categoryId) {
    const result = await callWebhook('delete', { id, categoryId });
    if (result.success) {
        showToast('Item deleted successfully');
        await loadPromptsData();
        renderGrid();
    }
}

// Helper function untuk create item
async function createItem(data) {
    const result = await callWebhook('create', data);
    if (result.success) {
        showToast('Item created successfully');
        await loadPromptsData();
    }
    return result;
}

// Helper function untuk update item
async function updateItem(data) {
    const result = await callWebhook('update', data);
    if (result.success) {
        showToast('Item updated successfully');
        await loadPromptsData();
    }
    return result;
}

// Call webhook
async function callWebhook(action, data = {}) {
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, ...data })
        });
        return await response.json();
    } catch (e) {
        console.error('Webhook error:', e);
        return { success: false, message: e.message };
    }
}

// Export functions to global scope
window.selectCategory = selectCategory;
window.selectTab = selectTab;
window.togglePrompt = togglePrompt;
window.removePrompt = removePrompt;
window.clearAllPrompts = clearAllPrompts;
window.copyPrompt = copyPrompt;
window.callWebhook = callWebhook;
window.showToast = showToast;
window.deleteItem = deleteItem;
window.createItem = createItem;
window.updateItem = updateItem;