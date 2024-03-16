document.addEventListener('DOMContentLoaded', function () {
    const timerDisplay = document.getElementById('timer');
    let totalTime = 0;

    chrome.runtime.onMessage.addListener(function (message) {
        if (message.totalTime !== undefined) {
            totalTime = message.totalTime;
            updateTimerDisplay(totalTime);
        }
    });

    function updateTimerDisplay(time) {
        const minutes = Math.floor(time / 60000);
        const seconds = ((time % 60000) / 1000).toFixed(0).padStart(2, '0');
        timerDisplay.textContent = `${minutes}:${seconds}`;
    }
});
