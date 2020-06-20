/**
 * Returns a Promise that resolves when the document is ready.
 * Accounts for a document that isn't yet ready or that has
 * already fired its "ready" event.
 */
export default function waitForDocumentReady(document) {
    return new Promise((resolve, reject) => {
        if (document.readyState === 'complete')
            resolve('Document already ready');
        else
            document.addEventListener('readystatechange', event => {
                if (document.readyState === 'complete')
                    resolve('Document became ready');
            });
    });
}
