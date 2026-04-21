// Tify Prompt System - Admin Panel

const WEBHOOK_URL = 'https://id.tify.cloud/webhook/prompt-admin';

// State
let promptsData = { categories: [] };
let editingCategoryId = null;
let editingTabId = null;
let editingItemId = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    loadFromLocalStorage();
    renderCategorySelects();
    await loadCategories();
    await loadTabs();
});

// Load from localStorage
function loadFromLocalStorage() {
    const stored = localStorage.getItem('promptsData');
    if (stored) {
        promptsData = JSON.parse(stored);
    }
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('promptsData', JSON.stringify(promptsData));
}

// Render category selects
function renderCategorySelects() {
    const options = '<option value="">Select Category</option>' + 
        promptsData.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    document.getElementById('tabCategorySelect').innerHTML = options;
    document.getElementById('tabCategory').innerHTML = options;
    document.getElementById('itemCategorySelect').innerHTML = options;
    document.getElementById('itemCategory').innerHTML = options;
}

// ============ CATEGORIES ============

async function loadCategories() {
    const tbody = document.getElementById('categoriesTable');
    
    if (promptsData.categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No categories found</td></tr>';
        return;
    }
    
    tbody.innerHTML = promptsData.categories.map(cat => {
        const tabCount = cat.tabs ? cat.tabs.length : 0;
        return `
            <tr>
                <td>${cat.id}</td>
                <td>${cat.icon} ${cat.name}</td>
                <td>${cat.icon || '-'}</td>
                <td>${tabCount} tabs</td>
                <td class="actions">
                    <button class="btn-sm btn-edit" onclick="editCategory('${cat.id}')">Edit</button>
                    <button class="btn-sm btn-delete" onclick="deleteCategory('${cat.id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

function openCategoryModal(editId = null) {
    editingCategoryId = editId;
    const modal = document.getElementById('categoryModal');
    const title = document.getElementById('categoryModalTitle');
    
    if (editId) {
        const cat = promptsData.categories.find(c => c.id === editId);
        title.textContent = 'Edit Category';
        document.getElementById('categoryId').value = cat.id;
        document.getElementById('categoryName').value = cat.name;
        document.getElementById('categoryIcon').value = cat.icon || '';
        document.getElementById('categoryId').disabled = true;
    } else {
        title.textContent = 'Add Category';
        document.getElementById('categoryId').value = '';
        document.getElementById('categoryName').value = '';
        document.getElementById('categoryIcon').value = '';
        document.getElementById('categoryId').disabled = false;
    }
    
    modal.classList.add('active');
}

async function saveCategory() {
    const id = document.getElementById('categoryId').value.trim();
    const name = document.getElementById('categoryName').value.trim();
    const icon = document.getElementById('categoryIcon').value.trim();
    
    if (!id || !name) {
        showToast('ID and Name are required', 'error');
        return;
    }
    
    // Try to sync with webhook first
    const webhookResult = await callWebhook('save_category', { id, name, icon });
    
    // Update local data
    if (editingCategoryId) {
        const cat = promptsData.categories.find(c => c.id === editingCategoryId);
        if (cat) {
            cat.name = name;
            cat.icon = icon;
        }
    } else {
        promptsData.categories.push({
            id,
            name,
            icon,
            tabs: []
        });
    }
    
    saveToLocalStorage();
    closeModal('categoryModal');
    renderCategorySelects();
    await loadCategories();
    showToast(webhookResult.success ? 'Category saved!' : 'Saved locally');
}

async function editCategory(id) {
    openCategoryModal(id);
}

async function deleteCategory(id) {
    if (!confirm('Delete this category and all its tabs?')) return;
    
    await callWebhook('delete_category', { id });
    promptsData.categories = promptsData.categories.filter(c => c.id !== id);
    saveToLocalStorage();
    renderCategorySelects();
    await loadCategories();
    showToast('Category deleted');
}

// ============ TABS ============

async function loadTabs() {
    const categoryId = document.getElementById('tabCategorySelect').value;
    const tbody = document.getElementById('tabsTable');
    
    if (!categoryId) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Select a category first</td></tr>';
        return;
    }
    
    const category = promptsData.categories.find(c => c.id === categoryId);
    const tabs = category?.tabs || [];
    
    if (tabs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No tabs found</td></tr>';
        return;
    }
    
    tbody.innerHTML = tabs.map(tab => `
        <tr>
            <td>${tab.id}</td>
            <td>${tab.name}</td>
            <td>${category.name}</td>
            <td>${tab.items?.length || 0} items</td>
            <td class="actions">
                <button class="btn-sm btn-edit" onclick="editTab('${category.id}', '${tab.id}')">Edit</button>
                <button class="btn-sm btn-delete" onclick="deleteTab('${category.id}', '${tab.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function openTabModal(editId = null) {
    const categoryId = document.getElementById('tabCategorySelect').value;
    if (!categoryId) {
        showToast('Please select a category first', 'error');
        return;
    }
    
    editingTabId = editId;
    const modal = document.getElementById('tabModal');
    const title = document.getElementById('tabModalTitle');
    
    document.getElementById('tabCategory').value = categoryId;
    
    if (editId) {
        const category = promptsData.categories.find(c => c.id === categoryId);
        const tab = category?.tabs.find(t => t.id === editId);
        title.textContent = 'Edit Tab';
        document.getElementById('tabId').value = tab.id;
        document.getElementById('tabName').value = tab.name;
        document.getElementById('tabId').disabled = true;
    } else {
        title.textContent = 'Add Tab';
        document.getElementById('tabId').value = '';
        document.getElementById('tabName').value = '';
        document.getElementById('tabId').disabled = false;
    }
    
    modal.classList.add('active');
}

async function saveTab() {
    const categoryId = document.getElementById('tabCategory').value;
    const id = document.getElementById('tabId').value.trim();
    const name = document.getElementById('tabName').value.trim();
    
    if (!id || !name) {
        showToast('ID and Name are required', 'error');
        return;
    }
    
    await callWebhook('save_tab', { categoryId, id, name });
    
    const category = promptsData.categories.find(c => c.id === categoryId);
    if (editingTabId) {
        const tab = category?.tabs.find(t => t.id === editingTabId);
        if (tab) tab.name = name;
    } else {
        category.tabs.push({ id, name, items: [] });
    }
    
    saveToLocalStorage();
    closeModal('tabModal');
    await loadTabs();
    showToast('Tab saved!');
}

async function editTab(categoryId, tabId) {
    document.getElementById('tabCategorySelect').value = categoryId;
    await loadTabs();
    openTabModal(tabId);
}

async function deleteTab(categoryId, tabId) {
    if (!confirm('Delete this tab and all its items?')) return;
    
    await callWebhook('delete_tab', { categoryId, tabId });
    
    const category = promptsData.categories.find(c => c.id === categoryId);
    category.tabs = category.tabs.filter(t => t.id !== tabId);
    saveToLocalStorage();
    await loadTabs();
    showToast('Tab deleted');
}

// ============ ITEMS ============

function loadItemTabs() {
    const categoryId = document.getElementById('itemCategorySelect').value;
    const tabSelect = document.getElementById('itemTabSelect');
    
    if (!categoryId) {
        tabSelect.innerHTML = '<option value="">Select Tab</option>';
        loadItems();
        return;
    }
    
    const category = promptsData.categories.find(c => c.id === categoryId);
    const tabs = category?.tabs || [];
    
    tabSelect.innerHTML = '<option value="">Select Tab</option>' + 
        tabs.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    
    loadItems();
}

function loadItemTabsModal() {
    const categoryId = document.getElementById('itemCategory').value;
    const tabSelect = document.getElementById('itemTab');
    
    if (!categoryId) {
        tabSelect.innerHTML = '<option value="">Select Tab</option>';
        return;
    }
    
    const category = promptsData.categories.find(c => c.id === categoryId);
    const tabs = category?.tabs || [];
    
    tabSelect.innerHTML = '<option value="">Select Tab</option>' + 
        tabs.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

async function loadItems() {
    const categoryId = document.getElementById('itemCategorySelect').value;
    const tabId = document.getElementById('itemTabSelect').value;
    const tbody = document.getElementById('itemsTable');
    
    if (!categoryId || !tabId) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Select a category and tab</td></tr>';
        return;
    }
    
    const category = promptsData.categories.find(c => c.id === categoryId);
    const tab = category?.tabs.find(t => t.id === tabId);
    const items = tab?.items || [];
    
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No items found</td></tr>';
        return;
    }
    
    tbody.innerHTML = items.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.prompt.substring(0, 50)}${item.prompt.length > 50 ? '...' : ''}</td>
            <td class="actions">
                <button class="btn-sm btn-edit" onclick="editItem('${categoryId}', '${tabId}', '${item.id}')">Edit</button>
                <button class="btn-sm btn-delete" onclick="deleteItem('${categoryId}', '${tabId}', '${item.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function openItemModal(editId = null) {
    const categoryId = document.getElementById('itemCategorySelect').value;
    const tabId = document.getElementById('itemTabSelect').value;
    
    if (!categoryId || !tabId) {
        showToast('Please select a category and tab first', 'error');
        return;
    }
    
    editingItemId = editId;
    const modal = document.getElementById('itemModal');
    const title = document.getElementById('itemModalTitle');
    
    document.getElementById('itemCategory').value = categoryId;
    loadItemTabsModal();
    document.getElementById('itemTab').value = tabId;
    
    if (editId) {
        const category = promptsData.categories.find(c => c.id === categoryId);
        const tab = category?.tabs.find(t => t.id === tabId);
        const item = tab?.items.find(i => i.id === editId);
        
        title.textContent = 'Edit Item';
        document.getElementById('itemId').value = item.id;
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemPrompt').value = item.prompt;
        document.getElementById('itemId').disabled = true;
    } else {
        title.textContent = 'Add Item';
        document.getElementById('itemId').value = '';
        document.getElementById('itemName').value = '';
        document.getElementById('itemPrompt').value = '';
        document.getElementById('itemId').disabled = false;
    }
    
    modal.classList.add('active');
}

