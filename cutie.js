
const channels = {
  one_ph: {
    name: "One PH",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-04-prod.akamaized.net/out/u/oneph_sd.mpd",
    keyId: "92834ab4a7e1499b90886c5d49220e46",
    key: "a7108d9a6cfcc1b7939eb111daf09ab3",
    logo: "https://i.imgur.com/gkluDe9.png"
  },
  buko: {
    name: "BuKO",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_buko_sd.mpd",
    keyId: "d273c085f2ab4a248e7bfc375229007d",
    key: "7932354c3a84f7fc1b80efa6bcea0615",
    logo: "https://i.imgur.com/Wv0K5Yc.png"
  },
  sari_sari: {
    name: "SARI‑SARI",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_sari_sari_sd.mpd",
    keyId: "0a7ab3612f434335aa6e895016d8cd2d",
    key: "b21654621230ae21714a5cab52daeb9d",
    logo: "https://static.wikia.nocookie.net/russel/images/e/ec/Sari‑Sari_Channel_2D_Logo_2016.png"
  },
  ptv4: {
    name: "PTV4",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/cg_ptv4_sd.mpd",
    keyId: "71a130a851b9484bb47141c8966fb4a3",
    key: "ad1f003b4f0b31b75ea4593844435600",
    logo: "https://static.wikia.nocookie.net/russel/images/d/dc/PTV_4_Para_Sa_Bayan_Alternative_Logo_June_2017.png"
  },
  one_sports: {
    name: "One Sports",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/cg_onesports_hd.mpd",
    keyId: "53c3bf2eba574f639aa21f2d4409ff11",
    key: "3de28411cf08a64ea935b9578f6d0edd",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/One_Sports_logo.svg/2560px-One_Sports_logo.svg.png"
  },
  one_news: {
    name: "One News",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-04-prod.akamaized.net/out/u/onenews_hd1.mpd",
    keyId: "d39eb201ae494a0b98583df4d110e8dd",
    key: "6797066880d344422abd3f5eda41f45f",
    logo: "https://i.imgur.com/bpRiu54.png"
  },
  rptv: {
    name: "RPTV",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-03-prod.akamaized.net/out/u/cnn_rptv_prod_hd.mpd",
    keyId: "1917f4caf2364e6d9b1507326a85ead6",
    key: "a1340a251a5aa63a9b0ea5d9d7f67595",
    logo: "https://static.wikia.nocookie.net/russel/images/f/fb/RPTV_Alternative_Logo_2024.png"
  },
  tv5: {
    name: "TV5",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/tv5_hd.mpd",
    keyId: "2615129ef2c846a9bbd43a641c7303ef",
    key: "07c7f996b1734ea288641a68e1cfdc4d",
    logo: "https://static.wikia.nocookie.net/russel/images/7/7a/TV5_HD_Logo_2024.png"
  },
  a2z: {
    name: "A2Z",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/cg_a2z.mpd",
    keyId: "f703e4c8ec9041eeb5028ab4248fa094",
    key: "c22f2162e176eee6273a5d0b68d19530",
    logo: "https://static.wikia.nocookie.net/russel/images/8/85/A2Z_Channel_11_without_Channel_11_3D_Logo_2020.png"
  },
  bilyonaryo: {
    name: "Bilyonaryo Channel",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-05-prod.akamaized.net/out/u/bilyonaryoch.mpd",
    keyId: "227ffaf09bec4a889e0e0988704d52a2",
    key: "b2d0dce5c486891997c1c92ddaca2cd2",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcxvjeBIthYiEaZHeVeYpDicIlOTdv3G6lzoal3VM2xVzWu_J7XxM657oz&s=10"
  },
  tvn_movies_pinoy: {
    name: "tvN Movies Pinoy",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/cg_tvnmovie.mpd",
    keyId: "2e53f8d8a5e94bca8f9a1e16ce67df33",
    key: "3471b2464b5c7b033a03bb8307d9fa35",
    logo: "https://static.wikia.nocookie.net/russel/images/e/e3/TvN_Movies_Pinoy_Logo_2023.png"
  },
  pbo: {
    name: "PBO",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-04-prod.akamaized.net/out/u/pbo_sd.mpd",
    keyId: "dcbdaaa6662d4188bdf97f9f0ca5e830",
    key: "31e752b441bd2972f2b98a4b1bc1c7a1",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Pinoy_Box_Office_logo.svg/1200px-Pinoy_Box_Office_logo.svg.png"
  },
  viva_cinema: {
    name: "Viva Cinema",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/viva_sd.mpd",
    keyId: "07aa813bf2c147748046edd930f7736e",
    key: "3bd6688b8b44e96201e753224adfc8fb",
    logo: "https://static.wikia.nocookie.net/russel/images/2/2f/Viva_Cinema_%282021-.n.v.%29.png"
  },
  tmc: {
    name: "TMC",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/cg_tagalogmovie.mpd",
    keyId: "96701d297d1241e492d41c397631d857",
    key: "ca2931211c1a261f082a3a2c4fd9f91b",
    logo: "https://i.imgur.com/6mNCite.png"
  },
  tap_movies: {
    name: "Tap Movies",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_tapmovies_hd1.mpd",
    keyId: "71cbdf02b595468bb77398222e1ade09",
    key: "c3f2aa420b8908ab8761571c01899460",
    logo: "https://i.imgur.com/3RVA5mV.png"
  },
  hbo: {
    name: "HBO",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-03-prod.akamaized.net/out/u/cg_hbohd.mpd",
    keyId: "d47ebabf7a21430b83a8c4b82d9ef6b1",
    key: "54c213b2b5f885f1e0290ee4131d425b",
    logo: "https://images.now-tv.com/shares/channelPreview/img/en_hk/color/ch115_170_122"
  },
  disneyxdd: {
    name: "Disney XD",
    type: "clearkey",
    manifestUri:
      "https://a53aivottepl-a.akamaihd.net/pdx-nitro/live/clients/dash/enc/jts4tzzv1k/out/v1/8a5b29f7068c415aa371ea95743382e6/cenc.mpd",
    keyId: "39cebece8b36640f9ba3f248ecfdf86a",
    key: "fad936249e036830aa5bef41bec05326",
    logo: "https://logos-world.net/wp-content/uploads/2023/06/Disney-XD-Logo-2009.png",
  },

  disneyjr: {
    name: "Disney Jr.",
    type: "clearkey",
    manifestUri:
      "https://uselector.cdn.intigral-ott.net/DJR/DJR.isml/manifest.mpd",
    keyId: "f5df57914a0922d5d5ed6b0a4af6290a",
    key: "c62b10a180d1770a355b3c4cb6506ca0",
    logo: "https://www.pinpng.com/pngs/m/418-4182937_disney-junior-tv-logo-hd-png-download.png",
  },
  crave1: {
    name: "Crave 1",
    type: "clearkey",
    manifestUri:
      "https://live-crave.video.9c9media.com/137c6e2e72e1bf67b82614c7c9b216d6f3a8c8281748505659713/fe/f/crave/crave1/manifest.mpd",
    keyId: "4a107945066f45a9af2c32ea88be60f4",
    key: "df97e849d68479ec16e395feda7627d0",
    logo: "https://the-bithub.com/crave1",
  },
  crave2: {
    name: "Crave 2",
    type: "clearkey",
    manifestUri:
      "https://live-crave.video.9c9media.com/ab4332c60e19b6629129eeb38a2a6ac6db5df2571721750022187/fe/f/crave/crave2/manifest.mpd",
    keyId: "4ac6eaaf0e5e4f94987cbb5b243b54e8",
    key: "8bb3f2f421f6afd025fa46c784944ad6",
    logo: "https://the-bithub.com/crave",
  },
  
};





let currentChannelKey = "cnn"; // Set default channel (you can change it to any other channel key)

function renderChannelButtons(filter = "") {
  const list = document.getElementById("channelList");
  list.innerHTML = "";

  Object.entries(channels).forEach(([key, channel]) => {
    // ✅ Apply filter logic here
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
  });
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
  height: "100%",
  stretching: "exactfit"  // or "exactfit" if you want no black bars at all
});

  
  // Handle error (e.g., failed to load stream)
  player.on("error", function (err) {
    channelInfo.textContent = `${channel.name} is Unavailable...`;
    channelInfo.style.color = "#FF3333";
    console.error(`Error playing ${channel.name}:`, err.message || err);
  });
}

document.getElementById("search").addEventListener("input", function () {
  renderChannelButtons(this.value);
});

// Render the channel buttons and load the default channel
renderChannelButtons();
loadChannel(currentChannelKey); // Load the default channel automatically
