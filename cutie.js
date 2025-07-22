let currentChannelKey = "kapamilya"; // Default channel key

function renderChannelButtons(filter = "") {
  const list = document.getElementById("channelList");

  // ✅ Store current scroll position
  const scrollTop = list.scrollTop;

  list.innerHTML = "";

  const sortedChannels = Object.entries(channels).sort(([, a], [, b]) =>
    a.name.localeCompare(b.name)
  );

  let shownCount = 0;

  sortedChannels.forEach(([key, channel]) => {
    if (!channel.name.toLowerCase().includes(filter.toLowerCase())) return;

    const btn = document.createElement("button");
    btn.className = "channel-button";
    btn.innerHTML = `
      <img src="${channel.logo}" class="channel-logo" alt="${channel.name} logo">
      <span>${channel.name}</span>
    `;

    if (currentChannelKey === key) {
      btn.innerHTML += `<span style="color: #00FF00; font-weight: bold;">Now Playing...</span>`;
    }

    btn.onclick = () => loadChannel(key);
    list.appendChild(btn);
    shownCount++;
  });

  // ✅ Restore scroll position
  list.scrollTop = scrollTop;

  // ✅ Update channel count
  const countDisplay = document.getElementById("channelCountText");
  if (countDisplay) {
    countDisplay.textContent = `${shownCount} channel${shownCount !== 1 ? "s" : ""} found`;
  }
}

function loadChannel(key) {
  const channel = channels[key];
  currentChannelKey = key;
  renderChannelButtons();

  const channelInfo = document.getElementById("channelInfo");
  channelInfo.textContent = `${channel.name} is playing...`;
  channelInfo.style.color = "#00FF00";

  const drmConfig = {};
  if (channel.type === "widevine") {
    drmConfig.widevine = { url: channel.licenseServerUri };
  } else if (channel.type === "clearkey") {
    drmConfig.clearkey = {
      keyId: channel.keyId,
      key: channel.key,
    };
  }

  const player = jwplayer("video");

  player.setup({
    file: channel.manifestUri,
    type: channel.type === "hls" ? "hls" : "dash",
    drm: Object.keys(drmConfig).length ? drmConfig : undefined,
    autostart: true,
    width: "100%",
    aspectratio: "16:9",
    stretching: "fill",
  });

  player.on("error", function (err) {
    channelInfo.textContent = `${channel.name} is Unavailable...`;
    channelInfo.style.color = "#FF3333";
    console.error(`Error playing ${channel.name}:`, err.message || err);
  });
}

document.getElementById("search").addEventListener("input", function () {
  renderChannelButtons(this.value);
});

document.getElementById("search").value = "";
renderChannelButtons();
loadChannel(currentChannelKey);
