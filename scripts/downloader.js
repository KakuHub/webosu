// beatmap downloader

function startpreview(box) {
    stoppreview();

    let volume = 1;
    if (window.gamesettings) {
        volume = (window.gamesettings.mastervolume/200) * (window.gamesettings.musicvolume/200);
        volume = Math.min(0.4, Math.max(0, volume));
    }
    let audios = document.getElementsByTagName("audio");
    for (let i=0; i<audios.length; ++i)
        if (audios[i].softstop)
            audios[i].softstop();
    let a = document.createElement("audio");
    a.id = "preview-audio";
    a.dataset.title = box.setdata.title;
    a.dataset.artist = box.setdata.artist;
    let s = document.createElement("source");
    s.src = `https://catboy.best/preview/audio/${box.sid}?set=1`;
    s.type = "audio/mpeg";
    a.appendChild(s);
    a.volume = 0;
    a.play();
    document.body.appendChild(a);
    let fadeIn = setInterval(function(){
        if (a.volume < volume)
            a.volume = Math.min(volume, a.volume + 0.05*volume);
        else
            clearInterval(fadeIn);
    }, 30);
    // Auto fadeout AFTER 9.3s
    let fadeOutStarted = false;
    let fadeOut = setInterval(function() {
        if (!fadeOutStarted && a.currentTime > 9.3) {
            fadeOutStarted = true;
        }
        if (fadeOutStarted) {
            a.volume = Math.max(0, a.volume - 0.05 * volume);
            if (a.volume === 0) {
                clearInterval(fadeOut);
                a.remove();
            }
        }
    }, 30);
    a.softstop = function() {
        let fadeOut = setInterval(function(){
            a.volume = Math.max(0, a.volume - 0.05*volume);
            if (a.volume == 0) {
                clearInterval(fadeOut);
                a.remove();
            }
        }, 10);
    }
}

function stoppreview() {
    let preview = document.getElementById("preview-audio");
    if (preview) {
        // Run its fade-out if available
        if (preview.softstop) {
            preview.softstop();
        } else {
            // fallback: just remove
            preview.pause();
            preview.remove();
        }
    }
}

function log_to_server(message) {
    let url = "https://api.kaku.moe/log/?msg=" + message;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
}

function startdownload(box) {
    startpreview(box);
	if (box.downloading) {
		return;
	}
	let url = "https://rina.place/d/" + box.sid + "n";
	box.downloading = true;
    box.classList.add("downloading");
    let xhr = new XMLHttpRequest();
    xhr.responseType = "arraybuffer";
    xhr.open("GET", url);
    // create download progress bar
    let container = document.createElement("div");
    let title = document.createElement("div");
    let bar = document.createElement("progress");
    container.className = "download-progress";
    title.className = "title";
    title.innerText = box.setdata.title;
    container.appendChild(title);
    container.appendChild(bar);
    // insert so that download list from recent to old
    let statuslines = document.getElementById("statuslines");
    statuslines.insertBefore(container, statuslines.children[3]);
    bar.max = 1;
    bar.value = 0;
    // async part
    xhr.onload = function () {
        box.oszblob = new Blob([xhr.response]);
        bar.className = "finished";
        box.classList.remove("downloading");
    };
    xhr.onprogress = function (e) {
		bar.value = e.loaded / e.total;
    }
    xhr.onerror = function () {
    	console.error("download failed");
        alert("Beatmap download failed. Please retry later.")
		box.downloading = false;
        box.classList.remove("downloading");
        log_to_server("fail " + box.sid);
    }
    xhr.send();
}
