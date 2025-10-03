const presence = new Presence({
  clientId: '1423239122801262655',
})

const browsingTimestamp = Math.floor(Date.now() / 1000);

let listeningPreview = false;

presence.on('UpdateData', () => {
    const presenceData: PresenceData = {
        largeImageKey: 'https://kaku.moe/icons/logo.png',
        startTimestamp: browsingTimestamp,
    };

    const gameArea = document.querySelector('#game-area') as HTMLElement;
    const pauseMenu = document.querySelector('#pause-menu') as HTMLElement;

    // 1️⃣ Playing the game
   if (gameArea && !gameArea.hidden) {
        if (pauseMenu && !pauseMenu.hidden) {
            // Look for a hidden "game audio" element with metadata
            const gameAudio = Array.from(document.getElementsByTagName('audio')).find(a =>
                a.dataset.title && !a.currentSrc.includes('/preview/audio/')
            );
            
            presenceData.details = 'Paused menu';

            if (gameAudio) {
                const artist = gameAudio.dataset.artist || 'Unknown Artist';
                const title = gameAudio.dataset.title || 'Unknown Song';
                const diff = gameAudio.dataset.diff || '';
                presenceData.state = diff ? `${artist} - ${title} [${diff}]` : `${artist} - ${title}`;
            } else {
                presenceData.state = '';
            }
        } else {
            // Look for a hidden "game audio" element with metadata
            const gameAudio = Array.from(document.getElementsByTagName('audio')).find(a =>
                a.dataset.title && !a.currentSrc.includes('/preview/audio/')
            );

            presenceData.details = 'Clicking circles';

            if (gameAudio) {
                const artist = gameAudio.dataset.artist || 'Unknown Artist';
                const title = gameAudio.dataset.title || 'Unknown Song';
                const diff = gameAudio.dataset.diff || '';
                presenceData.state = diff ? `${artist} - ${title} [${diff}]` : `${artist} - ${title}`;
            } else {
                presenceData.state = '';
            }
        }
    } else {
        // 2️⃣ Beatmap preview detection
        const audios = Array.from(document.getElementsByTagName('audio'));
        const previewAudio = audios.find(
            a => a.currentSrc.includes('/preview/audio/') && a.volume > 0
        );

        listeningPreview = !!previewAudio;

                if (listeningPreview && previewAudio) {
            const artist = previewAudio.dataset.artist || 'Unknown Artist';
            const title = previewAudio.dataset.title || 'Unknown Song';
            presenceData.details = 'Listening to beatmap preview';
            presenceData.state = `${artist} - ${title}`;
        }  else {
            // 3️⃣ Normal page browsing
            const path = document.location.pathname;

            if (path === '/' || path.startsWith('/index')) {
                presenceData.details = 'Viewing the homepage';
            } else if (path.startsWith('/new')) {
                presenceData.details = 'Viewing new beatmaps';
            } else if (path.startsWith('/hot')) {
                presenceData.details = 'Viewing hot beatmaps';
            } else if (path.startsWith('/listing')) {
                presenceData.details = 'Searching by categories';
            } else if (path.startsWith('/search')) {
                presenceData.details = 'Searching for beatmaps';
            } else if (path.startsWith('/favorites')) {
                presenceData.details = 'Viewing my favourites';
            } else if (path.startsWith('/history')) {
                presenceData.details = 'Viewing playing history';
            } else if (path.startsWith('/faq')) {
                presenceData.details = 'Viewing FAQ';
            } else if (path.startsWith('/settings')) {
                presenceData.details = 'Viewing settings';
            } else {
                presenceData.details = 'Browsing...';
            }

            presenceData.state = '';
        }
    }

    // Apply presence
    if (presenceData.details) presence.setActivity(presenceData);
    else presence.setActivity();
});