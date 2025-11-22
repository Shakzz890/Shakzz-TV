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

// --- LOADER UTILITY ---
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
        if(msgEl) msgEl.textContent = msg;
        return loader;
    },
    hide: () => {
        const loader = document.getElementById('cutieGlobalLoader');
        if (loader) loader.remove();
    },
    error: (msg) => {
        CutieLoader.show(`Error: ${msg}`);
        const spinner = document.querySelector('.cutie-spinner');
        if(spinner) spinner.style.display = 'none';
        const retry = document.getElementById('cutieRetryBtn');
        if(retry) {
            retry.onclick = () => location.reload();
            retry.classList.remove('cutie-hide');
        }
    }
};

// --- GLOBAL VARIABLES ---
const DEFAULT_CHANNEL_ID = "Kapamilya";
let shownCount = 0;
let currentSearchFilter = "";
let currentChannelKey = ""; 
const tabs = ["all", "favorites", "news", "entertainment", "movies", "sports", "documentary", "cartoons & animations"];
let currentTabIndex = 0;
let sortedChannels = [];
let focusedElement = null; 
let viewerInterval = null;
let notificationInterval = null;
let maintenanceInterval = null;

// --- VALIDATION ---
function validateRequirements() {
    const errors = [];
    if (typeof channels === 'undefined') errors.push("Channels data not loaded");
    else if (!channels || Object.keys(channels).length === 0) errors.push("Channels object is empty");
    if (!document.getElementById('channelList')) errors.push("#channelList missing");
    if (!document.getElementById('video')) errors.push("#video missing");
    return errors;
}

// --- 1. MAINTENANCE SYSTEM ---
function setupMaintenanceMode() {
    const CHECK_INTERVAL = 5000;
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
                        console.warn("⛔ MAINTENANCE MODE ACTIVE");
                        window.stop(); // Stop loading
                        if (window.jwplayer) { try { jwplayer().stop(); jwplayer().remove(); } catch (e) {} }
                        if (viewerInterval) clearInterval(viewerInterval);
                        if (notificationInterval) clearInterval(notificationInterval);
                        
                        // Hide UI
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
            } catch (error) {
                // Silent fail
            }
            resolve();
        }
        
        checkStatus().then(resolve);
        maintenanceInterval = setInterval(checkStatus, CHECK_INTERVAL);
    });
}

// --- 2. SCROLL REVEAL ---
function setupScrollReveal() {
    if(document.getElementById('maintenanceOverlay')?.classList.contains('active')) return;
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

// --- 3. HELPER FUNCTIONS ---
function resetChannelListScroll() {
    const scrollableListContainer = document.querySelector(".scrollable-list");
    if (scrollableListContainer) scrollableListContainer.scrollTop = 0;
}

function getOrCreateDeviceId() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = window.crypto?.randomUUID?.() || 'xxxxxxxx'.replace(/[xy]/g, c => (Math.random()*16|0).toString(16));
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

// --- 4. VIEWER COUNT ---
async function updateViewerCount() {
    if(document.getElementById('maintenanceOverlay')?.classList.contains('active')) return;
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 3000);
    try {
        const deviceId = getOrCreateDeviceId();
        const res = await fetch(`/api/viewers?deviceId=${deviceId}`, { signal: controller.signal });
        const data = await res.json();
        const viewerCountEl = document.getElementById('viewerCountText');
        if (viewerCountEl) viewerCountEl.innerText = data.count || 0;
    } catch (e) { }
}

// --- 5. FAVORITES ---
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

