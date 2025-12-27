/* Add this to your style definitions */
const performanceStyles = document.createElement('style');
performanceStyles.textContent = `
    /* Disable heavy blurs on low-power devices */
    @media (prefers-reduced-motion: reduce), (max-width: 768px) {
        .mm-lightbox-btn, .mm-reaction-popover, .glass-effect {
            backdrop-filter: none !important;
            background: rgba(0,0,0,0.9) !important; /* Solid fallback */
            box-shadow: none !important;
        }
        
        /* Remove fancy animations */
        .now-playing-animate, .scroll-reveal {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
        }
    }
    
    /* Hardware acceleration for scrolling */
    .scrollable-list, #mm-messages-container {
        will-change: transform; 
        -webkit-overflow-scrolling: touch;
    }
`;
document.head.appendChild(performanceStyles);

// ==========================================
// 1. FIREBASE CONFIGURATION
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyBG_54h3xkGoGwfX_3kFLRUciTdEkmkrvA",
    authDomain: "shakzztv-de597.firebaseapp.com",
    databaseURL: "https://shakzztv-de597-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "shakzztv-de597",
    storageBucket: "shakzztv-de597.firebasestorage.app",
    messagingSenderId: "841207969238",
    appId: "1:841207969238:web:4f173cc794f99494c5e077",
    measurementId: "G-FZQTKE7STD"
};

// Initialize Firebase
try {
    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        console.log("🔥 Firebase Connected!");
    } else {
        console.warn("⚠️ Firebase SDK not loaded. Chat will be offline.");
    }
} catch (e) {
    console.error("Firebase Init Error:", e);
}

// ==========================================
// 2. LOADER & GLOBAL STYLES
// ==========================================
const cutieStyles = document.createElement('style');
cutieStyles.textContent = `
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .cutie-loader { position: fixed; inset: 0; background: #000; z-index: 99999; display: flex; align-items: center; justify-content: center; color: white; font-family: Arial, sans-serif; }
    .cutie-loader-content { text-align: center; }
    .cutie-spinner { width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px; }
    .cutie-retry-btn { padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-top: 10px; }
    .cutie-error-msg { color: #ef4444; padding: 20px; text-align: center; }
    .cutie-hide { display: none !important; }
`;
document.head.appendChild(cutieStyles);

const CutieLoader = {
    show: (msg = "Loading channels...") => {
        let loader = document.getElementById('cutieGlobalLoader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'cutieGlobalLoader';
            loader.className = 'cutie-loader';
            loader.innerHTML = `
                <div class="cutie-loader-content">
                    <div class="cutie-spinner"></div>
                    <p id="loaderMessage">${msg}</p>
                    <button id="cutieRetryBtn" class="cutie-retry-btn cutie-hide">Retry</button>
                </div>
            `;
            document.body.appendChild(loader);
        }
        const msgEl = document.getElementById('loaderMessage');
        if (msgEl) msgEl.textContent = msg;
        return loader;
    },
    hide: () => {
        const loader = document.getElementById('cutieGlobalLoader');
        if (loader) loader.remove();
    },
    error: (msg) => {
        CutieLoader.show(`Error: ${msg}`);
        const spinner = document.querySelector('.cutie-spinner');
        if (spinner) spinner.style.display = 'none';
        const retry = document.getElementById('cutieRetryBtn');
        if (retry) {
            retry.onclick = () => location.reload();
            retry.classList.remove('cutie-hide');
        }
    }
};

// ==========================================
// 3. PLAYER & CHANNEL LOGIC
// ==========================================
const DEFAULT_CHANNEL_ID = "Kapamilya";
let shownCount = 0;
let currentSearchFilter = "";
let currentChannelKey = "";
let deferredPrompt;

const tabs = ["all", "favorites", "news", "entertainment", "movies", "sports", "documentary", "cartoons & animations", "anime tagalog dubbed"];

let currentTabIndex = 0;
let sortedChannels = [];
let focusedElement = null;
let viewerInterval = null;
let notificationInterval = null;
let maintenanceInterval = null;

function validateRequirements() {
    const errors = [];
    if (typeof channels === 'undefined') errors.push("Channels data not loaded");
    else if (!channels || Object.keys(channels).length === 0) errors.push("Channels object is empty");
    if (!document.getElementById('channelList')) errors.push("#channelList missing");
    if (!document.getElementById('video')) errors.push("#video missing");
    return errors;
}

function setupMaintenanceMode() {
    const CHECK_INTERVAL = 30000; 
    let isUnderMaintenance = false;
    return new Promise((resolve) => {
        async function checkStatus() {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            try {
                const response = await fetch(`config.json?t=${Date.now()}`, {
                    cache: "no-store",
                    signal: controller.signal,
                    headers: { 'Cache-Control': 'no-cache' }
                });
                clearTimeout(timeoutId);
                if (!response.ok) { resolve(); return; }
                const config = await response.json();
                const overlay = document.getElementById('maintenanceOverlay');
                const msgEl = document.getElementById('maintenanceMessage');
                if (config.maintenanceMode === true) {
                    if (msgEl) msgEl.textContent = config.message;
                    if (!isUnderMaintenance) {
                        isUnderMaintenance = true;
                        window.stop();
                        if (window.jwplayer) { try { jwplayer().stop(); jwplayer().remove(); } catch (e) {} }
                        if (viewerInterval) clearInterval(viewerInterval);
                        if (notificationInterval) clearInterval(notificationInterval);
                        ['.page-header', '#liveNotificationBanner', '#main-content-area', '#about-us', '#updates', '#privacy-policy', '#contact', '#welcomeModal', '#qrModal', '#categoryModal', '#backToTopBtn'].forEach(sel => {
                            const el = document.querySelector(sel);
                            if (el) el.style.display = 'none';
                        });
                        if (overlay) {
                            overlay.classList.add('active');
                            document.body.style.overflow = 'hidden';
                        }
                    }
                } else if (isUnderMaintenance) {
                    location.reload();
                }
            } catch (error) {}
            resolve();
        }
        checkStatus().then(resolve);
        maintenanceInterval = setInterval(checkStatus, CHECK_INTERVAL);
    });
}

function setupScrollReveal() {
    if (document.getElementById('maintenanceOverlay')?.classList.contains('active')) return;
    const elements = document.querySelectorAll('.scroll-reveal');
    if (elements.length === 0) return;
    setTimeout(() => { document.body.classList.add('animations-ready'); }, 500);
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.classList.remove('reveal-init');
            }
        });
    }, { root: null, threshold: 0.15 });
    elements.forEach(el => observer.observe(el));
}

function resetChannelListScroll() {
    const scrollableListContainer = document.querySelector(".scrollable-list");
    if (scrollableListContainer) scrollableListContainer.scrollTop = 0;
}

function getOrCreateDeviceId() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = window.crypto?.randomUUID?.() || 'xxxxxxxx'.replace(/[xy]/g, c => (Math.random() * 16 | 0).toString(16));
        localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
}

function removeSkeletonLoader() {
    const skeletonElements = document.querySelectorAll('.skeleton-effect');
    skeletonElements.forEach(el => {
        el.classList.add('skeleton-fade-out');
        el.classList.remove('skeleton-effect');
        setTimeout(() => { el.classList.remove('skeleton-fade-out'); }, 500);
    });
}

async function updateViewerCount() {
    if (document.getElementById('maintenanceOverlay')?.classList.contains('active')) return;

    const controller = new AbortController();
    setTimeout(() => controller.abort(), 8000);

    try {
        const deviceId = getOrCreateDeviceId();
        const res = await fetch(`/api/viewers?deviceId=${deviceId}`, { signal: controller.signal });
        if (!res.ok) {
            throw new Error(`Server returned ${res.status}`);
        }

        const data = await res.json();
        const viewerCountEl = document.getElementById('viewerCountText');
        if (viewerCountEl) viewerCountEl.innerText = data.count || 0;

    } catch (e) {
        console.warn("Viewer Count Error:", e); 
    }
}


function loadFavoritesFromStorage() {
    try {
        const stored = JSON.parse(localStorage.getItem("favoriteChannels") || "[]");
        if (typeof channels !== 'undefined') {
            Object.entries(channels).forEach(([key, channel]) => {
                channel.favorite = stored.includes(key);
            });
        }
    } catch (e) {}
}

function saveFavoritesToStorage() {
    if (typeof channels === 'undefined') return;
    try {
        const favorites = Object.entries(channels).filter(([key, ch]) => ch.favorite).map(([key]) => key);
        localStorage.setItem("favoriteChannels", JSON.stringify(favorites));
    } catch (e) {}
}

function clearAllFavorites() {
    if (typeof channels !== 'undefined') Object.values(channels).forEach(ch => ch.favorite = false);
    localStorage.removeItem("favoriteChannels");
    renderChannelButtons(currentSearchFilter);
}

// === CHANNEL RENDERER (INCL. ANIME SELECTOR LOGIC) ===
function renderChannelButtons(filter = "") {
    currentSearchFilter = filter;
    const list = document.getElementById("channelList");
    const animeContainer = document.getElementById("animeSeriesContainer");
    const animeSelect = document.getElementById("animeSeriesSelect");

    if (!list) { CutieLoader.error("Channel list element missing"); return; }
    setTimeout(removeSkeletonLoader, 800);

    if (typeof channels === 'undefined') {
        list.innerHTML = `<div class="cutie-error-msg">Error: channels data not loaded.</div>`;
        return;
    }

    const selectedGroup = tabs[currentTabIndex];

    // --- ANIME LOGIC START ---
    if (selectedGroup === "anime tagalog dubbed" && filter === "") {
        if (animeContainer) animeContainer.style.display = "block";
        list.innerHTML = ""; 

        if (typeof animeData !== 'undefined' && animeSelect && animeSelect.options.length <= 1) {
             animeSelect.innerHTML = '<option value="" disabled selected>Select Anime Title</option>';
             Object.keys(animeData).forEach(title => {
                let option = document.createElement('option');
                option.value = title;
                option.textContent = title;
                animeSelect.appendChild(option);
            });

            animeSelect.onchange = function() {
                const selectedTitle = this.value;
                const episodes = animeData[selectedTitle];
                renderAnimeEpisodes(episodes);
            };
        } else if (typeof animeData === 'undefined') {
            list.innerHTML = `<div class="cutie-error-msg">Anime data not found in channels.js</div>`;
            return;
        }
        
        const countDisplay = document.getElementById("channelCountText");
        if (countDisplay) countDisplay.textContent = `Select a title above`;

        return; 
    } else {
        if (animeContainer) animeContainer.style.display = "none";
    }
    // --- ANIME LOGIC END ---

    if (sortedChannels.length === 0) {
        list.innerHTML = `<div class="cutie-error-msg">No channels available.</div>`;
        return;
    }

    list.innerHTML = "";
    shownCount = 0;
    
    const fragment = document.createDocumentFragment();
    sortedChannels.forEach(([key, channel]) => {
        const group = channel.group || "live";
        const matchesSearch = channel.name.toLowerCase().includes(filter.toLowerCase());
        const matchesFavorites = (selectedGroup === "favorites") ? channel.favorite === true : true;
        const matchesGroup = selectedGroup === "all" || selectedGroup === "favorites" || (Array.isArray(group) ? group.includes(selectedGroup) : group === selectedGroup);

        if (!matchesSearch || !matchesGroup || !matchesFavorites) return;

        const btn = document.createElement("button");
        const isActive = (key === currentChannelKey);
        btn.className = isActive ? "channel-button focusable-element active" : "channel-button focusable-element";
        btn.setAttribute("data-key", key);

        const logo = document.createElement("img");
        logo.src = channel.logo;
        logo.className = "channel-logo";
        logo.loading = "lazy";
        logo.onerror = function() {
            this.style.backgroundColor = '#333';
            this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0yMSA5djEwYTIgMiAwIDAgMS0yIDJNMTEgMTVhNSA1IDAgMSAwLTEwIDAgNSA1IDAgMCAwIDEwIDBtNSAyTDcgMTIiL3N2Zz4=';
        };

        const nameSpan = document.createElement("span");
        nameSpan.className = "channel-name";
        nameSpan.textContent = channel.name;

        const favStar = document.createElement("span");
        favStar.className = "favorite-star";
        favStar.innerHTML = channel.favorite ? "⭐" : "☆";
        favStar.onclick = (e) => {
            e.stopPropagation();
            channel.favorite = !channel.favorite;
            favStar.innerHTML = channel.favorite ? "⭐" : "☆";
            saveFavoritesToStorage();
            renderChannelButtons(currentSearchFilter);
        };

        btn.appendChild(logo);
        btn.appendChild(nameSpan);
        btn.appendChild(favStar);

        btn.onclick = () => loadChannel(key);
        fragment.appendChild(btn);
        shownCount++;
    });

    list.appendChild(fragment);

    const countDisplay = document.getElementById("channelCountText");
    if (countDisplay) countDisplay.textContent = `${shownCount} channel${shownCount !== 1 ? "s" : ""} found`;

    const clearBtnEls = document.querySelectorAll('#clearFavoritesBtn');
    clearBtnEls.forEach(btn => {
        if (btn) btn.style.display = (selectedGroup === "favorites" && shownCount > 0) ? "block" : "none";
    });
}

