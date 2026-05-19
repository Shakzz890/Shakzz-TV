const WORKER_BASE_URL = "https://m3u8interpreter.hmjustine890.workers.dev/";

// Global channels object for the rest of the app (cutie.js) to use
window.channels = {};

// Function to fetch the JSON from your Cloudflare Worker and format it
window.loadDynamicChannels = async function() {
    try {
        // Look how clean this is! We just hit the worker directly. 
        // No query parameters, no exposed M3U links.
        const response = await fetch(WORKER_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch channels. HTTP status: ${response.status}`);
        }
        
        // Your worker already parsed the M3U, so we just grab the JSON array
        const parsedChannels = await response.json();

        // Loop through the array and format it into the object structure cutie.js expects
        parsedChannels.forEach((ch, index) => {
            let type = "hls";
            let keyId = null;
            let key = null;
            let licenseServerUri = null;

            // Determine stream & DRM type based on the JSON provided by your worker
            if (ch.manifestUrl.includes('.mpd')) {
                type = "dash";
                
                // If it's Widevine (the licenseKey is a string URL)
                if (ch.licenseType === "com.widevine.alpha" || (typeof ch.licenseKey === 'string' && ch.licenseKey.startsWith('http'))) {
                    type = "widevine";
                    licenseServerUri = ch.licenseKey;
                } 
                // If it's ClearKey (the licenseKey is an array of objects)
                else if (ch.licenseKey && Array.isArray(ch.licenseKey)) {
                    type = "clearkey";
                    keyId = ch.licenseKey[0].keyId;
                    key = ch.licenseKey[0].key;
                }
            } else if (ch.manifestUrl.includes('.mp4') || ch.manifestUrl.includes('.mkv')) {
                type = "mp4";
            } else {
                type = "hls"; // default fallback for .m3u8
            }

            // Create a unique key for the object (e.g., "GMA0", "GTV1")
            const channelKey = ch.channelName.replace(/[^a-zA-Z0-9]/g, '') + index;
            
            // Map Groups (split by comma and lowercase)
            const groupList = ch.groupTitle ? ch.groupTitle.split(',').map(g => g.trim().toLowerCase()) : ["live"];

            // Add it to the global channels object
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