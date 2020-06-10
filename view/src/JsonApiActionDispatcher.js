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
export default function JsonApiActionDispatcher(putActionUrl, getStateUrl) {
    const subscribers = new Set();
    let lastState = false;

    if (getStateUrl) {
        fetch(getStateUrl, {headers: {'Accept': 'application/json'}})
            .then(res => res.json())
            .then(nextState => {
                lastState = nextState;
                notifySubscribers(nextState);
            });
    }

    function send(action) {
        const body = JSON.stringify({action});
        const options = {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body
        };

        return fetch(putActionUrl, options)
            .then(res => res.json())
            .then(nextState => {
                //TODO: check for error status
                lastState = nextState;
                notifySubscribers(nextState);
                return nextState;
            })
            .catch(err => {
                console.log('Network Error', err);
            });
    }

    function subscribe(listener) {
        subscribers.add(listener);
        if (lastState)
            notifySubscriber(listener, lastState);
    }

    return {
        send,
        subscribe
    }

    function notifySubscribers(newState) {
        subscribers.forEach(s => notifySubscriber(s, newState));
    }

    function notifySubscriber(subscriber, newState) {
        if (typeof subscriber === 'function')
            subscriber(newState);
        else if (typeof subscriber.update === 'function')
            subscriber.update(newState);
    }
}
