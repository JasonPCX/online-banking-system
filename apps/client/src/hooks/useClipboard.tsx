import { useState, useCallback } from 'react';

function useClipboard() {
    const [isCopied, setIsCopied] = useState(false);

    const copy = useCallback((text: string) => {
        if (typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard
                .writeText(text)
                .then(() => setIsCopied(true))
                .catch(() => setIsCopied(false));
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed'; //avoid scrolling to bottom
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                const successful = document.execCommand('copy');
                setIsCopied(successful);
            } catch (err) {
                setIsCopied(false);
            }
            document.body.removeChild(textarea);
        }
    }, []);

    return { isCopied, copy };
}

export default useClipboard;