// --- 6. CHANNEL RENDERING ---
function renderChannelButtons(filter = "") {
    currentSearchFilter = filter;
    const list = document.getElementById("channelList");
    if (!list) {
        CutieLoader.error("Channel list element missing");
        return;
    }
    
    setTimeout(removeSkeletonLoader, 800);

    if (typeof channels === 'undefined') {
        list.innerHTML = `<div class="cutie-error-msg">Error: channels data not loaded.</div>`;
        return;
    }
    
    if (sortedChannels.length === 0) {
        list.innerHTML = `<div class="cutie-error-msg">No channels available.</div>`;
        return;
    }
    
    list.innerHTML = "";
    shownCount = 0;
    const selectedGroup = tabs[currentTabIndex];
    const fragment = document.createDocumentFragment();

    sortedChannels.forEach(([key, channel]) => {
        const group = channel.group || "live";
        const matchesSearch = channel.name.toLowerCase().includes(filter.toLowerCase());
        const matchesFavorites = (selectedGroup === "favorites") ? channel.favorite === true : true;
        const matchesGroup = selectedGroup === "all" || selectedGroup === "favorites" || 
                            (Array.isArray(group) ? group.includes(selectedGroup) : group === selectedGroup);

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
        if(btn) btn.style.display = (selectedGroup === "favorites" && shownCount > 0) ? "block" : "none"; 
    });
}

// --- 7. LOAD CHANNEL (MERGED LOGIC) ---
async function loadChannel(key) {
    if (typeof channels === 'undefined') return;
    const channel = channels[key];
    if (!channel) return;
    
    currentChannelKey = key;
    localStorage.setItem("lastPlayedChannel", key);
    
    document.querySelectorAll('.channel-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-key') === key) btn.classList.add('active');
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

    const drmConfig = {};
    let playerType = "hls"; 

    // --- WORKER KEY FETCHING LOGIC ---
    if (channel.type === "clearkey") {
        playerType = "dash";
        try {
            const keyUrl = channel.manifestUri + "&req=key";
            const response = await fetch(keyUrl);
            const keyData = await response.json();
            if (keyData.keyId && keyData.key) {
                drmConfig.clearkey = { 
                    keyId: keyData.keyId, 
                    key: keyData.key 
                };
            } 
        } catch (err) {
            console.error("Failed to fetch keys from proxy:", err);
        }
    } 
    else if (channel.type === "widevine") {
        drmConfig.widevine = { url: channel.licenseServerUri };
        playerType = "dash";
    } else if (channel.type === "dash") {
        playerType = "dash";
    } else if (channel.type === "mp4") { 
        playerType = "mp4";
    }

    if (window.jwplayer) {
        const videoSkeleton = document.querySelector('#video .skeleton');
        if(videoSkeleton) videoSkeleton.style.display = 'none';
        
        try {
            jwplayer("video").setup({
                file: channel.manifestUri,
                type: playerType, 
                drm: Object.keys(drmConfig).length ? drmConfig : undefined,
                autostart: true,
                width: "100%",
                aspectratio: "16:9",
                stretching: "exactfit",
            });
        } catch(e) {
            console.error("JW Player setup failed:", e);
        }
    }
}

// --- 8. UI SETUP ---
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
                
                if(isMobile) {
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
    if(mobBtn) {
        mobBtn.addEventListener('click', () => {
            document.getElementById('categoryModal')?.classList.add('active');
            setTimeout(() => { const first = document.querySelector('#mobileCategoryList .focusable-element'); if(first) setTvFocus(first); }, 100);
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
                const firstLink = document.querySelector('#navPages a:first-child'); 
                if (firstLink) setTvFocus(firstLink); 
            }, 100);
        } else {
            clearTvFocus();
        }
    });
    
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('mobile-menu-active');
            clearTvFocus();
            
            if (targetElement) {
                const headerHeight = document.querySelector('.page-header')?.offsetHeight || 0;
                window.scrollTo({ top: targetElement.offsetTop - headerHeight, behavior: 'smooth' });
            } else if (targetId === "#main-content-area") {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

function setupWelcomeModal() {
    if (sessionStorage.getItem('welcomeModalShown')) return;
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
    modal.classList.add('active');
    startCountdown();
    setTimeout(() => { setTvFocus(closeBtn); }, 100);
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
        setTimeout(() => setTvFocus(closeQrModalBtn), 50);
    });
    
    closeQrModalBtn.addEventListener('click', () => { 
        qrModal.classList.remove('active'); 
        clearTvFocus(); 
    });
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
    const SESSION_KEY = 'notificationClosed';
    let currentNotificationId = null;

    if (!banner) return;

    closeBtn.addEventListener('click', () => {
        banner.classList.remove('show');
        banner.classList.add('hide');
        sessionStorage.setItem(SESSION_KEY, currentNotificationId || 'true');
    });

    async function fetchNotification() {
        if (document.getElementById('maintenanceOverlay')?.classList.contains('active') || 
            document.getElementById('welcomeModal')?.classList.contains('active')) return;

        const controller = new AbortController();
        setTimeout(() => controller.abort(), 2000);
        
        try {
            const response = await fetch(`${NOTIFICATION_URL}?t=${Date.now()}`, { signal: controller.signal });
            if (!response.ok) return;
            
            const data = await response.json();
            const lastClosed = sessionStorage.getItem(SESSION_KEY);
            const shouldShow = data.show && (lastClosed !== data.id);
            currentNotificationId = data.id;
            
            if (shouldShow) {
                msgEl.innerHTML = data.message;
                banner.classList.remove('info', 'success', 'alert', 'hide');
                banner.classList.add(data.type || 'alert');
                banner.style.display = 'flex';
                setTimeout(() => banner.classList.add('show'), 10);
                setTimeout(() => { 
                    banner.classList.remove('show'); 
                    banner.classList.add('hide'); 
                }, 8000);
            }
        } catch (error) {}
    }

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