// === ANIME RENDERER (FIXED MP4 SUPPORT) ===
function renderAnimeEpisodes(episodes) {
    const list = document.getElementById("channelList");
    list.innerHTML = "";
    
    if(!episodes) return;

    episodes.forEach((ep, index) => {
        const div = document.createElement('div');
        div.className = 'channel-button focusable-element';
        div.innerHTML = `
            <div class="channel-logo">
                <img src="${ep.logo}" alt="${ep.name}" style="object-fit:cover;">
            </div>
            <div class="channel-name">${ep.name}</div>
        `;
        
        div.onclick = () => {
             // [FIX] Uses the correct manifestUri and type (hls or mp4)
             jwplayer("video").setup({
                autostart: true,
                width: "100%",
                aspectratio: "16:9",
                stretching: "exactfit",
                playlist: [{
                    file: ep.manifestUri, 
                    type: ep.type || "hls" 
                }]
            });
            document.getElementById('nowPlayingChannel').innerText = ep.name;
            
            document.querySelectorAll('.channel-button').forEach(b => b.classList.remove('active'));
            div.classList.add('active');
        };
        
        list.appendChild(div);
    });

    const countDisplay = document.getElementById("channelCountText");
    if (countDisplay) countDisplay.textContent = `${episodes.length} episodes`;
}

async function loadChannel(key) {
    if (typeof channels === "undefined") return;
    const channel = channels[key];
    if (!channel) return;

    currentChannelKey = key;
    localStorage.setItem("lastPlayedChannel", key);

    document.querySelectorAll(".channel-button").forEach(btn => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-key") === key) btn.classList.add("active");
    });

    const nowPlayingEl = document.getElementById("nowPlayingChannel");
    if (nowPlayingEl) {
        nowPlayingEl.textContent = channel.name;
        const overlay = document.getElementById("nowPlayingOverlay");
        if (overlay) {
            overlay.classList.add("now-playing-animate");
            setTimeout(() => overlay.classList.remove("now-playing-animate"), 350);
        }
    }

    // ==========================================
    // 🔥 TOKEN INJECTION LOGIC (ADDED)
    // ==========================================
    const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJTaGFrenoiLCJleHAiOjE3NjY5NTgzNTN9.RSc_LQ11txXXI0d7gZ8GvMOAwoHrWzUUr3CCQCM0Hco";
    
    let finalManifest = channel.manifestUri;
    
    // Check if the URL belongs to the tokenized provider
    if (finalManifest.includes("converse.nathcreqtives.com")) {
        // Check if query params already exist to decide between '?' or '&'
        const separator = finalManifest.includes('?') ? '&' : '?';
        finalManifest = `${finalManifest}${separator}token=${AUTH_TOKEN}`;
    }
    // ==========================================

    let playerType = "hls";
    let drmConfig = undefined;

    if (channel.type === "clearkey") {
        playerType = "dash";
        if (channel.keyId && channel.key) {
            drmConfig = { clearkey: { keyId: channel.keyId, key: channel.key } };
        } else {
            console.error("ClearKey channel missing 'keyId' or 'key'");
        }
    }
    
    if (channel.type === "widevine") {
        playerType = "dash";
        drmConfig = { widevine: { url: channel.licenseServerUri || channel.key } }; // Fallback to channel.key if licenseServerUri is missing
    }
    
    if (channel.type === "hls") playerType = "hls";
    if (channel.type === "mp4") playerType = "mp4";

    try {
        jwplayer("video").setup({
            autostart: true,
            width: "100%",
            aspectratio: "16:9",
            stretching: "exactfit",
            sources: [{
                file: finalManifest, // ✅ Uses the new tokenized URL
                type: playerType,
                drm: drmConfig
            }]
        });
    } catch (e) {
        console.error("JWPlayer setup error:", e);
    }
}


function setupSearch() {
    const searchInput = document.getElementById("search");
    const clearBtn = document.getElementById("clearSearch");
    if (!searchInput || !clearBtn) return;

    searchInput.value = "";
    clearBtn.style.display = "none";

    searchInput.addEventListener("input", () => {
        const val = searchInput.value.trim();
        clearBtn.style.display = val ? "block" : "none";
        renderChannelButtons(val);
        resetChannelListScroll();
    });

    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        clearBtn.style.display = "none";
        renderChannelButtons("");
        resetChannelListScroll();
    });
}

function setupCategoryTabs() {
    const desktop = document.querySelector(".category-bar");
    const mobile = document.getElementById("mobileCategoryList");
    if (!desktop || !mobile) return;

    const render = (container, isMobile) => {
        container.innerHTML = '';
        tabs.forEach((tab, index) => {
            const btn = document.createElement('button');
            const isActive = index === 0;
            btn.className = isMobile ? `mobile-cat-option focusable-element ${isActive ? 'active' : ''}` : `category-button focusable-element ${isActive ? 'active' : ''}`;
            btn.textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
            btn.addEventListener("click", () => {
                currentTabIndex = index;
                document.querySelectorAll('.category-button, .mobile-cat-option').forEach(b => b.classList.remove("active"));
                if (isMobile) {
                    mobile.querySelectorAll('button')[index]?.classList.add('active');
                    desktop.querySelectorAll('button')[index]?.classList.add('active');
                } else {
                    desktop.querySelectorAll('button')[index]?.classList.add('active');
                    mobile.querySelectorAll('button')[index]?.classList.add('active');
                }
                
                renderChannelButtons(currentSearchFilter);
                resetChannelListScroll();

                if (isMobile) {
                    document.getElementById('categoryModal')?.classList.remove('active');
                    const mobileBtnText = document.getElementById('mobileCategoryBtn')?.querySelector('span');
                    if (mobileBtnText) mobileBtnText.textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
                }
            });
            container.appendChild(btn);
        });
    };
    render(desktop, false);
    render(mobile, true);

    const mobBtn = document.getElementById("mobileCategoryBtn");
    if (mobBtn) {
        mobBtn.addEventListener('click', () => {
            document.getElementById('categoryModal')?.classList.add('active');
            setTimeout(() => {
                const first = document.querySelector('#mobileCategoryList .focusable-element');
                if (first) setTvFocus(first);
            }, 100);
        });
        document.getElementById('closeCategoryModal')?.addEventListener('click', () => document.getElementById('categoryModal')?.classList.remove('active'));
    }
}

function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('navPages');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
        const isActive = hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active', isActive);
        document.body.classList.toggle('mobile-menu-active', isActive);

        if (isActive) {
            setTimeout(() => {
                const firstLink = mobileMenu.querySelector('a');
                if (firstLink) setTvFocus(firstLink);
            }, 100);
        } else {
            clearTvFocus();
        }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('mobile-menu-active');
            clearTvFocus();
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault(); 
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

function setupWelcomeModal() {
    // Check if already shown this session
    if (sessionStorage.getItem('welcomeModalShown')) {
        // If welcome is done, immediately trigger the next step (Cookies)
        window.dispatchEvent(new Event('welcomeClosed'));
        return;
    }

    const modal = document.getElementById('welcomeModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const countdownSpan = document.getElementById('modalCountdown');

    if (!modal || !closeBtn || !countdownSpan) return;

    let countdown = 5;
    let countdownInterval;

    const closeModal = () => {
        modal.classList.remove('active');
        clearInterval(countdownInterval);
        sessionStorage.setItem('welcomeModalShown', 'true');
        
        // 🔥 STEP 1 COMPLETE: Tell the app to show Cookies now
        window.dispatchEvent(new Event('welcomeClosed'));
    };

    const startCountdown = () => {
        countdownSpan.textContent = countdown;
        countdownInterval = setInterval(() => {
            countdown--;
            countdownSpan.textContent = countdown;
            if (countdown <= 0) closeModal();
        }, 1000);
    };

    closeBtn.addEventListener('click', closeModal);
    
    // Show Modal
    modal.classList.add('active');
    startCountdown();
    setTimeout(() => { setTvFocus(closeBtn); }, 100);
}


function setupBackToTopButton() {
    const backToTopButton = document.getElementById('backToTopBtn');
    const aboutSection = document.getElementById('about-us');

    if (!backToTopButton || !aboutSection) return;

    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('show', window.scrollY > aboutSection.offsetTop);
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function setupNotificationSystem() {
    const banner = document.getElementById('liveNotificationBanner');
    const msgEl = document.getElementById('notificationMessage');
    const closeBtn = document.getElementById('closeNotificationBtn');
    
    const NOTIFICATION_URL = 'notification.json';
    const SESSION_KEY = 'closedNotifications'; // New key for storing a list of closed IDs
    
    let activeNotificationId = null;
    let cycleIndex = 0; // Keeps track of which message to show next

    if (!banner) return;

    // --- HANDLE CLOSE BUTTON ---
    closeBtn.addEventListener('click', () => {
        banner.classList.remove('show');
        banner.classList.add('hide');
        
        // Add the current ID to the "Ignored" list in session storage
        if (activeNotificationId) {
            let closedList = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "[]");
            if (!closedList.includes(activeNotificationId)) {
                closedList.push(activeNotificationId);
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(closedList));
            }
        }
    });

    // --- FETCH & SHOW LOGIC ---
    async function fetchNotification() {
        // Don't show if Maintenance or Welcome Modal is open
        if (document.getElementById('maintenanceOverlay')?.classList.contains('active') || 
            document.getElementById('welcomeModal')?.classList.contains('active')) return;

        const controller = new AbortController();
        setTimeout(() => controller.abort(), 2000);

        try {
            const response = await fetch(`${NOTIFICATION_URL}?t=${Date.now()}`, { signal: controller.signal });
            if (!response.ok) return;
            
            const data = await response.json();

            // Check if system is enabled and has messages
            if (!data.show || !data.notifications || data.notifications.length === 0) return;

            // 1. Filter out messages the user has already closed
            const closedList = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "[]");
            const validNotifications = data.notifications.filter(n => !closedList.includes(n.id));

            if (validNotifications.length === 0) return;

            // 2. Pick the next message in the cycle
            const currentNotif = validNotifications[cycleIndex % validNotifications.length];
            cycleIndex++; // Increment for next time

            // 3. Update UI
            activeNotificationId = currentNotif.id;
            msgEl.innerHTML = currentNotif.message;
            
            banner.classList.remove('info', 'success', 'alert', 'hide');
            banner.classList.add(currentNotif.type || 'alert');
            banner.style.display = 'flex';
            
            // 4. Show Banner
            setTimeout(() => banner.classList.add('show'), 10);
            
            // 5. Hide Banner after 8 seconds (allows gap before next one)
            setTimeout(() => {
                banner.classList.remove('show');
                banner.classList.add('hide');
            }, 8000);

        } catch (error) {
            // Silent fail is fine for notifications
        }
    }

    // Start delay, then run every 15 seconds (8s show + 7s pause)
    setTimeout(fetchNotification, 2000);
    notificationInterval = setInterval(fetchNotification, 15000);
}


