const WORKER_BASE_URL = "https://m3u8interpreter.hmjustine890.workers.dev/";
window.channels = {};

window.loadDynamicChannels = async function() {
    try {
        const response = await fetch(WORKER_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch channels. HTTP status: ${response.status}`);
        }

        const parsedChannels = await response.json();
        parsedChannels.forEach((ch, index) => {
            let type = "hls";
            let keyId = null;
            let key = null;
            let licenseServerUri = null;
            if (ch.manifestUrl.includes('.mpd')) {
                type = "dash";
                if (ch.licenseType === "com.widevine.alpha" || (typeof ch.licenseKey === 'string' && ch.licenseKey.startsWith('http'))) {
                    type = "widevine";
                    licenseServerUri = ch.licenseKey;
                } 
                else if (ch.licenseKey && Array.isArray(ch.licenseKey)) {
                    type = "clearkey";
                    keyId = ch.licenseKey[0].keyId;
                    key = ch.licenseKey[0].key;
                }
            } else if (ch.manifestUrl.includes('.mp4') || ch.manifestUrl.includes('.mkv')) {
                type = "mp4";
            } else {
                type = "hls";
            }
            const channelKey = ch.channelName.replace(/[^a-zA-Z0-9]/g, '') + index;
            const groupList = ch.groupTitle ? ch.groupTitle.split(',').map(g => g.trim().toLowerCase()) : ["live"];
            window.channels[channelKey] = {
                name: ch.channelName,
                type: type,
                manifestUri: ch.manifestUrl,
                keyId: keyId,
                key: key,
                licenseServerUri: licenseServerUri,
                logo: ch.tvgLogo || "default-logo.png",
                group: groupList
            };
        });

        console.log("✅ Channels successfully loaded and formatted from Worker");

    } catch (error) {
        console.error("❌ Failed to load channels:", error);
        throw error;
    }
};