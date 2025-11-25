(function() {
    // Initialization: Read configuration from the script tag
    const scriptTag = document.currentScript;
    const projectId = scriptTag.getAttribute('data-project-id');
    const apiUrl = scriptTag.getAttribute('data-api-url') || 'https://api.verdyct.app';

    if (!projectId) {
        console.warn('Verdyct Pixel: No project ID found. Tracking disabled.');
        return;
    }

    console.log(`Verdyct Pixel initialized for project: ${projectId} at ${apiUrl}`);

    // Helper to send data
    function sendEvent(eventData) {
        const payload = {
            project_id: projectId,
            timestamp: new Date().toISOString(),
            page_url: window.location.href,
            ...eventData
        };

        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        const endpoint = `${apiUrl}/api/track`;
        
        // Use sendBeacon if available for reliability
        if (navigator.sendBeacon) {
            navigator.sendBeacon(endpoint, blob);
        } else {
            // Fallback for older browsers
            fetch(endpoint, {
                method: 'POST',
                body: blob,
                keepalive: true
            }).catch(err => console.error('Verdyct Pixel Error:', err));
        }
    }

    // Event Delegation: Listen for clicks on the document
    document.addEventListener('click', function(event) {
        // Filter: Only capture clicks on interactive elements or their children
        const target = event.target.closest('button, a, input[type="submit"]');

        if (target) {
            const elementText = (target.innerText || target.value || '').substring(0, 50);
            const elementId = target.id || '';
            const elementClass = target.className || '';

            sendEvent({
                element_id: elementId,
                element_text: elementText,
                element_class: elementClass,
                tag_name: target.tagName
            });
        }
    });
})();