function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-pages a');
    const highlighter = document.querySelector('.nav-highlight');

    if (!highlighter) return;

    const moveHighlight = (link) => {
        highlighter.style.width = `${link.offsetWidth}px`;
        highlighter.style.left = `${link.offsetLeft}px`;
        highlighter.style.opacity = '1';
        navLinks.forEach(l => l.classList.remove('active-link'));
        link.classList.add('active-link');
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-pages a[href="#${id}"]`);
                if (activeLink) moveHighlight(activeLink);
            }
        });
    }, { rootMargin: '-50% 0px -40% 0px' });

    sections.forEach(section => observer.observe(section));
}

function getFocusableElements() {
    const elements = document.querySelectorAll('.focusable-element:not([disabled])');
    return Array.from(elements).filter(el => el.offsetParent !== null);
}


function setTvFocus(el) {
    if (focusedElement) focusedElement.classList.remove('tv-focus');
    focusedElement = el;
    if (focusedElement) {
        focusedElement.classList.add('tv-focus');
        focusedElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
}

function clearTvFocus() {
    if (focusedElement) focusedElement.classList.remove('tv-focus');
    focusedElement = null;
}

function findNextSpatialFocus(direction) {
    const currentEl = focusedElement;
    if (!currentEl) return getFocusableElements()[0];
    const rect1 = currentEl.getBoundingClientRect();
    const candidates = getFocusableElements().filter(el => el !== currentEl);
    let bestCandidate = null;
    let minDistance = Infinity;

    const getCenter = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    const center1 = getCenter(rect1);

    candidates.forEach(cand => {
        const rect2 = cand.getBoundingClientRect();
        const center2 = getCenter(rect2);
        let isValid = false;

        switch (direction) {
            case 'right': isValid = rect2.left >= center1.x; break;
            case 'left': isValid = rect2.right <= center1.x; break;
            case 'down': isValid = rect2.top >= center1.y; break;
            case 'up': isValid = rect2.bottom <= center1.y; break;
        }

        if (isValid) {
            const dx = center2.x - center1.x;
            const dy = center2.y - center1.y;
            const distance = Math.hypot(dx, dy);
            const penalty = (direction === 'up' || direction === 'down') ? Math.abs(dx) * 2 : Math.abs(dy) * 2;
            const score = distance + penalty;
            if (score < minDistance) {
                minDistance = score;
                bestCandidate = cand;
            }
        }
    });
    return bestCandidate;
}

function setupTvRemoteLogic() {
    window.addEventListener('keydown', (e) => {
        const focused = document.activeElement;
        const isInputActive = focused.tagName === 'INPUT' || focused.tagName === 'TEXTAREA';

        // --- 1. BACK / EXIT LOGIC ---
        if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'Back' || e.key === 'Exit') {
            if (e.key === 'Backspace' && isInputActive) return;
            e.preventDefault();
            
            if (document.getElementById('installModal')?.classList.contains('active')) {
                document.getElementById('pwaCancelBtn').click(); return;
            }
            if (document.getElementById('qrModal')?.classList.contains('active')) {
                document.getElementById('closeQrModalBtn').click(); return;
            }
            if (document.getElementById('categoryModal')?.classList.contains('active')) {
                document.getElementById('closeCategoryModal').click(); return;
            }
            if (document.getElementById('navPages')?.classList.contains('active')) {
                document.getElementById('hamburger').click(); return;
            }
            if (document.getElementById('welcomeModal')?.classList.contains('active')) {
                document.getElementById('closeModalBtn').click(); return;
            }
            if (window.scrollY > 0) {
                window.scrollTo({ top: 0, behavior: 'smooth' }); return;
            }
        }

        // --- 2. NAVIGATION LOGIC (Spatial) ---
        let direction = null;
        switch (e.key) {
            case 'ArrowUp': direction = 'up'; break;
            case 'ArrowDown': direction = 'down'; break;
            case 'ArrowLeft': direction = 'left'; break;
            case 'ArrowRight': direction = 'right'; break;
            case 'Enter':
                if (focused) {
                    focused.click();
                    if (focused.tagName === 'INPUT') focused.focus();
                    e.preventDefault();
                }
                return;
        }

        if (direction) {
            e.preventDefault();
            const nextElement = findNextSpatialFocus(direction); 
            if (nextElement) {
                setTvFocus(nextElement);
                nextElement.focus();
            }
        }
    });

    window.addEventListener('load', () => {
        const searchInput = document.getElementById('search');
        if (searchInput) searchInput.focus(); 
    });
}

function setupQrCodeModal() {
    const qrCodeImage = document.querySelector('.donation-qr-code');
    const qrModal = document.getElementById('qrModal');
    const zoomedQrImage = document.getElementById('zoomedQrImage');
    const closeQrModalBtn = document.getElementById('closeQrModalBtn');

    if (!qrCodeImage || !qrModal || !zoomedQrImage || !closeQrModalBtn) return;

    qrCodeImage.addEventListener('click', () => {
        qrModal.classList.add('active');
        zoomedQrImage.src = qrCodeImage.src;
        // Focus for TV remote accessibility
        setTimeout(() => setTvFocus(closeQrModalBtn), 50);
    });

    closeQrModalBtn.addEventListener('click', () => {
        qrModal.classList.remove('active');
        clearTvFocus();
    });
}


// ==========================================
// 4. PWA & COOKIE LOGIC
// ==========================================
function setupPwaInstall() {
    const installModal = document.getElementById('installModal');
    const installBtn = document.getElementById('pwaInstallBtn');
    const cancelBtn = document.getElementById('pwaCancelBtn');
    
    // Track if the cookie step is finished
    let areCookiesResolved = !!localStorage.getItem('shakzzCookieConsent');

    if (!installModal || !installBtn || !cancelBtn) return;

    const showModal = () => {
        // Only show if not previously declined AND Cookies are done
        if (!sessionStorage.getItem('installDeclined') && areCookiesResolved) {
            installModal.classList.add('active');
            setTimeout(() => setTvFocus(installBtn), 100);
        }
    };

    // 1. Browser says "App is installable" (This happens anytime)
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // If cookies are already done, show now. If not, wait.
        if (areCookiesResolved) {
            showModal();
        }
    });

    // 2. LISTENER: Wait for "cookiesResolved" event
    window.addEventListener('cookiesResolved', () => {
        areCookiesResolved = true;
        // If browser already sent the prompt while we were waiting
        if (deferredPrompt) {
            showModal();
        }
    });

    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response: ${outcome}`);
            deferredPrompt = null;
        }
        installModal.classList.remove('active');
    });

    cancelBtn.addEventListener('click', () => {
        installModal.classList.remove('active');
        sessionStorage.setItem('installDeclined', 'true');
        clearTvFocus();
    });
}

function setupCookieConsent() {
    const banner = document.getElementById('cookieBanner');
    const necessaryBtn = document.getElementById('cookieNecessaryBtn');
    const allowBtn = document.getElementById('cookieAllowBtn');
    
    if (!banner || !necessaryBtn || !allowBtn) return;

    // Helper to finish cookies and start PWA
    const finishCookies = (type) => {
        if (type) localStorage.setItem('shakzzCookieConsent', type);
        banner.classList.add('hidden');
        
        // 🔥 STEP 2 COMPLETE: Tell the app to show PWA Install now
        window.dispatchEvent(new Event('cookiesResolved'));
    };

    // Check if already consented
    if (localStorage.getItem('shakzzCookieConsent')) {
        // If already consented, skip UI and go straight to PWA check
        finishCookies(null); 
        return;
    }

    // LISTENER: Only show banner after "welcomeClosed" event fires
    window.addEventListener('welcomeClosed', () => {
        setTimeout(() => {
            banner.classList.remove('hidden');
        }, 500); // Small delay for smooth transition
    });

    necessaryBtn.addEventListener('click', () => finishCookies('necessary'));
    allowBtn.addEventListener('click', () => finishCookies('all'));
}




// --- MAIN INIT ---
document.addEventListener('DOMContentLoaded', async () => {
    if (typeof CutieLoader !== 'undefined') CutieLoader.show("Initializing Shakzz TV...");
    console.log("Cutie.js starting initialization...");

    try {
        const validationErrors = validateRequirements();
        if (validationErrors.length > 0) {
            throw new Error(`Missing requirements: ${validationErrors.join(', ')}`);
        }

        await Promise.race([
            setupMaintenanceMode(),
            new Promise((_, reject) => setTimeout(() => reject('Maintenance check timeout'), 4000))
        ]);
         
        setupPwaInstall();
        setupCookieConsent();
        setupScrollReveal();
        setupSearch();
        setupCategoryTabs();
        setupWelcomeModal();
        setupHamburgerMenu();
        setupBackToTopButton();
        setupQrCodeModal();
        setupNotificationSystem();
        setupScrollSpy();
        setupTvRemoteLogic();

        if (typeof channels !== 'undefined') {
            sortedChannels = Object.entries(channels).sort((a, b) => a[1].name.localeCompare(b[1].name));
            loadFavoritesFromStorage();

            const lastPlayed = localStorage.getItem("lastPlayedChannel");
            if (lastPlayed && channels[lastPlayed]) {
                currentChannelKey = lastPlayed;
            } else if (channels[DEFAULT_CHANNEL_ID]) {
                currentChannelKey = DEFAULT_CHANNEL_ID;
            } else {
                currentChannelKey = sortedChannels[0]?.[0] || "";
            }
        }

        renderChannelButtons();
        resetChannelListScroll();

        if (currentChannelKey) loadChannel(currentChannelKey);

        updateViewerCount();
        viewerInterval = setInterval(updateViewerCount, 30000);

        if (typeof CutieLoader !== 'undefined') CutieLoader.hide();
        console.log("✅ Cutie.js initialization complete");

        // Load Messenger safely
        initMiniMessenger();

    } catch (error) {
        console.error("❌ Cutie.js initialization failed:", error);
        removeSkeletonLoader();
        if (typeof CutieLoader !== 'undefined') CutieLoader.error(error.message || "Failed to load.");
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('✅ ServiceWorker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.log('❌ ServiceWorker registration failed:', error);
            });
    });
}


