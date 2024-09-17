document.addEventListener('DOMContentLoaded', function () {
    const player = document.querySelector('.player');
    const audio = player.querySelector('audio');
    const playButton = player.querySelector('.player-play-btn');
    const playIcon = player.querySelector('.player-icon-play');
    const pauseIcon = player.querySelector('.player-icon-pause');
    const currentTimeDisplay = player.querySelector('.player-time-current');
    const durationTimeDisplay = player.querySelector('.player-time-duration'); // Remaining time
    const progressBar = player.querySelector('.player-progress-filled'); // Changed to class selector

    let isSeeking = false;

    // Play/Pause button functionality
    playButton.addEventListener('click', () => {
        const isPlaying = playButton.getAttribute('data-playing') === 'true';
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    });

    // When the audio starts playing
    audio.addEventListener('play', () => {
        playButton.setAttribute('data-playing', 'true');
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    });

    // When the audio is paused
    audio.addEventListener('pause', () => {
        playButton.setAttribute('data-playing', 'false');
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    });

    // Once the audio metadata is loaded
    audio.addEventListener('loadedmetadata', () => {
        durationTimeDisplay.textContent = `-${formatTime(audio.duration)}`; // Show remaining time
        progressBar.max = Math.floor(audio.duration); // Set progress bar max to audio duration
    });

    // Update the progress bar and time display as the audio plays
    audio.addEventListener('timeupdate', () => {
        if (!isSeeking) {
            const currentTime = audio.currentTime;
            const remainingTime = audio.duration - currentTime; // Calculate remaining time
            progressBar.value = currentTime;
            currentTimeDisplay.textContent = formatTime(currentTime); // Elapsed time
            durationTimeDisplay.textContent = `-${formatTime(remainingTime)}`; // Countdown remaining time
        }
    });

    // User is seeking (dragging the progress bar)
    progressBar.addEventListener('input', (e) => {
        const seekTime = e.target.value;
        currentTimeDisplay.textContent = formatTime(seekTime); // Update time as user drags
    });

    // Start seeking when the mouse is down on the progress bar
    progressBar.addEventListener('mousedown', () => {
        isSeeking = true; // Start seeking
    });

    // Seek the audio to the new position when the mouse is released
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