async function saveItem() {
    const categoryId = document.getElementById('itemCategory').value;
    const tabId = document.getElementById('itemTab').value;
    const id = document.getElementById('itemId').value.trim();
    const name = document.getElementById('itemName').value.trim();
    const prompt = document.getElementById('itemPrompt').value.trim();
    
    if (!id || !name || !prompt) {
        showToast('All fields are required', 'error');
        return;
    }
    
    await callWebhook('save_item', { categoryId, tabId, id, name, prompt });
    
    const category = promptsData.categories.find(c => c.id === categoryId);
    const tab = category?.tabs.find(t => t.id === tabId);
    
    if (editingItemId) {
        const item = tab?.items.find(i => i.id === editingItemId);
        if (item) {
            item.name = name;
            item.prompt = prompt;
        }
    } else {
        tab.items.push({ id, name, prompt });
    }
    
    saveToLocalStorage();
    closeModal('itemModal');
    await loadItems();
    showToast('Item saved!');
}

async function editItem(categoryId, tabId, itemId) {
    document.getElementById('itemCategorySelect').value = categoryId;
    loadItemTabs();
    document.getElementById('itemTabSelect').value = tabId;
    await loadItems();
    openItemModal(itemId);
}

async function deleteItem(categoryId, tabId, itemId) {
    if (!confirm('Delete this item?')) return;
    
    await callWebhook('delete_item', { categoryId, tabId, itemId });
    
    const category = promptsData.categories.find(c => c.id === categoryId);
    const tab = category?.tabs.find(t => t.id === tabId);
    tab.items = tab.items.filter(i => i.id !== itemId);
    
    saveToLocalStorage();
    await loadItems();
    showToast('Item deleted');
}

