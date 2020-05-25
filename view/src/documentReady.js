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
