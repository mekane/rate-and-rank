import DataGrid from '../../src/DataGrid';

/**
 * This module is used to send grid actions to a local in-memory DataGrid.
 *
 * The send() method returns a promise that will resolve to the new state.
 *
 * Returns an object that can send actions to the grid and will accept subscribers
 * to be notified when the action completes. These subscribers are intended to be
 * functions which will be passed the current state after the action complete. If
 * you pass an object with a function property named 'update' that will be called.
 */
export default function InMemoryDataGridActionDispatcher(config, rows) {
    const subscribers = new Set();
    const grid = DataGrid(config, rows);

    function send(action) {
        grid.send(action);
        const nextState = grid.getState();
        notifySubscribers(nextState);
        return Promise.resolve(nextState);
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