// ============ SYNC ============

async function syncFromAPI() {
    showToast('Syncing from API...');
    
    const result = await callWebhook('list');
    if (result.success && result.data) {
        promptsData = result.data;
        saveToLocalStorage();
        renderCategorySelects();
        await loadCategories();
        await loadTabs();
        showToast('Synced from API successfully!');
    } else {
        showToast('Failed to sync from API', 'error');
    }
}

async function pushToAPI() {
    showToast('Pushing to API...');
    
    const result = await callWebhook('sync', promptsData);
    if (result.success) {
        showToast('Pushed to API successfully!');
    } else {
        showToast('Failed to push to API', 'error');
    }
}

// ============ HELPERS ============

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

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });
});

// Export to global
window.openCategoryModal = openCategoryModal;
window.saveCategory = saveCategory;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
window.loadTabs = loadTabs;
window.openTabModal = openTabModal;
window.saveTab = saveTab;
window.editTab = editTab;
window.deleteTab = deleteTab;
window.loadItemTabs = loadItemTabs;
window.loadItemTabsModal = loadItemTabsModal;
window.loadItems = loadItems;
window.openItemModal = openItemModal;
window.saveItem = saveItem;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.syncFromAPI = syncFromAPI;
window.pushToAPI = pushToAPI;
window.closeModal = closeModal;
window.showToast = showToast;
window.callWebhook = callWebhook;