export const trackEvent = (eventName, eventParams = {}) => {
    if(typeof window.gtag !== 'function') {
        console.warn("Goggle Analytics not loaded yet");
        return;
    }

    window.gtag('event', eventName, eventParams);
    console.log(`Event sent: ${eventName}`, eventParams)

}