// ==========================================
// SHAKZZ TV MINI MESSENGER (Final - All Fixes Applied + Messenger Logic)
// ==========================================
function initMiniMessenger() {
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzpqxlMdj4TCrCq3cfTeO8QGFggNBVuQk78ZgDpRjnXNrXpB0JZeM3-rswc4va5zOiI/exec";
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const ADMIN_NICKNAME = "Shakzz";
    const SHAKZZ_ADMIN_AVATAR = "Shakzz.jpg";
    const GEMINI_API_KEY = "AIzaSyC4d_EJzw3glHqUKRt4CYfzHVOAb9d9Cs4";
    const AI_NICKNAME = "Shakzz AI";
    const AI_AVATAR = "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg";

    if (typeof firebase === 'undefined' || !firebase.apps.length) return;

    // --- CRITICAL CSS INJECTION FOR POPOVER VISIBILITY ---
    const styleId = 'mm-popover-styles';
    if (!document.getElementById(styleId)) {
        const styleSheet = document.createElement('style');
        styleSheet.id = styleId;
        styleSheet.type = "text/css";
        styleSheet.innerText = `
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .cutie-loader { position: fixed; inset: 0; background: #000; z-index: 99999; display: flex; align-items: center; justify-content: center; color: white; font-family: Arial, sans-serif; }
            .cutie-loader-content { text-align: center; }
            .cutie-spinner { width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px; }
            .cutie-retry-btn { padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-top: 10px; }
            .cutie-error-msg { color: #ef4444; padding: 20px; text-align: center; }
            .cutie-hide { display: none !important; }
            .mm-reaction-popover {
                position: fixed;
                display: flex;
                background: #27282b;
                border-radius: 50px;
                padding: 5px 10px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                z-index: 2147483647 !important;
                opacity: 0;
                transform: scale(0.5) translateY(20px);
                transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                pointer-events: auto;
            }
            .mm-reaction-popover.show {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
            .mm-reaction-icon {
                font-size: 24px;
                padding: 5px 8px;
                cursor: pointer;
                transition: transform 0.1s;
            }
            .mm-reaction-icon:hover {
                transform: scale(1.2);
            }
            .mm-lightbox-header {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
                display: flex;
                gap: 10px;
            }
            .mm-lightbox-btn {
                background: rgba(0,0,0,0.5);
                border: 1px solid rgba(255,255,255,0.1);
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 18px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(5px);
            }
            .mm-status-seen {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                height: 12px;
            }
            .mm-status-avatar {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                object-fit: cover;
                margin-top: 2px;
                margin-right: 4px;
            }
        `;
        document.head.appendChild(styleSheet);
    }

    // --- NEW: REACTION BADGE CSS FIXES ---
    const reactionBadgeStyle = document.createElement("style");
    reactionBadgeStyle.innerHTML = `
        .mm-reaction-badge {
            position: absolute;
            bottom: -10px;
            right: 0;
            background: #27282b;
            border: 1px solid #3b82f6;
            border-radius: 50px;
            padding: 4px 10px;
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            z-index: 10 !important;
            font-size: 12px;
            pointer-events: auto !important;
            transition: transform 0.2s;
        }
        .mm-reaction-badge:hover {
            transform: scale(1.05);
        }
        .mm-msg-bubble {
            position: relative;
            pointer-events: auto;
        }
        .mm-msg.mm-own .mm-msg-group {
            align-items: flex-end !important;
        }
    `;
    document.head.appendChild(reactionBadgeStyle);

    const auth = firebase.auth();
    const db = firebase.database();
    
    let allUsersCache = [];
    let currentUser = null;
    let cachedUserData = { nickname: "Guest", avatarUrl: "" };
    let oldestLoadedKey = null;
    let isLoadingHistory = false;
    let replyToMsg = null;
    let pendingFile = null;
    let pendingBlobUrl = null;
    let profileFile = null;
    let longPressTimer;
    let isSending = false;

    let camStream = null;
    let camTrack = null;
    let camMode = 'photo';
    let camRecorder = null;
    let camChunks = [];
    let isNightMode = false;
    let isFlashOn = false;
    let capturedBlob = null;

    const els = {
        wrapper: document.getElementById('mini-messenger'),
        fab: document.getElementById('mm-trigger-btn'),
        panel: document.getElementById('mm-panel'),
        chatView: document.getElementById('mm-chat-view'),
        setupView: document.getElementById('mm-setup-view'),
        closeBtns: document.querySelectorAll('.mm-close-btn'),
        nicknameInput: document.getElementById('mm-nickname-input'),
        joinBtn: document.getElementById('mm-join-btn'),
        setupError: document.getElementById('mm-setup-error'),
        setupAvatarCircle: document.querySelector('.mm-icon-circle'),
        headerAvatar: document.querySelector('.mm-header-avatar'),
        
        msgContainer: document.getElementById('mm-messages-container'),
        msgInput: document.getElementById('mm-message-input'),
        sendBtn: document.getElementById('mm-send-btn'),
        footer: document.querySelector('.mm-footer'),
        
        mediaBtn: document.getElementById('mm-media-btn'),
        camBtn: document.getElementById('mm-cam-btn'),
        mediaInput: document.getElementById('mm-media-input'),
        
        replyBar: document.getElementById('mm-reply-bar'),
        replyName: document.getElementById('mm-reply-to-name'),
        replyPrev: document.getElementById('mm-reply-text-preview'),
        cancelReply: document.getElementById('mm-cancel-reply'),
        unreadBadge: document.getElementById('mm-unread-count'),
        
        attBar: document.getElementById('mm-attachment-bar'),
        attImg: document.getElementById('mm-att-img'),
        attVid: document.getElementById('mm-att-vid'),
        attInfo: document.getElementById('mm-att-info'),
        attName: document.getElementById('mm-att-name'),
        removeAtt: document.getElementById('mm-remove-att'),
        
        actionSheet: document.getElementById('mm-action-sheet'),
        sheetDelete: document.getElementById('mm-sheet-delete'),
        reactionView: document.getElementById('mm-reaction-view'),
        closeReactionView: document.getElementById('mm-close-reaction-view'),
        reactionList: document.getElementById('mm-reaction-list'),
        dragOverlay: document.getElementById('mm-drag-overlay'),
        
        cameraLayer: document.getElementById('mm-camera-layer'),
        cameraVideo: document.getElementById('mm-camera-video'),
        cameraCanvas: document.getElementById('mm-camera-canvas'),
        camControlsUI: document.getElementById('mm-cam-controls-ui'),
        camCloseBtn: document.getElementById('cam-close-btn'),
        camShutterBtn: document.getElementById('cam-shutter-btn'),
        camFlashBtn: document.getElementById('cam-flash-btn'),
        camNightBtn: document.getElementById('cam-night-btn'),
        camModePhoto: document.getElementById('cam-mode-photo'),
        camModeVideo: document.getElementById('cam-mode-video'),
        
        previewContainer: document.getElementById('mm-cam-preview-container'),
        previewImg: document.getElementById('mm-preview-img'),
        previewVideo: document.getElementById('mm-preview-video'),
        previewCloseBtn: document.getElementById('mm-preview-close'),
        previewSendBtn: document.getElementById('mm-preview-send'),
        
        lightbox: document.getElementById('mm-lightbox'),
        lightboxContent: document.getElementById('mm-lightbox-content'),
        adminBtnContainer: document.getElementById('mm-admin-btn-container')
    };

    if (els.wrapper && els.wrapper.parentElement !== document.body) {
        document.body.appendChild(els.wrapper);
    }

    async function updateMessageStatus(msgId, newStatus) {
        const currentStatus = (await db.ref(`messages/${msgId}/status`).once('value')).val();
        const statusOrder = { "sending": 0, "sent": 1, "delivered": 1, "seen": 2 };
        if (!currentStatus || statusOrder[newStatus] >= statusOrder[currentStatus]) {
            return db.ref(`messages/${msgId}`).update({ status: newStatus });
        }
    }

    const adminStyleFix = document.createElement("style");
    adminStyleFix.innerHTML = `
        .mm-msg.mm-own .mm-msg-group { align-items: flex-end; }
        @keyframes slideDownFade {
            0% {opacity:0; transform:translate(-50%, -80%);}
            100% {opacity:1; transform:translate(-50%, -50%);}
        }
    `;
    document.head.appendChild(adminStyleFix);

    function showAdminWelcome() {
        const existing = document.getElementById('mm-welcome-modal');
        if(existing) existing.remove();

        const welcomeModal = document.createElement('div');
        welcomeModal.id = 'mm-welcome-modal';
        welcomeModal.style.cssText = `
            position: fixed; top: 15%; left: 50%; transform: translate(-50%, -50%);
            background: #22c55e; color: white; padding: 15px 25px; border-radius: 50px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 2147483647;
            font-weight: bold; font-family: sans-serif; display: flex; align-items: center; gap: 10px;
            animation: slideDownFade 0.5s ease-out forwards; pointer-events: none;
        `;
        welcomeModal.innerHTML = `<i class="fas fa-check-circle"></i> <span>Welcome Admin!</span>`;
        document.body.appendChild(welcomeModal);
        setTimeout(() => welcomeModal.remove(), 3000);
    }

    async function showReports() {
        if (!cachedUserData || !cachedUserData.isAdmin) return;
        const sheet = els.actionSheet;
        sheet.innerHTML = '';
        const content = document.createElement('div');
        content.className = 'mm-sheet-content';
        content.style.cssText = "height: 60vh; background: #1e1e1e; display: flex; flex-direction: column; overflow: hidden; padding-bottom: 20px;";
        content.innerHTML = `
            <div style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center;">
                <span style="color:white; font-weight:bold;">⚠️ User Reports</span>
                <button onclick="window.closeMobileSheet()" style="background:none; border:none; color:#9ca3af; font-size:20px;"><i class="fas fa-times"></i></button>
            </div>
            <div id="mm-report-list" style="flex:1; overflow-y:auto; padding:10px;">
                <div style="text-align:center; color:#6b7280; margin-top:20px;">Loading reports...</div>
            </div>
        `;
        sheet.appendChild(content);
        sheet.classList.remove('hidden');
        sheet.classList.add('show');
        const listEl = content.querySelector('#mm-report-list');
        try {
            const snap = await db.ref('reports').once('value');
            if (!snap.exists()) {
                listEl.innerHTML = `<div style="text-align:center; color:#9ca3af; margin-top:50px;"><i class="fas fa-check-circle" style="font-size:40px; margin-bottom:10px; opacity:0.5;"></i><br>No reports found.</div>`;
                return;
            }
            let html = '';
            snap.forEach(child => {
                const r = child.val();
                const time = new Date(r.timestamp).toLocaleString();
                html += `
                    <div style="background:rgba(255,255,255,0.05); border-radius:8px; padding:10px; margin-bottom:10px; border-left: 3px solid #ef4444;">
                        <div style="font-size:12px; color:#9ca3af; margin-bottom:4px;">${time}</div>
                        <div style="color:white; font-size:14px;">Reported Msg ID: <span style="font-family:monospace; background:rgba(0,0,0,0.3); padding:2px 4px; border-radius:4px;">${r.msgId}</span></div>
                        <div style="color:#ef4444; font-size:12px; margin-top:5px; cursor:pointer;" onclick="window.scrollToRepliedMessage('${r.msgId}'); window.closeMobileSheet();">
                            <i class="fas fa-search"></i> Locate Message
                        </div>
                    </div>`;
            });
            listEl.innerHTML = html;
        } catch (e) {
            listEl.innerHTML = `<div style="color:#ef4444; text-align:center;">Error loading reports.</div>`;
        }
    }

    function injectAdminUI() {
        const headerActions = document.querySelector('.mm-header-actions');
        if (!headerActions) return;
        let adminBtn = document.getElementById('mm-admin-btn-container');
        if (!adminBtn) {
            adminBtn = document.createElement('div');
            adminBtn.id = 'mm-admin-btn-container';
            headerActions.insertBefore(adminBtn, headerActions.firstChild);
        }
        adminBtn.innerHTML = '<i class="fas fa-user-shield"></i>';
        adminBtn.style.cssText = "display:flex; align-items:center; justify-content:center; width:32px; height:32px; margin-right:5px; cursor:pointer; border-radius:50%; color:#94a3b8; transition:0.2s;";
        adminBtn.onclick = handleAdminLogin;
        const isNowAdmin = (cachedUserData && cachedUserData.isAdmin) || (els.nicknameInput && els.nicknameInput.value === ADMIN_NICKNAME);
        let reportBtn = document.getElementById('mm-report-btn');
        if (isNowAdmin) {
            if (!reportBtn) {
                reportBtn = document.createElement('div');
                reportBtn.id = 'mm-report-btn';
                headerActions.insertBefore(reportBtn, adminBtn.nextSibling);
            }
            reportBtn.innerHTML = '<i class="fas fa-folder-open"></i>';
            reportBtn.style.cssText = "display:flex; align-items:center; justify-content:center; width:32px; height:32px; margin-right:5px; cursor:pointer; border-radius:50%; color:#ef4444; transition:0.2s;";
            reportBtn.onclick = showReports;
        } else if (reportBtn) {
            reportBtn.remove();
        }
    }

    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            db.ref(`users/${user.uid}`).on('value', snap => {
                if (snap.exists()) {
                    cachedUserData = snap.val();
                    injectAdminUI();
                    if(cachedUserData.nickname) {
                        if (cachedUserData.isAdmin && els.sheetDelete) {
                            els.sheetDelete.style.display = 'block';
                        }
                        showChat();
                    } else {
                        showSetup();
                    }
                } else showSetup();
            });
        } else {
            auth.signInAnonymously().catch(console.error);
        }
    });

    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async function handleAdminLogin() {
        const inputPass = prompt("Enter Admin Password:");
        if (!inputPass) return;
        const originalText = els.joinBtn ? els.joinBtn.innerText : "";
        if(els.joinBtn) els.joinBtn.innerText = "Verifying...";
        try {
            const snapshot = await db.ref('secrets/admin_key').once('value');
            if (!snapshot.exists()) {
                throw new Error("Admin configuration missing.");
            }
            const storedHash = snapshot.val();
            const inputHash = await sha256(inputPass);
            if (inputHash === storedHash) {
                if(els.nicknameInput) els.nicknameInput.value = ADMIN_NICKNAME;
                await db.ref(`users/${currentUser.uid}`).update({
                    nickname: ADMIN_NICKNAME,
                    avatarUrl: SHAKZZ_ADMIN_AVATAR,
                    isAdmin: true
                });
                showAdminWelcome();
                showChat();
                injectAdminUI();
            } else {
                alert("Incorrect Password");
            }
        } catch (err) {
            console.error("Admin Login Error:", err);
            alert("Login error: " + err.message);
        } finally {
            if(els.joinBtn) {
                els.joinBtn.innerText = originalText || "Start Chatting";
                els.joinBtn.disabled = false;
            }
        }
    }

    setTimeout(injectAdminUI, 1000);

    const profileInput = document.createElement('input');
    profileInput.type = 'file';
    profileInput.accept = 'image/*';
    profileInput.hidden = true;
    document.body.appendChild(profileInput);

    if (els.setupAvatarCircle) {
        els.setupAvatarCircle.onclick = () => profileInput.click();
    }

    profileInput.onchange = (e) => {
        if (e.target.files && e.target.files[0]) {
            profileFile = e.target.files[0];
            els.setupAvatarCircle.innerHTML = `<img src="${URL.createObjectURL(profileFile)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
        }
    };

    if(els.nicknameInput) {
        els.nicknameInput.oninput = () => {
            const val = els.nicknameInput.value.trim();
            if (val.length >= 2) {
                els.joinBtn.disabled = false;
                els.joinBtn.style.opacity = '1';
                els.joinBtn.style.cursor = 'pointer';
            } else {
                els.joinBtn.disabled = true;
                els.joinBtn.style.opacity = '0.5';
                els.joinBtn.style.cursor = 'not-allowed';
            }
        };
    }

    if(els.joinBtn) els.joinBtn.onclick = async () => {
        const name = els.nicknameInput.value.trim();
        if(!name || name.length < 2) return;
        if (name.toLowerCase() === ADMIN_NICKNAME.toLowerCase()) {
            els.setupError.innerText = "⚠️ This nickname is reserved.";
            els.setupError.style.color = "#ef4444";
            return;
        }
        els.joinBtn.disabled = true;
        els.joinBtn.innerText = "Setting up...";
        els.setupError.innerText = "";
        let finalAvatarUrl = "";
        let isAdmin = false;
        try {
            if (profileFile) {
                els.joinBtn.innerText = "Joining Chat...";
                const base64 = await fileToBase64(profileFile);
                const rawUrl = await uploadToDrive(profileFile, base64);
                finalAvatarUrl = formatDriveUrl(rawUrl, 'image');
            } else {
                finalAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true&length=1&size=128`;
            }
            await db.ref(`users/${currentUser.uid}`).set({
                uid: currentUser.uid,
                nickname: name,
                avatarUrl: finalAvatarUrl,
                isAdmin: isAdmin,
                joinedAt: firebase.database.ServerValue.TIMESTAMP
            });
            showChat();
        } catch (err) {
            console.error("Join Error:", err);
            els.joinBtn.innerText = "Start Chatting";
            els.joinBtn.disabled = false;
            els.setupError.innerText = "Connection failed. Please try again.";
        }
    };

    const sendMessage = async () => {
        if (isSending) return;
        const text = els.msgInput.value.trim();
        let replyContext = replyToMsg;
        if (!replyContext && els.msgInput.getAttribute('data-reply-id')) {
            replyContext = {
                id: els.msgInput.getAttribute('data-reply-id'),
                nickname: els.msgInput.getAttribute('data-reply-nick'),
                text: els.msgInput.getAttribute('data-reply-text')
            };
            els.msgInput.removeAttribute('data-reply-id');
            els.msgInput.removeAttribute('data-reply-nick');
            els.msgInput.removeAttribute('data-reply-text');
        }
        if (!text && !pendingFile) return;
        isSending = true;
        if(els.sendBtn) els.sendBtn.disabled = true;
        if(els.previewSendBtn) {
            els.previewSendBtn.disabled = true;
            els.previewSendBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        }
        const fileToSend = pendingFile;
        const newMessageRef = db.ref('messages').push();
        const msgKey = newMessageRef.key;
        const localMessage = {
            uid: currentUser.uid,
            nickname: cachedUserData.nickname,
            avatarUrl: cachedUserData.avatarUrl,
            isAdmin: cachedUserData.isAdmin || false,
            text: text,
            mediaUrl: fileToSend ? 'pending' : null,
            mediaType: fileToSend ? getFileType(fileToSend) : null,
            status: "sending",
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            replyTo: replyContext || null
        };
        renderMessage(localMessage, msgKey);
        scrollToBottom(true);
        els.msgInput.value = '';
        els.attBar.classList.add('hidden');
        if (els.replyBar) els.replyBar.classList.add('hidden');
        if (pendingBlobUrl) URL.revokeObjectURL(pendingBlobUrl);
        replyToMsg = null;
        pendingFile = null;
        pendingBlobUrl = null;
        capturedBlob = null;
        els.mediaInput.value = '';
        try {
            let finalMediaUrl = null;
            let mediaType = null;
            if (fileToSend) {
                mediaType = getFileType(fileToSend);
                const base64Data = await fileToBase64(fileToSend);
                finalMediaUrl = await uploadToDrive(fileToSend, base64Data);
            }
            const finalMessage = {
                uid: currentUser.uid,
                nickname: cachedUserData.nickname,
                avatarUrl: cachedUserData.avatarUrl,
                isAdmin: cachedUserData.isAdmin || false,
                text: text,
                mediaUrl: finalMediaUrl,
                mediaType: mediaType,
                status: "sent",
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                replyTo: replyContext || null
            };
            await newMessageRef.set(finalMessage);
            scrollToBottom(true);
            if (text.toLowerCase().includes('@shakzzai')) {
                setTimeout(() => handleShakzzAI(text), 1000);
            }
        } catch (e) {
            console.error(e);
            alert("Message failed: " + e.message);
            db.ref(`messages/${msgKey}`).update({ status: "failed" });
        } finally {
            isSending = false;
            if(els.sendBtn) els.sendBtn.disabled = false;
            if(els.previewSendBtn) {
                els.previewSendBtn.disabled = false;
                els.previewSendBtn.innerHTML = 'Send <i class="fas fa-paper-plane"></i>';
            }
        }
    };

    if(els.sendBtn) els.sendBtn.onclick = sendMessage;
    if(els.msgInput) els.msgInput.onkeydown = (e) => { if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
    if(els.msgInput) {
        let mentionListEl = document.getElementById('mm-mention-list');
        if (!mentionListEl) {
            mentionListEl = document.createElement('div');
            mentionListEl.id = 'mm-mention-list';
            els.footer.appendChild(mentionListEl);
        }
        els.mentionList = mentionListEl;
    }

    if(els.msgInput) els.msgInput.addEventListener('keyup', (e) => {
        const val = els.msgInput.value;
        const cursorPos = els.msgInput.selectionStart;
        const lastAt = val.lastIndexOf('@', cursorPos);
        if (lastAt !== -1 && (cursorPos - lastAt) <= 10) {
            const query = val.substring(lastAt + 1, cursorPos).toLowerCase();
            showMentionList(query, lastAt);
        } else {
            els.mentionList.style.display = 'none';
        }
    });

    function showMentionList(query, atIndex) {
        const matches = allUsersCache.filter(u =>
            u.nickname.toLowerCase().startsWith(query) && u.uid !== currentUser.uid
        );
        if (matches.length === 0) {
            els.mentionList.style.display = 'none';
            return;
        }
        els.mentionList.innerHTML = '';
        matches.forEach(user => {
            const div = document.createElement('div');
            div.className = 'mm-mention-item';
            div.innerHTML = `<img src="${user.avatarUrl}" class="mm-mention-avatar"> ${user.nickname}`;
            div.onclick = () => {
                const val = els.msgInput.value;
                const before = val.substring(0, atIndex);
                const after = val.substring(els.msgInput.selectionStart);
                els.msgInput.value = `${before}@${user.nickname} ${after}`;
                els.mentionList.style.display = 'none';
                els.msgInput.focus();
            };
            els.mentionList.appendChild(div);
        });
        els.mentionList.style.display = 'block';
    }

    document.addEventListener('click', (e) => {
        if (els.mentionList && e.target !== els.mentionList && e.target !== els.msgInput) {
            els.mentionList.style.display = 'none';
        }
    });

    window.handleBubbleTap = (element, msgData) => {
        const msgWrapper = element.closest('.mm-msg');
        const isVisible = msgWrapper.classList.toggle('show-meta');
        console.log(`[Interaction] Bubble Tapped. Visible: ${isVisible}`);
        console.log(`[Log Timestamp] Message Time: ${new Date(msgData.createdAt).toLocaleString()}`);
        if (msgData.reactions) {
            console.log(`[Log Emoji] Reactions present:`, Object.keys(msgData.reactions));
        } else {
            console.log(`[Log Emoji] No reactions.`);
        }
        if (msgData.seenBy) {
            const names = Object.values(msgData.seenBy);
            console.log(`[Log Seen By] Users:`, names);
        } else {
            console.log(`[Log Seen By] Not seen yet.`);
        }
    };

    const alignStyle = document.createElement("style");
    alignStyle.innerHTML = `.mm-msg.mm-own .mm-msg-group { align-items: flex-end !important; }`;
    document.head.appendChild(alignStyle);

    function createMessageEl(msg, key) {
        const isMe = msg.uid === currentUser.uid;
        const div = document.createElement('div');
        div.id = `msg-${key}`;
        div.setAttribute('data-id', key);
        div.setAttribute('data-nickname', msg.nickname);
        div.setAttribute('data-text', msg.text || (msg.mediaUrl ? "Attachment" : ""));
        const hasReactions = msg.reactions && Object.keys(msg.reactions).length > 0;
        const reactionClass = hasReactions ? 'has-reaction' : '';
        div.className = `mm-msg ${isMe ? 'mm-own' : 'mm-other'} ${reactionClass}`;
        if (msg.deletedForAll) {
            const unsentText = isMe ? "You unsent a message" : `${msg.nickname} unsent a message`;
            div.innerHTML = `
                <img src="${msg.avatarUrl}" class="mm-avatar">
                <div class="mm-msg-group">
                    <div class="mm-msg-bubble mm-unsent-msg">${unsentText}</div>
                </div>`;
            return div;
        }
        let mediaHtml = '';
        let bubbleClass = '';
        if (msg.mediaUrl && (!msg.text || msg.text === "")) bubbleClass = 'mm-image-bubble';
        if (msg.mediaUrl) {
            if (msg.mediaType === 'image') {
                const directUrl = (msg.mediaUrl === 'pending') ? (pendingBlobUrl || '') : formatDriveUrl(msg.mediaUrl, 'image');
                mediaHtml = `<img src="${directUrl}" class="mm-msg-img" onclick="openLightbox('${msg.mediaUrl}', 'image', '${msg.nickname}', '${key}')" loading="lazy" style="${msg.mediaUrl === 'pending' ? 'filter: blur(2px);' : ''}">`;
            } else if (msg.mediaType === 'video') {
                const videoUrl = (msg.mediaUrl === 'pending') ? (pendingBlobUrl || '') : formatDriveUrl(msg.mediaUrl, 'view');
                mediaHtml = `<div class="mm-msg-video-container" onclick="openLightbox('${msg.mediaUrl}', 'video', '${msg.nickname}', '${key}')">
                    ${msg.mediaUrl === 'pending' ? `<div style="width:200px; height:120px; background:#000; display:flex; align-items:center; justify-content:center; border-radius:12px; filter: blur(2px);"><i class="fas fa-play-circle" style="color:white;"></i></div>` : `<video src="${videoUrl}#t=1" style="max-width:200px; max-height:120px; object-fit:cover; border-radius:12px;"></video>`}</div>`;
            } else {
                 const downloadUrl = formatDriveUrl(msg.mediaUrl, 'download');
                 mediaHtml = `<a href="${downloadUrl}" target="_blank" class="mm-file-attach"><i class="fas fa-download"></i> Attachment</a>`;
                 bubbleClass = '';
            }
        }
        let replyHtml = '';
        if (msg.replyTo) {
            replyHtml = `
            <div class="mm-msg-reply-preview" onclick="event.stopPropagation(); scrollToRepliedMessage('${msg.replyTo.id}')">
                <div class="mm-reply-name">${msg.replyTo.nickname}</div>
                <div class="mm-reply-text">${msg.replyTo.text || '📷 Attachment'}</div>
            </div>`;
        }
        let nicknameHtml = '';
        if (!isMe) {
            const adminClass = msg.isAdmin ? 'admin' : '';
            const adminBadge = msg.isAdmin ? '<i class="fas fa-shield-alt" style="font-size:10px;"></i>' : '';
            nicknameHtml = `<div class="mm-sender-name-top ${adminClass}">${msg.nickname} ${adminBadge}</div>`;
        }
        let reactionsHtml = '';
        if (msg.reactions) {
            let count = 0; let emojis = "";
            let reactionCounts = {};
            for (let [emoji, users] of Object.entries(msg.reactions)) {
                const c = Object.keys(users).length;
                reactionCounts[emoji] = c; count += c;
            }
            const sortedEmojis = Object.keys(reactionCounts).sort((a, b) => reactionCounts[b] - reactionCounts[a]);
            emojis = sortedEmojis.join('');
            if (count > 0) {
                let displayEmojis = emojis.substring(0, 6);
                reactionsHtml = `<div class="mm-reaction-badge" onclick="event.stopPropagation(); showReactionList('${key}')"><span>${displayEmojis}</span><span style="margin-left:2px">${count}</span></div>`;
            }
        }
        const desktopToolsHtml = `<div class="mm-desktop-tools"><button class="mm-tool-btn" title="React" onclick="openDesktopReactionMenu(event, '${key}')"><i class="fas fa-face-smile"></i></button><button class="mm-tool-btn" title="Reply" onclick="safeReply('${key}', this)"><i class="fas fa-reply"></i></button><button class="mm-tool-btn" title="More" onclick="openDesktopMenu(event, '${key}', '${msg.uid}')"><i class="fas fa-ellipsis"></i></button></div>`;
        const date = new Date(msg.createdAt);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const dayStr = days[date.getDay()];
        const finalTimeStr = `${dayStr} AT ${timeStr}`;
        let footerHtml = '';
        if (isMe) {
            let seenAvatar = '';
            if (msg.status === 'seen' || (msg.seenBy && Object.keys(msg.seenBy).length > 0)) {
                seenAvatar = `<div class="mm-status-seen"><img src="${cachedUserData.avatarUrl}" class="mm-status-avatar"></div>`;
            } else if (msg.status === 'sending') {
                seenAvatar = `<div class="mm-status-seen"><i class="fas fa-spinner fa-spin" style="font-size:10px; color:#fde047"></i></div>`;
            } else {
                seenAvatar = `<div class="mm-status-seen"><i class="fas fa-check-circle" style="font-size:10px; color:#94a3b8"></i></div>`;
            }
            let hiddenContent = `<div style="font-weight:bold; margin-bottom:4px; font-size: 0.7rem;">${finalTimeStr}</div>`;
            if (msg.seenBy) {
                const names = Object.values(msg.seenBy).join(", ");
                hiddenContent += `<div style="color:#e4e6eb; font-size: 0.75rem; font-weight: 500; margin-top: 2px;">Seen by ${names}</div>`;
            } else if (msg.status === 'seen') {
                hiddenContent += `<div>Seen</div>`;
            } else if (msg.status === 'delivered') {
                hiddenContent += `<div>Delivered</div>`;
            }
            footerHtml = `
            <div class="mm-status-container">
                <div class="mm-msg-status">${hiddenContent}</div>
                ${seenAvatar}
            </div>`;
        } else {
             let otherHiddenContent = `<div style="text-align:left; margin-top:5px; font-size: 0.7rem; color: #94a3b8;">${finalTimeStr}</div>`;
             footerHtml = `
             <div class="mm-status-container">
                <div class="mm-msg-status">${otherHiddenContent}</div>
             </div>`;
        }
        const msgJson = JSON.stringify({
            createdAt: msg.createdAt,
            reactions: msg.reactions || null,
            seenBy: msg.seenBy || null
        }).replace(/"/g, '&quot;');
        const tapHandler = `onclick="handleBubbleTap(this, ${msgJson})"`;
        div.innerHTML = `
            <img src="${msg.avatarUrl}" class="mm-avatar">
            <div class="mm-msg-group ${reactionClass}">
                ${nicknameHtml}
                <div class="mm-msg-bubble ${bubbleClass}" ${tapHandler}>
                    ${desktopToolsHtml}
                    ${replyHtml}
                    ${msg.text ? `<div>${msg.text}</div>` : ''}
                    ${mediaHtml}
                    ${reactionsHtml}
                </div>
                ${footerHtml}
            </div>
        `;
        return div;
    }

    function renderMessage(msg, key) {
        if (!msg) return;
        const existing = document.getElementById(`msg-${key}`);
        if (existing) {
            existing.replaceWith(createMessageEl(msg, key));
        } else {
            const el = createMessageEl(msg, key);
            els.msgContainer.appendChild(el);
        }
    }

    function loadMessages() {
        const initialQuery = db.ref('messages').orderByKey().limitToLast(30);
        initialQuery.once('value', snapshot => {
            const data = snapshot.val();
            if (!data) { startLiveListener(); return; }
            const keys = Object.keys(data).sort();
            oldestLoadedKey = keys[0];
            db.ref('users').on('value', snapshot => {
                allUsersCache = [];
                snapshot.forEach(child => {
                    const val = child.val();
                    if(val.nickname) allUsersCache.push(val);
                });
            });
            keys.forEach(key => renderMessage(data[key], key));
            scrollToBottom(true);
            startLiveListener();
            if(typeof markMessagesAsSeen === 'function') markMessagesAsSeen();
            els.msgContainer.addEventListener('scroll', () => {
                if (els.msgContainer.scrollTop === 0 && !isLoadingHistory) {
                    loadOlderMessages();
                }
            });
        });
    }

    async function loadOlderMessages() {
        if (!oldestLoadedKey || isLoadingHistory) return;
        isLoadingHistory = true;
        const oldHeight = els.msgContainer.scrollHeight;
        const query = db.ref('messages').orderByKey().endAt(oldestLoadedKey).limitToLast(21);
        const snap = await query.once('value');
        const data = snap.val();
        if (!data) { isLoadingHistory = false; return; }
        const keys = Object.keys(data).sort();
        if (keys[keys.length - 1] === oldestLoadedKey) keys.pop();
        if (keys.length === 0) { isLoadingHistory = false; return; }
        oldestLoadedKey = keys[0];
        for (let i = keys.length - 1; i >= 0; i--) {
            const key = keys[i];
            const msg = data[key];
            const el = createMessageEl(msg, key);
            els.msgContainer.insertBefore(el, els.msgContainer.firstChild);
        }
        els.msgContainer.scrollTop = els.msgContainer.scrollHeight - oldHeight;
        isLoadingHistory = false;
    }

    function startLiveListener() {
        db.ref('messages').limitToLast(1).on('child_added', snap => {
            if (document.getElementById(`msg-${snap.key}`)) return;
            renderMessage(snap.val(), snap.key);
            if (!oldestLoadedKey) oldestLoadedKey = snap.key;
            if (!els.panel.classList.contains('hidden')) {
                 scrollToBottom(false);
                 if (snap.val().uid !== currentUser.uid && snap.val().status !== 'seen') {
                     updateMessageStatus(snap.key, 'seen');
                 }
            } else {
                if(els.unreadBadge) {
                    let current = parseInt(els.unreadBadge.innerText) || 0;
                    els.unreadBadge.innerText = current + 1;
                    els.unreadBadge.style.display = 'block';
                }
            }
        });
        db.ref('messages').on('child_changed', snap => renderMessage(snap.val(), snap.key));
    }

    window.scrollToRepliedMessage = async (msgId) => {
        let targetEl = document.getElementById(`msg-${msgId}`);
        if (!targetEl) {
            const toast = document.createElement('div');
            toast.innerText = "Fetching older message...";
            toast.style.cssText = "position:fixed; top:100px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:#fff; padding:6px 12px; border-radius:20px; z-index:20000; font-size:12px;";
            document.body.appendChild(toast);
            try {
                const snap = await db.ref(`messages/${msgId}`).once('value');
                if (snap.exists()) {
                    const msg = snap.val();
                    const el = createMessageEl(msg, msgId);
                    el.style.borderTop = "1px dashed #3b82f6";
                    el.style.marginTop = "15px";
                    els.msgContainer.insertBefore(el, els.msgContainer.firstChild);
                    targetEl = el;
                    toast.remove();
                } else {
                    toast.innerText = "Message was deleted.";
                    setTimeout(() => toast.remove(), 2000);
                    return;
                }
            } catch(e) {
                toast.innerText = "Error loading.";
                setTimeout(() => toast.remove(), 2000);
                return;
            }
        }
        if (targetEl && els.msgContainer) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const bubble = targetEl.querySelector('.mm-msg-bubble');
            if(bubble) {
                bubble.style.transition = 'box-shadow 0.3s';
                bubble.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.8)';
                setTimeout(() => bubble.style.boxShadow = 'none', 1500);
            }
        }
    };

    function markMessagesAsSeen() {
    if (!currentUser || !cachedUserData) return;

    // Get list of message IDs currently on the screen
    const msgKeys = Array.from(els.msgContainer.querySelectorAll('.mm-msg')).map(el => el.getAttribute('data-id'));
    if (msgKeys.length === 0) return;

    // Optimized Query 
    db.ref('messages')
        .orderByChild('status')
        .equalTo('sent')
        .limitToLast(20)
        .once('value', (snapshot) => {
            if (!snapshot.exists()) return;

            const globalUpdates = {}; // Container for all updates
            let hasUpdates = false;

            snapshot.forEach((childSnapshot) => {
                const msg = childSnapshot.val();
                const key = childSnapshot.key;

                // Check if message is on screen AND not sent by me
                if (msgKeys.includes(key) && msg.uid !== currentUser.uid && !msg.deletedForAll) {
                    if (!msg.seenBy || !msg.seenBy[currentUser.uid]) {
                        // Prepare the atomic update paths
                        globalUpdates[`messages/${key}/seenBy/${currentUser.uid}`] = cachedUserData.nickname;
                        globalUpdates[`messages/${key}/status`] = 'seen';
                        hasUpdates = true;
                    }
                }
            });

            // Send ALL updates in ONE single network request
            if (hasUpdates) {
                db.ref().update(globalUpdates);
            }
        });
}


    if (els.camBtn) {
        els.camBtn.onclick = async () => {
            els.cameraLayer.classList.remove('hidden');
            els.camControlsUI.classList.remove('hidden');
            els.previewContainer.classList.add('hidden');
            try {
                camStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                    audio: true
                });
                els.cameraVideo.srcObject = camStream;
                camTrack = camStream.getVideoTracks()[0];
            } catch (err) {
                alert("Camera access denied.");
                els.cameraLayer.classList.add('hidden');
            }
        };
    }

    if (els.camCloseBtn) els.camCloseBtn.onclick = stopCamera;
    
    function stopCamera() {
        if (camStream) {
            camStream.getTracks().forEach(track => track.stop());
            camStream = null;
        }
        isNightMode = false;
        isFlashOn = false;
        if(els.cameraVideo) els.cameraVideo.style.filter = "none";
        if(els.camFlashBtn) els.camFlashBtn.innerText = "⚡ Off";
        if(els.camNightBtn) els.camNightBtn.style.color = "white";
        els.cameraLayer.classList.add('hidden');
        els.previewContainer.classList.add('hidden');
        capturedBlob = null;
    }

    if(els.camModePhoto) els.camModePhoto.onclick = () => setCamMode('photo');
    if(els.camModeVideo) els.camModeVideo.onclick = () => setCamMode('video');

    function setCamMode(mode) {
        camMode = mode;
        if(els.camModePhoto) els.camModePhoto.classList.toggle('active-mode', mode === 'photo');
        if(els.camModeVideo) els.camModeVideo.classList.toggle('active-mode', mode === 'video');
        if(els.camShutterBtn) {
            els.camShutterBtn.style.backgroundColor = (mode === 'video') ? 'rgba(255,0,0,0.2)' : 'transparent';
        }
    }

    if (els.camShutterBtn) {
        els.camShutterBtn.onclick = () => {
            if (camMode === 'photo') capturePhoto();
            else toggleRecording();
        };
    }

    function capturePhoto() {
        if (!camStream) return;
        const context = els.cameraCanvas.getContext('2d');
        els.cameraCanvas.width = els.cameraVideo.videoWidth;
        els.cameraCanvas.height = els.cameraVideo.videoHeight;
        if (isNightMode) context.filter = 'brightness(150%) contrast(120%)';
        context.drawImage(els.cameraVideo, 0, 0, els.cameraCanvas.width, els.cameraCanvas.height);
        els.cameraCanvas.toBlob(blob => {
            capturedBlob = blob;
            capturedBlob.type = 'image/jpeg';
            showPreview('image', URL.createObjectURL(blob));
        }, 'image/jpeg', 0.85);
    }

    let isRecording = false;
    function toggleRecording() {
        if (!isRecording) {
            camChunks = [];
            camRecorder = new MediaRecorder(camStream);
            camRecorder.ondataavailable = e => camChunks.push(e.data);
            camRecorder.onstop = () => {
                capturedBlob = new Blob(camChunks, { type: 'video/mp4' });
                showPreview('video', URL.createObjectURL(capturedBlob));
            };
            camRecorder.start();
            isRecording = true;
            if(els.camShutterBtn) els.camShutterBtn.classList.add('recording');
        } else {
            camRecorder.stop();
            isRecording = false;
            if(els.camShutterBtn) els.camShutterBtn.classList.remove('recording');
        }
    }

    function showPreview(type, url) {
        els.camControlsUI.classList.add('hidden');
        els.previewContainer.classList.remove('hidden');
        if (type === 'image') {
            els.previewImg.src = url;
            els.previewImg.classList.remove('hidden');
            els.previewVideo.classList.add('hidden');
        } else {
            els.previewVideo.src = url;
            els.previewVideo.classList.remove('hidden');
            els.previewImg.classList.add('hidden');
            els.previewVideo.play();
        }
    }

    if(els.previewCloseBtn) {
        els.previewCloseBtn.onclick = () => {
            els.previewContainer.classList.add('hidden');
            els.camControlsUI.classList.remove('hidden');
            capturedBlob = null;
        };
    }

    if(els.previewSendBtn) {
        els.previewSendBtn.onclick = async () => {
            if(!capturedBlob || isSending) return;
            const fileName = (capturedBlob.type.includes('video')) ? "cam_video.mp4" : "cam_photo.jpg";
            const file = new File([capturedBlob], fileName, { type: capturedBlob.type });
            handleFileSelection(file);
            stopCamera();
            await sendMessage();
        };
    }

    if(els.camFlashBtn) {
        els.camFlashBtn.onclick = () => {
            if (!camTrack) return;
            const capabilities = camTrack.getCapabilities();
            if (!capabilities.torch) { alert("Flash not supported."); return; }
            isFlashOn = !isFlashOn;
            camTrack.applyConstraints({ advanced: [{ torch: isFlashOn }] }).catch(console.error);
            els.camFlashBtn.innerText = isFlashOn ? "⚡ On" : "⚡ Off";
        };
    }
    if(els.camNightBtn) {
        els.camNightBtn.onclick = () => {
            isNightMode = !isNightMode;
            els.cameraVideo.style.filter = isNightMode ? "brightness(1.5) contrast(1.2)" : "none";
            els.camNightBtn.style.color = isNightMode ? "#fbbf24" : "white";
        };
    }

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => els.panel.addEventListener(eventName, e => {e.preventDefault();e.stopPropagation()}, false));
    els.panel.addEventListener('dragenter', () => els.dragOverlay.classList.remove('hidden'));
    els.dragOverlay.addEventListener('dragleave', () => els.dragOverlay.classList.add('hidden'));
    els.panel.addEventListener('drop', (e) => {
        els.dragOverlay.classList.add('hidden');
        if (e.dataTransfer.files.length > 0) handleFileSelection(e.dataTransfer.files[0]);
    });

    if(els.mediaBtn) {
        els.mediaBtn.onclick = () => {
            els.mediaInput.value = '';
            els.mediaInput.click();
        };
    }

    if(els.mediaInput) els.mediaInput.onchange = (e) => {
        if(e.target.files[0]) handleFileSelection(e.target.files[0]);
    };

    function handleFileSelection(file) {
        if (file.size > MAX_FILE_SIZE) { alert("File too large (Max 10MB)"); return; }
        if (pendingBlobUrl) URL.revokeObjectURL(pendingBlobUrl);
        pendingFile = file;
        pendingBlobUrl = URL.createObjectURL(file);
        els.attBar.classList.remove('hidden');
        const type = getFileType(file);
        els.attImg.classList.add('hidden'); els.attVid.classList.add('hidden'); els.attInfo.classList.add('hidden');
        els.attImg.onclick = null;
        els.attVid.onclick = null;
        if(type === 'image') {
            els.attImg.classList.remove('hidden');
            els.attImg.src = pendingBlobUrl;
            els.attImg.onclick = (e) => { e.stopPropagation(); openLightbox(pendingBlobUrl, type, cachedUserData.nickname, 'local'); };
        } else if(type === 'video') {
            els.attVid.classList.remove('hidden');
            els.attVid.src = pendingBlobUrl;
            els.attVid.onclick = (e) => { e.stopPropagation(); openLightbox(pendingBlobUrl, type, cachedUserData.nickname, 'local'); };
        } else {
            els.attInfo.classList.remove('hidden');
            els.attName.textContent = file.name;
        }
        els.msgInput.focus();
    }

    function formatDriveUrl(url, type = 'view') {
        if (!url || !url.includes('drive.google.com')) return url;
        let id = null;
        if(url.includes('id=')) id = url.split('id=')[1];
        else if(url.includes('/d/')) id = url.split('/d/')[1].split('/')[0];
        if (!id) return url;
        if (type === 'image') return `https://drive.google.com/thumbnail?id=${id}&sz=w800`;
        return `https://drive.google.com/uc?export=${type==='download'?'download':'view'}&id=${id}`;
    }

    function getFileType(file) {
        if (file.type.startsWith('image/')) return 'image';
        if (file.type.startsWith('video/')) return 'video';
        return 'file';
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    }

    async function uploadToDrive(file, base64String) {
        const payload = { base64: base64String, mimeType: file.type, filename: `ShakzzTV_${Date.now()}_${file.name}`, userName: currentUser.uid };
        const response = await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload) });
        const result = await response.json();
        if(result.status !== 'success') throw new Error("Upload Failed");
        return result.url;
    }

    async function handleShakzzAI(userPrompt) {
        const cleanPrompt = userPrompt.replace(/@ShakzzAI/ig, '').trim();
        if (!cleanPrompt) return;
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.0-flash:generateContent?key=${GEMINI_API_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: cleanPrompt }] }] })
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error.message || "API Error");
            }
            const data = await response.json();
            const aiReplyText = data.candidates[0].content.parts[0].text;
            db.ref('messages').push({
                uid: "shakzz-ai-bot",
                nickname: AI_NICKNAME,
                avatarUrl: AI_AVATAR,
                isAdmin: true,
                text: aiReplyText,
                status: "sent",
                createdAt: firebase.database.ServerValue.TIMESTAMP
            });
        } catch (error) {
            console.error("AI Error:", error);
            alert("AI Failed: " + error.message);
        }
    }

    function showSetup() { els.setupView.classList.remove('hidden'); els.chatView.classList.add('hidden'); }
    function showChat() { els.setupView.classList.add('hidden'); els.chatView.classList.remove('hidden'); loadMessages(); }
    function scrollToBottom(force) {
        if (force || (els.msgContainer.scrollHeight - els.msgContainer.scrollTop - els.msgContainer.clientHeight < 200)) {
            setTimeout(() => els.msgContainer.scrollTop = els.msgContainer.scrollHeight, 100);
        }
    }

    if(els.fab) els.fab.onclick = () => {
        els.panel.classList.remove('hidden'); els.wrapper.classList.add('chat-open');
        document.body.classList.add('mm-open');
        if(els.unreadBadge) els.unreadBadge.style.display = 'none';
        scrollToBottom(true);
        markMessagesAsSeen();
    };

    if(els.closeBtns) els.closeBtns.forEach(b => b.onclick = () => {
        els.panel.classList.add('hidden'); els.wrapper.classList.remove('chat-open');
        document.body.classList.remove('mm-open');
    });

    if(els.removeAtt) els.removeAtt.onclick = () => {
        if (pendingBlobUrl) URL.revokeObjectURL(pendingBlobUrl);
        pendingFile = null;
        pendingBlobUrl = null;
        capturedBlob = null;
        els.attBar.classList.add('hidden');
        els.mediaInput.value = '';
        if (els.attImg) els.attImg.onclick = null;
        if (els.attVid) els.attVid.onclick = null;
    };
    if(els.cancelReply) els.cancelReply.onclick = () => { replyToMsg = null; els.replyBar.classList.add('hidden'); };

    window.setReply = (id, nickname, text) => {
        els.replyBar.classList.remove('hidden');
        els.replyName.innerText = `Replying to ${nickname}`;
        els.replyPrev.innerText = text;
        replyToMsg = { id, nickname, text };
        els.msgInput.focus();
    };

    window.scrollToRepliedMessage = (msgId) => {
        const targetEl = document.getElementById(`msg-${msgId}`);
        if (targetEl && els.msgContainer) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const bubble = targetEl.querySelector('.mm-msg-bubble');
            if(bubble) {
                bubble.style.transition = 'box-shadow 0.3s';
                bubble.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.8)';
                setTimeout(() => bubble.style.boxShadow = 'none', 1500);
            }
        }
    };

    window.openLightbox = (url, type, nickname, msgKey) => {
        els.lightbox.classList.remove('hidden');
        els.lightbox.classList.add('show');
        els.lightboxContent.innerHTML = '';
        let src = url;
        const isLocalBlob = url.startsWith('blob:');
        let downloadSrc = url;
        let fileName = `${nickname}_${msgKey}_${type}`;
        if (!isLocalBlob && url && url !== 'pending') {
            src = formatDriveUrl(url, 'view');
            downloadSrc = formatDriveUrl(url, 'download');
            fileName = `${nickname}_${msgKey}.${type === 'image' ? 'jpg' : (type === 'video' ? 'mp4' : 'file')}`;
        } else if (isLocalBlob) {
            downloadSrc = url;
            fileName = `local_capture.${type === 'image' ? 'jpg' : (type === 'video' ? 'mp4' : 'file')}`;
        } else {
            return;
        }
        let mediaEl;
        if (type === 'image') {
            mediaEl = document.createElement('img');
            mediaEl.src = src;
            mediaEl.style.cssText = "max-width:100%; max-height:85vh; border-radius:8px; object-fit:contain;";
        } else if (type === 'video') {
            mediaEl = document.createElement('video');
            mediaEl.src = src;
            mediaEl.controls = true;
            mediaEl.preload = 'metadata';
            mediaEl.style.cssText = "max-width:100%; max-height:85vh; border-radius:8px; object-fit:contain;";
        } else {
            els.lightboxContent.innerHTML = `
                <div style="text-align:center; color:white; padding:20px;">
                    <p>File type cannot be previewed. Click Download to save the file: ${fileName}</p>
                </div>
             `;
        }
        if (mediaEl) {
            els.lightboxContent.appendChild(mediaEl);
        }
        const header = document.createElement('div');
        header.className = 'mm-lightbox-header';
        const downloadBtn = document.createElement('a');
        downloadBtn.className = 'mm-lightbox-btn';
        downloadBtn.href = downloadSrc;
        downloadBtn.download = fileName;
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
        if (isLocalBlob) {
            downloadBtn.onclick = (e) => {
                e.stopPropagation();
                const tempLink = document.createElement('a');
                tempLink.href = downloadSrc;
                tempLink.download = fileName;
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
            };
            downloadBtn.removeAttribute('href');
        }
        header.appendChild(downloadBtn);
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mm-lightbox-btn';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            closeLightbox(isLocalBlob ? src : null);
        };
        header.appendChild(closeBtn);
        els.lightbox.appendChild(header);
        els.lightbox.onclick = (e) => {
            if (e.target === els.lightbox) {
                closeLightbox(isLocalBlob ? src : null);
            }
        };
        function closeLightbox(blobUrl) {
            if (blobUrl && blobUrl.startsWith('blob:')) URL.revokeObjectURL(blobUrl);
            els.lightbox.classList.remove('show');
            setTimeout(() => {
                els.lightbox.classList.add('hidden');
                header.remove();
            }, 300);
            els.lightbox.onclick = null;
        }
    };

    function showReactionPopover(msgElement, msgId) {
        document.querySelectorAll('.mm-reaction-popover').forEach(e => e.remove());
        const popover = document.createElement('div');
        popover.className = 'mm-reaction-popover';
        popover.onclick = (e) => e.stopPropagation();
        const emojis = ['❤️', '😆', '😮', '😢', '😠', '👍'];
        popover.innerHTML = emojis.map(e => `
            <span class="mm-reaction-icon"
                  onclick="event.stopPropagation(); triggerReaction('${msgId}', '${e}'); window.closeMobileSheet();">
                ${e}
            </span>`).join('');
        popover.style.visibility = 'hidden';
        document.body.appendChild(popover);
        if (msgElement) {
            const msgWrapper = msgElement.closest('.mm-msg');
            const isOwn = msgWrapper.classList.contains('mm-own');
            const rect = msgElement.getBoundingClientRect();
            const menuWidth = popover.offsetWidth;
            const menuHeight = popover.offsetHeight;
            const margin = 10;
            let top = rect.top - menuHeight - margin;
            let left;
            if (isOwn) {
                left = rect.right - menuWidth - margin;
            } else {
                left = rect.left + margin;
            }
            if (left < 10) left = 10;
            if (left + menuWidth > window.innerWidth - 10) {
                left = window.innerWidth - menuWidth - 10;
            }
            if (top < 10) top = rect.bottom + margin;
            popover.style.top = `${top}px`;
            popover.style.left = `${left}px`;
            popover.style.visibility = 'visible';
            setTimeout(() => popover.classList.add('show'), 10);
        }
    }

    window.triggerReaction = async (msgId, targetEmoji) => {
        const reactionsRef = db.ref(`messages/${msgId}/reactions`);
        const snapshot = await reactionsRef.once('value');
        const allReactions = snapshot.val() || {};
        const updates = {};
        let toggleOff = false;
        Object.keys(allReactions).forEach(emoji => {
            const users = allReactions[emoji];
            if (users && users[currentUser.uid]) {
                updates[`${emoji}/${currentUser.uid}`] = null;
                if (emoji === targetEmoji) toggleOff = true;
            }
        });
        if (!toggleOff) updates[`${targetEmoji}/${currentUser.uid}`] = true;
        await reactionsRef.update(updates);
        document.querySelectorAll('.mm-reaction-popover').forEach(e => e.remove());
    };

    function openMobileSheet(msgId, isMe, text, msgElement, nickname) {
        window.currentSheetMsgId = msgId;
        window.currentSheetMsgText = text;
        window.currentSheetMsgNickname = nickname;
        const sheet = els.actionSheet;
        sheet.innerHTML = '';
        const content = document.createElement('div');
        content.className = 'mm-sheet-content';
        content.onclick = (e) => e.stopPropagation();
        const actionRow = document.createElement('div');
        actionRow.className = 'mm-sheet-row';
        const makeBtn = (icon, label, action, color) => {
            const btn = document.createElement('button');
            btn.className = 'mm-sheet-btn';
            const iconWrapper = document.createElement('i');
            iconWrapper.className = icon;
            const textSpan = document.createElement('span');
            textSpan.innerText = label;
            if (color) iconWrapper.style.color = color;
            btn.appendChild(iconWrapper);
            btn.appendChild(textSpan);
            btn.onclick = (e) => {
                e.stopPropagation();
                if (action === 'cancel') window.closeMobileSheet();
                else { window.closeMobileSheet(); setTimeout(() => handleSheetAction(action), 50); }
            };
            return btn;
        };
        actionRow.appendChild(makeBtn('fas fa-reply', 'Reply', 'reply'));
        actionRow.appendChild(makeBtn('far fa-copy', 'Copy', 'copy'));
        if(isMe) actionRow.appendChild(makeBtn('far fa-trash-can', 'Unsend', 'delete', '#ef4444'));
        else actionRow.appendChild(makeBtn('fas fa-flag', 'Report', 'report', '#ef4444'));
        const cancelBtn = makeBtn('fas fa-xmark', 'Cancel', 'cancel');
        cancelBtn.querySelector('i').style.color = "#9ca3af";
        actionRow.appendChild(cancelBtn);
        content.appendChild(actionRow);
        sheet.appendChild(content);
        sheet.classList.remove('hidden');
        sheet.classList.add('show');
    }

    function handleSheetAction(action) {
        if(action === 'reply') {
            const nick = window.currentSheetMsgNickname || "User";
            window.setReply(window.currentSheetMsgId, nick, window.currentSheetMsgText);
        }
        if(action === 'copy') navigator.clipboard.writeText(window.currentSheetMsgText);
        if(action === 'delete') {
            if(confirm("Unsend message for everyone?")) db.ref(`messages/${window.currentSheetMsgId}`).update({deletedForAll:true});
        }
        if(action === 'report') alert("Message reported.");
    }

    window.closeMobileSheet = () => {
        if(els.actionSheet) {
            els.actionSheet.classList.remove('show');
            setTimeout(()=>els.actionSheet.classList.add('hidden'),300);
        }
        document.querySelectorAll('.mm-reaction-popover').forEach(el => el.remove());
    };

    // --- MODIFIED TOUCH HANDLER WITH BADGE CHECK ---
    if(els.msgContainer) {
        els.msgContainer.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); return false; }, { capture: true });
        els.msgContainer.addEventListener('touchstart', (e) => {
            // CRITICAL FIX: Ignore touches on reaction badge
            if (e.target.closest('.mm-reaction-badge')) {
                return;
            }
            const msgWrapper = e.target.closest('.mm-msg');
            const bubble = e.target.closest('.mm-msg-bubble') || e.target.closest('.mm-msg-img');
            if (!bubble || !msgWrapper) return;
            clearTimeout(longPressTimer);
            document.querySelectorAll('.mm-reaction-popover').forEach(el => el.remove());
            let startX = e.touches[0].clientX;
            let startY = e.touches[0].clientY;
            let isLongPress = false;
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                if(navigator.vibrate) navigator.vibrate(50);
                const msgId = msgWrapper.getAttribute('data-id');
                const isMe = msgWrapper.classList.contains('mm-own');
                const text = msgWrapper.getAttribute('data-text') || bubble.innerText.trim() || "Attachment";
                let nickname = isMe ? "You" : (msgWrapper.getAttribute('data-nickname') || "User");
                showReactionPopover(bubble, msgId);
                openMobileSheet(msgId, isMe, text, bubble, nickname);
                e.preventDefault();
            }, 500);
            const moveHandler = (e) => {
                const moveX = e.touches[0].clientX;
                const moveY = e.touches[0].clientY;
                if (Math.abs(moveX - startX) > 10 || Math.abs(moveY - startY) > 10) {
                    clearTimeout(longPressTimer);
                    els.msgContainer.removeEventListener('touchmove', moveHandler);
                }
            };
            els.msgContainer.addEventListener('touchmove', moveHandler, {passive:true});
            els.msgContainer.addEventListener('touchend', (endEvent) => {
                els.msgContainer.removeEventListener('touchmove', moveHandler);
                clearTimeout(longPressTimer);
                if (!isLongPress && bubble) {
                    endEvent.preventDefault();
                }
            }, { once: true });
        }, {passive:false});
        els.actionSheet.addEventListener('click', (e) => {
            if(e.target === els.actionSheet) window.closeMobileSheet();
        });
    }

    // --- ENHANCED: showReactionList with error handling ---
    window.showReactionList = async (msgId) => {
        console.log(`[Reaction] Opening list for message: ${msgId}`);
        const view = els.reactionView;
        if (!view) {
            console.error("[Reaction] Reaction view element not found!");
            return;
        }
        try {
            view.innerHTML = `
                <div class="mm-reaction-header">
                    <span class="mm-reaction-title">Reactions</span>
                    <button class="mm-reaction-close" onclick="event.stopPropagation(); closeReactionModal(event)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div id="mm-reaction-list-content">
                    <div style="padding:40px; text-align:center; color:#b0b3b8;">Loading...</div>
                </div>
                <div class="mm-reaction-footer">
                    <button class="mm-reaction-tab active">ALL</button>
                </div>`;
            view.onclick = (e) => { e.stopPropagation(); };
            view.classList.remove('hidden');
            setTimeout(() => view.classList.add('show'), 10);
            const s = await db.ref(`messages/${msgId}/reactions`).once('value');
            const listContent = document.getElementById('mm-reaction-list-content');
            if (!s.exists()) {
                listContent.innerHTML = '<p style="padding:20px;text-align:center;color:#b0b3b8">No reactions yet</p>';
                return;
            }
            const reactionData = s.val();
            const userIds = new Set();
            for (const users of Object.values(reactionData)) {
                Object.keys(users).forEach(uid => userIds.add(uid));
            }
            const userCache = {};
            const userPromises = Array.from(userIds).map(uid =>
                db.ref(`users/${uid}`).once('value').then(snap => {
                    userCache[uid] = snap.val() || {nickname:'Unknown', avatarUrl:''};
                })
            );
            await Promise.all(userPromises);
            let htmlRows = '';
            for (let [emoji, users] of Object.entries(reactionData)) {
                const sortedUids = Object.keys(users).sort((a, b) => {
                    const nameA = (userCache[a]?.nickname || '').toLowerCase();
                    const nameB = (userCache[b]?.nickname || '').toLowerCase();
                    return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
                });
                for (let uid of sortedUids) {
                    let uData = userCache[uid];
                    let isMe = (currentUser && uid === currentUser.uid);
                    let subtitle = isMe ? '<div class="mm-reaction-subtitle">Tap to remove</div>' : '';
                    let clickAction = isMe ? `onclick="event.stopPropagation(); triggerReaction('${msgId}', '${emoji}').then(() => showReactionList('${msgId}'))"` : '';
                    htmlRows += `<div class="mm-reaction-user-row" ${clickAction}>
                        <div class="mm-reaction-user-left">
                            <img src="${uData.avatarUrl}" class="mm-reaction-avatar">
                            <div>
                                <div class="mm-reaction-name">${uData.nickname}</div>
                                ${subtitle}
                            </div>
                        </div>
                        <span class="mm-reaction-emoji-display">${emoji}</span>
                    </div>`;
                }
            }
            listContent.innerHTML = htmlRows;
            listContent.style.cssText = "flex: 1; overflow-y: auto; padding: 10px 0;";
        } catch (error) {
            console.error("[Reaction] Error loading reactions:", error);
            alert("Failed to load reactions. Check console for details.");
        }
    };

    window.closeReactionModal = (event) => {
        if(event) { event.preventDefault(); event.stopPropagation(); }
        const view = document.getElementById('mm-reaction-view');
        if(view) { view.classList.remove('show'); setTimeout(() => view.classList.add('hidden'), 300); }
    };
    if(els.closeReactionView) els.closeReactionView.onclick = window.closeReactionModal;

    window.safeReply = (msgId, btnElement) => {
        const msgWrapper = btnElement.closest('.mm-msg');
        if (msgWrapper) {
            const cleanNickname = msgWrapper.getAttribute('data-nickname');
            const cleanText = msgWrapper.getAttribute('data-text');
            window.setReply(msgId, cleanNickname, cleanText);
        }
    };

    window.openDesktopReactionMenu = (event, msgId) => {
        event.stopPropagation();
        document.querySelectorAll('.mm-context-menu, .mm-reaction-popup').forEach(el => el.remove());
        const panel = document.getElementById('mm-panel');
        const msgEl = document.getElementById(`msg-${msgId}`);
        if (!panel || !msgEl) return;
        const bubble = msgEl.querySelector('.mm-msg-bubble') || msgEl.querySelector('.mm-msg-img');
        const rect = bubble.getBoundingClientRect();
        const menu = document.createElement('div');
        menu.className = 'mm-reaction-popup';
        const emojis = ['❤️', '😆', '😮', '😢', '😠', '👍'];
        menu.innerHTML = emojis.map(e => `<span class="mm-reaction-item" onclick="triggerReaction('${msgId}', '${e}'); this.parentElement.remove()">${e}</span>`).join('');
        document.body.appendChild(menu);
        const menuWidth = menu.offsetWidth || 230;
        let left = rect.left + (rect.width / 2) - (menuWidth / 2);
        let top = rect.top - 60;
        if (left < 10) left = 10;
        if (left + menuWidth > window.innerWidth) left = window.innerWidth - menuWidth - 20;
        if (top < 10) top = rect.bottom + 10;
        menu.style.top = `${top}px`;
        menu.style.left = `${left}px`;
        setTimeout(() => document.addEventListener('click', () => menu.remove(), { once: true }), 10);
    };

    window.openDesktopMenu = (event, msgId, ownerUid) => {
        event.preventDefault(); event.stopPropagation();
        document.querySelectorAll('.mm-context-menu, .mm-reaction-popup').forEach(el => el.remove());
        const btn = event.currentTarget;
        const rect = btn.getBoundingClientRect();
        const menu = document.createElement('div');
        menu.className = 'mm-context-menu';
        const isMe = (currentUser && currentUser.uid === ownerUid);
        if (isMe) {
            const btnUnsend = document.createElement('button');
            btnUnsend.className = 'mm-ctx-item delete';
            btnUnsend.innerHTML = '<i class="fas fa-trash"></i> Unsend';
            btnUnsend.onclick = () => { menu.remove(); if(confirm("Unsend?")) db.ref(`messages/${msgId}`).update({ deletedForAll: true }); };
            menu.appendChild(btnUnsend);
        }
        const btnReport = document.createElement('button');
        btnReport.className = 'mm-ctx-item';
        btnReport.innerHTML = '<i class="fas fa-flag"></i> Report';
        btnReport.onclick = () => { db.ref('reports').push({ msgId, reportedBy: currentUser.uid, timestamp: Date.now() }); alert('Report submitted.'); menu.remove(); };
        menu.appendChild(btnReport);
        document.body.appendChild(menu);
        let top = rect.bottom + 5;
        let left = rect.left - 100;
        if (left < 10) left = 10;
        menu.style.top = `${top}px`;
        menu.style.left = `${left}px`;
        setTimeout(() => document.addEventListener('click', () => menu.remove(), { once: true }), 10);
    };

    let mentionListEl = document.getElementById('mm-mention-list');
    if (!mentionListEl) {
        mentionListEl = document.createElement('div');
        mentionListEl.id = 'mm-mention-list';
        els.footer.appendChild(mentionListEl);
    }
    els.mentionList = mentionListEl;

} 
