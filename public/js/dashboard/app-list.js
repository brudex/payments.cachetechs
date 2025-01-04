// App list functionality
const AppList = {
    init() {
        this.setupEventListeners();
        this.setupSearch();
        this.setupClipboard();
    },

    setupEventListeners() {
        // Show credentials modal
        document.querySelectorAll('.show-credentials-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const appId = btn.getAttribute('data-app-id');
                this.showCredentials(e, appId);
            });
        });

        // Regenerate credentials
        document.querySelector('#regenerateCredentials')?.addEventListener('click', (e) => {
            if (confirm('Are you sure you want to regenerate credentials? This will invalidate the current credentials.')) {
                this.regenerateCredentials(e.target.dataset.appId);
            }
        });
    },

    setupSearch() {
        const searchInput = document.querySelector('#appSearch');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            document.querySelectorAll('.app-card').forEach(card => {
                const appName = card.querySelector('.app-name').textContent.toLowerCase();
                card.style.display = appName.includes(searchTerm) ? 'block' : 'none';
            });
        });
    },

    setupClipboard() {
        const clipboard = new ClipboardJS('.copy-btn');
        clipboard.on('success', (e) => {
            const btn = e.trigger;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    },

    async showCredentials(e, appId) {
        const btn = e.target;
        
        // Show loading state
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        btn.disabled = true;

        try {
            const response = await fetch(`/dashboard/apps/${appId}/credentials`);
            const credentials = await response.json();
            
            // Update modal content
            document.querySelector('#credentialsAppName').textContent = credentials.appName;
            document.querySelector('#appIdValue').value = credentials.appId;
            document.querySelector('#apiKeyValue').value = credentials.apiKey;
            document.querySelector('#appSecretValue').value = credentials.appSecret;
            
            // Show modal
            const modal = new bootstrap.Modal(document.querySelector('#credentialsModal'));
            modal.show();
        } catch (error) {
            console.error('Error fetching credentials:', error);
            alert('Failed to load credentials. Please try again.');
        } finally {
            // Reset button state
            btn.innerHTML = '<i class="fas fa-key"></i> Show Credentials';
            btn.disabled = false;
        }
    },

    async regenerateCredentials(appId) {
        try {
            const response = await fetch(`/dashboard/apps/${appId}/regenerate-credentials`, {
                method: 'POST'
            });
            const newCredentials = await response.json();
            
            // Update modal with new credentials
            document.querySelector('#apiKeyValue').value = newCredentials.apiKey;
            document.querySelector('#appSecretValue').value = newCredentials.appSecret;
            
            alert('Credentials regenerated successfully!');
        } catch (error) {
            console.error('Error regenerating credentials:', error);
            alert('Failed to regenerate credentials. Please try again.');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => AppList.init());