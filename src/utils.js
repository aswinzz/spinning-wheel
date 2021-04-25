export const debounce = (callbackFn, delay) => {
    let settimeoutId;

    return function() {
        clearInterval(settimeoutId);

        settimeoutId = setTimeout(() => {
            callbackFn();
        }, delay);
    }
}