document.addEventListener('DOMContentLoaded', function () {
    const player = document.querySelector('.player');
    const audio = player.querySelector('audio');
    const playButton = player.querySelector('.player-play-btn');
    const playIcon = player.querySelector('.player-icon-play');
    const pauseIcon = player.querySelector('.player-icon-pause');
    const currentTimeDisplay = player.querySelector('.player-time-current');
    const durationTimeDisplay = player.querySelector('.player-time-duration'); // Remaining time
    const progressBar = player.querySelector('#player-progress-filled');

    let isSeeking = false;

    playButton.addEventListener('click', () => {
        const isPlaying = playButton.getAttribute('data-playing') === 'true';
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    });

    audio.addEventListener('play', () => {
        playButton.setAttribute('data-playing', 'true');
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    });

    audio.addEventListener('pause', () => {
        playButton.setAttribute('data-playing', 'false');
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    });

    audio.addEventListener('loadedmetadata', () => {
        durationTimeDisplay.textContent = `-${formatTime(audio.duration)}`; // Show remaining time
        progressBar.max = Math.floor(audio.duration); // Set progress bar max to audio duration
    });

    audio.addEventListener('timeupdate', () => {
        if (!isSeeking) {
            const currentTime = audio.currentTime;
            const remainingTime = audio.duration - currentTime; // Calculate remaining time
            progressBar.value = currentTime;
            currentTimeDisplay.textContent = formatTime(currentTime); // Elapsed time
            durationTimeDisplay.textContent = `-${formatTime(remainingTime)}`; // Countdown remaining time
        }
    });

    progressBar.addEventListener('input', (e) => {
        const seekTime = e.target.value;
        currentTimeDisplay.textContent = formatTime(seekTime); // Update time as user drags
    });

    progressBar.addEventListener('mousedown', () => {
        isSeeking = true; // Start seeking
    });

    progressBar.addEventListener('mouseup', (e) => {
        const seekTime = e.target.value;
        audio.currentTime = seekTime; // Set new time in audio
        isSeeking = false; // End seeking
    });

    // Format time in MM:SS
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }
});