// --- 9. TV REMOTE LOGIC (SPATIAL) ---
function getFocusableElements() {
    const elements = document.querySelectorAll('.focusable-element:not([style*="display: none"]):not([disabled]):not([hidden]):not([aria-hidden="true"])');
    return Array.from(elements).filter(el => {
        const style = window.getComputedStyle(el);
        return style.visibility !== 'hidden' && style.opacity !== '0' && style.display !== 'none';
    });
}

function setTvFocus(el) {
    if (focusedElement) focusedElement.classList.remove('tv-focus');
    focusedElement = el;
    if (focusedElement) {
        focusedElement.classList.add('tv-focus');
        focusedElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
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
            // Weighting
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
        const isInputActive = document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA';

        if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'Back' || e.key === 'Exit') {
            if (e.key === 'Backspace' && isInputActive) return; 
            e.preventDefault(); 
            if(document.getElementById('qrModal')?.classList.contains('active')) { document.getElementById('closeQrModalBtn').click(); return; }
            if(document.getElementById('categoryModal')?.classList.contains('active')) { document.getElementById('closeCategoryModal').click(); return; }
            if(document.getElementById('navPages')?.classList.contains('active')) { document.getElementById('hamburger').click(); return; }
            if(document.getElementById('welcomeModal')?.classList.contains('active')) { document.getElementById('closeModalBtn').click(); return; }
            if (window.scrollY > 0) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        }

        let direction = null;
        switch (e.key) {
            case 'ArrowUp': direction = 'up'; break;
            case 'ArrowDown': direction = 'down'; break;
            case 'ArrowLeft': direction = 'left'; break;
            case 'ArrowRight': direction = 'right'; break;
            case 'Enter': 
                if (focusedElement) {
                    focusedElement.click();
                    if(focusedElement.tagName === 'INPUT') focusedElement.focus();
                    e.preventDefault();
                }
                return;
        }

        if (direction) {
            e.preventDefault(); 
            const nextElement = findNextSpatialFocus(direction);
            if (nextElement) setTvFocus(nextElement);
        }
    });
    
    window.addEventListener('load', () => {
        const searchInput = document.getElementById('search');
        if (searchInput) setTvFocus(searchInput);
    });
}

// --- 11. MAIN INITIALIZATION (FIXED) ---
document.addEventListener('DOMContentLoaded', async () => {
    if(typeof CutieLoader !== 'undefined') CutieLoader.show("Initializing Shakzz TV...");
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
        viewerInterval = setInterval(updateViewerCount, 5000);
        
        if(typeof CutieLoader !== 'undefined') CutieLoader.hide();
        console.log("✅ Cutie.js initialization complete");

    } catch (error) {
        console.error("❌ Cutie.js initialization failed:", error);
        removeSkeletonLoader();
        if(typeof CutieLoader !== 'undefined') CutieLoader.error(error.message || "Failed to load.");
    }
});
