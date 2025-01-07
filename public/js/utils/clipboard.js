window.ClipboardUtils = {
    init(selector, onSuccess, onError) {
        if (typeof ClipboardJS === 'undefined') {
            console.error('ClipboardJS library not loaded');
            return null;
        }

        const clipboard = new ClipboardJS(selector);
        
        clipboard.on('success', (e) => {
            if (onSuccess) onSuccess(e);
            e.clearSelection();
        });

        clipboard.on('error', (e) => {
            if (onError) onError(e);
        });

        return clipboard;
    },

    showFeedback(button, success) {
        const originalHtml = button.innerHTML;
        const feedbackIcon = success ? 'fa-check' : 'fa-times';
        const feedbackText = success ? 'Copied!' : 'Failed!';
        
        button.innerHTML = `<i class="fas ${feedbackIcon}"></i> ${feedbackText}`;
        button.classList.toggle('copied', success);
        
        setTimeout(() => {
            button.innerHTML = originalHtml;
            button.classList.remove('copied');
        }, 2000);
    }
};