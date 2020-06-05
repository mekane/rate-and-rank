/**
 * This module is used to send grid actions to a JSON API to a remote DataGrid and
 * get state back as a JSON object. This is intended to be used in a browser environment
 * where fetch() is available.
 *
 * Initialized with the URL to send actions to, including the gridId.
 *
 * The send() method returns a promise that will resolve to the new state.
 *
 * Returns an object that can send actions to that URL and will accept subscribers
 * to be notified when the action completes. These subscribers are intended to be
 * functions which will be passed the current state after the action complete. If
 * you pass an object with a function property named 'update' that will be called.
 */
function JsonApiActionDispatcher(url) {
    const subscribers = new Set();

    function send(action) {
        const body = JSON.stringify({action});

        console.log('send ' + body);
        const options = {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body
        };

        return fetch(url, options)
            .then(res => res.json())
            .then(result => {
                //TODO: check for error status
                notifySubscribers(result);
                return result;
            })
            .catch(err => {
                console.log('Network Error', err);
            });
    }

    function subscribe(listener) {
        subscribers.add(listener);
    }

    return {
        send,
        subscribe
    }

    function notifySubscribers(newState) {
        subscribers.forEach(s => {
            if (typeof s === 'function')
                s(newState);
            else if (typeof s.update === 'function')
                s.update(newState);
        });
    }
}

export default JsonApiActionDispatcher;
