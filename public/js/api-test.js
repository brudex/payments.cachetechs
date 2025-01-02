// API test page functionality
const ApiTest = {
    init() {
        this.setupHighlightJs();
        this.setupClipboard();
        this.setupTabSwitching();
        this.setupErrorHandling();
    },

    setupHighlightJs() {
        if (typeof hljs === 'undefined') {
            console.error('highlight.js not loaded');
            return;
        }

        // Initialize highlight.js
        document.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    },

    setupClipboard() {
        if (typeof ClipboardJS === 'undefined') {
            console.error('ClipboardJS not loaded');
            return;
        }

        const clipboard = new ClipboardJS('.copy-button');
        
        clipboard.on('success', (e) => {
            this.showCopyFeedback(e.trigger, true);
            e.clearSelection();
        });

        clipboard.on('error', (e) => {
            this.showCopyFeedback(e.trigger, false);
        });
    },

    showCopyFeedback(button, success) {
        const originalHtml = button.innerHTML;
        const feedbackIcon = success ? 'fa-check' : 'fa-times';
        const feedbackText = success ? 'Copied!' : 'Failed!';
        
        button.innerHTML = `<i class="fas ${feedbackIcon}"></i> ${feedbackText}`;
        button.classList.toggle('copied', success);
        
        setTimeout(() => {
            button.innerHTML = originalHtml;
            button.classList.remove('copied');
        }, 2000);
    },

    setupTabSwitching() {
        document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', (e) => {
                const codeBlock = document.querySelector(`${e.target.getAttribute('href')} code`);
                if (codeBlock) {
                    hljs.highlightElement(codeBlock);
                }
            });
        });
    },

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error caught:', {
                message: event.error?.message,
                stack: event.error?.stack
            });
            event.preventDefault();
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => ApiTest.init());