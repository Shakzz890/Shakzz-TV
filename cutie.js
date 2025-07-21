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
hbo_hits: {
  name: "HBO Hits",
  type: "clearkey",
  manifestUri: "https://qp-pldt-live-grp-09-prod.akamaized.net/out/u/cg_hbohits.mpd",
  keyId: "b04ae8017b5b4601a5a0c9060f6d5b7d",
  key: "a8795f3bdb8a4778b7e888ee484cc7a1",
  logo: "https://divign0fdw3sv.cloudfront.net/Images/ChannelLogo/contenthub/449_144.png"
},

dreamworks_tagalized: {
  name: "DreamWorks (Tagalized)",
  type: "clearkey",
  manifestUri: "https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/cg_dreamworktag.mpd",
  keyId: "564b3b1c781043c19242c66e348699c5",
  key: "d3ad27d7fe1f14fb1a2cd5688549fbab",
  logo: "https://i.imgur.com/cgfKSDP.png"
},

pba_rush: {
  name: "PBA RUSH",
  type: "clearkey",
  manifestUri: "https://qp-pldt-live-grp-01-prod.akamaized.net/out/u/cg_pbarush_hd1.mpd",
  keyId: "76dc29dd87a244aeab9e8b7c5da1e5f3",
  key: "95b2f2ffd4e14073620506213b62ac82",
  logo: "https://i.imgur.com/F2npB7o.png"
},

one_sports_plus: {
  name: "One Sports+",
  type: "clearkey",
  manifestUri: "https://qp-pldt-live-grp-03-prod.akamaized.net/out/u/cg_onesportsplus_hd1.mpd",
  keyId: "322d06e9326f4753a7ec0908030c13d8",
  key: "1e3e0ca32d421fbfec86feced0efefda",
  logo: "https://i.imgur.com/D33wRIq.png"
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
  tap_sports: {
    name: "Tap Sports",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_tapsports.mpd",
    keyId: "eabd2d95c89e42f2b0b0b40ce4179ea0",
    key: "0e7e35a07e2c12822316c0dc4873903f",
    logo: "https://i.imgur.com/ZsWDiRF.png"
  },
  tvup: {
    name: "TVUP!",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-09-prod.akamaized.net/out/u/tvup_prd.mpd",
    keyId: "83e813ccd4ca4837afd611037af02f63",
    key: "a97c515dbcb5dcbc432bbd09d15afd41",
    logo: "https://cms.cignal.tv/Upload/Images/TVUP%20Logo%20.png"
  },
  rock_action: {
    name: "Rock Action",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/dr_rockextreme.mpd",
    keyId: "0f852fb8412b11edb8780242ac120002",
    key: "4cbc004d8c444f9f996db42059ce8178",
    logo: "https://uploads-ssl.webflow.com/64e961c3862892bff815289d/64f57100366fe5c8cb6088a7_logo_ext_web.png"
  },
  tap_tv: {
    name: "Tap TV",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_taptv_sd.mpd",
    keyId: "f6804251e90b4966889b7df94fdc621e",
    key: "55c3c014f2bd12d6bd62349658f24566",
    logo: "https://i.imgur.com/KJaSftF.png"
  },
  knowledge_channel: {
    name: "Knowledge Channel",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/dr_knowledgechannel.mpd",
    keyId: "0f856fa0412b11edb8780242ac120002",
    key: "783374273ef97ad3bc992c1d63e091e7",
    logo: "https://i.imgur.com/UIqEr2y.png"
  },
  deped_tv: {
    name: "DepEd TV",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/depedch_sd.mpd",
    keyId: "0f853706412b11edb8780242ac120002",
    key: "2157d6529d80a760f60a8b5350dbc4df",
    logo: "https://static.wikia.nocookie.net/russel/images/f/f3/DepEd_TV_Logo_2020.png"
  },
  
  fashion_tv: {
    name: "Fashion TV",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_fashiontvhd.mpd",
    keyId: "971ebbe2d887476398e97c37e0c5c591",
    key: "472aa631b1e671070a4bf198f43da0c7",
    logo: "https://i.imgur.com/Zd5zm7C.png"
  },
  hbo_signature: {
    name: "HBO Signature",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-01-prod.akamaized.net/out/u/cg_hbosign.mpd",
    keyId: "a06ca6c275744151895762e0346380f5",
    key: "559da1b63eec77b5a942018f14d3f56f",
    logo: "https://i.imgur.com/t4HF5va.png"
  },
  tap_action_flix: {
    name: "Tap Action Flix",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_tapactionflix_hd1.mpd",
    keyId: "bee1066160c0424696d9bf99ca0645e3",
    key: "f5b72bf3b89b9848de5616f37de040b7",
    logo: "https://i.ibb.co/wgjPKFW/IMG-20241029-111906.png"
  },
  kix: {
    name: "KIX",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/kix_hd1.mpd",
    keyId: "a8d5712967cd495ca80fdc425bc61d6b",
    key: "f248c29525ed4c40cc39baeee9634735",
    logo: "https://i.imgur.com/B8Fmzer.png"
  },
  warner_tv: {
    name: "Warner TV",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_warnertvhd.mpd",
    keyId: "4503cf86bca3494ab95a77ed913619a0",
    key: "afc9c8f627fb3fb255dee8e3b0fe1d71",
    logo: "https://i.imgur.com/vGEL2Ne.png"
  },
  hits: {
    name: "HITS",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-04-prod.akamaized.net/out/u/hits_hd1.mpd",
    keyId: "dac605bc197e442c93f4f08595a95100",
    key: "975e27ffc1b7949721ee3ccb4b7fd3e5",
    logo: "https://i.imgur.com/YeqyD9W.png"
  },
  tvn_premium: {
    name: "tvN Premium",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-09-prod.akamaized.net/out/u/cg_tvnpre.mpd",
    keyId: "e1bde543e8a140b38d3f84ace746553e",
    key: "b712c4ec307300043333a6899a402c10",
    logo: "https://i.imgur.com/eE9IBhJ.png"
  },
  history: {
    name: "History",
    logo: "https://cantseeus.com/wp-content/uploads/2023/10/History_28201529.png",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_historyhd.mpd",
    keyId: "a7724b7ca2604c33bb2e963a0319968a",
    key: "6f97e3e2eb2bade626e0281ec01d3675"
  },
  bbcearth: {
    name: "BBC Earth",
    logo: "https://imgur.com/QMB9sFW.png",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-03-prod.akamaized.net/out/u/cg_bbcearth_hd1.mpd",
    keyId: "34ce95b60c424e169619816c5181aded",
    key: "0e2a2117d705613542618f58bf26fc8e"
  },
  uaap: {
    name: "UAAP Varsity Channel",
    logo: "https://i.imgur.com/V0sxXci.png",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-04-prod.akamaized.net/out/u/cg_uaap_cplay_sd.mpd",
    keyId: "95588338ee37423e99358a6d431324b9",
    key: "6e0f50a12f36599a55073868f814e81e"
  },
  truefm: {
    name: "TrueFM TV",
    logo: "https://upload.wikimedia.org/wikipedia/en/4/40/Radyo5truefmlogo.webp",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-08-prod.akamaized.net/out/u/truefm_tv.mpd",
    keyId: "0559c95496d44fadb94105b9176c3579",
    key: "40d8bb2a46ffd03540e0c6210ece57ce"
  },
  tvMaria: {
    name: "TV Maria",
    logo: "https://static.wikia.nocookie.net/logopedia/images/c/cd/TV_MARIA_PH.png/revision/latest?cb=20200421061144",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/tvmaria_prd.mpd",
    keyId: "fa3998b9a4de40659725ebc5151250d6",
    key: "998f1294b122bbf1a96c1ddc0cbb229f"
  },
  hbofamily: {
    name: "HBO Family",
    logo: "https://divign0fdw3sv.cloudfront.net/Images/ChannelLogo/contenthub/450_144.png",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-03-prod.akamaized.net/out/u/cg_hbofam.mpd",
    keyId: "872910c843294319800d85f9a0940607",
    key: "f79fd895b79c590708cf5e8b5c6263be"
  },
  rockentertainment: {
    name: "Rock Entertainment",
    logo: "https://i.imgur.com/fx1Y2Eh.png",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/dr_rockentertainment.mpd",
    keyId: "e4ee0cf8ca9746f99af402ca6eed8dc7",
    key: "be2a096403346bc1d0bb0f812822bb62"
  },
  spotv: {
    name: "SPOTV",
    logo: "https://linear-poster.astro.com.my/prod/logo/SPOTV.png",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_spotvhd.mpd",
    keyId: "ec7ee27d83764e4b845c48cca31c8eef",
    key: "9c0e4191203fccb0fde34ee29999129e"
  },
  spotv2: {
    name: "SPOTV2",
    logo: "https://linear-poster.astro.com.my/prod/logo/SPOTV2.png",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/dr_spotv2hd.mpd",
    keyId: "7eea72d6075245a99ee3255603d58853",
    key: "6848ef60575579bf4d415db1032153ed"
  },
  premierSports2: {
    name: "Premier Sports 2",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/dr_premiertennishd.mpd",
    keyId: "59454adb530b4e0784eae62735f9d850",
    key: "61100d0b8c4dd13e4eb8b4851ba192cc",
    logo: "https://static.wikia.nocookie.net/logopedia/images/5/59/PremierSports2_logo.png/revision/latest/scale-to-width-down/250?cb=20220528091432"
  },
  nbaTvPh: {
    name: "NBA TV Philippines",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/pl_nba.mpd",
    keyId: "f36eed9e95f140fabbc88a08abbeafff",
    key: "0125600d0eb13359c28bdab4a2ebe75a",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/NBA_TV.svg/1200px-NBA_TV.svg.png"
  },
  cinemax: {
    name: "Cinemax",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-01-prod.akamaized.net/out/u/cg_cinemax.mpd",
    keyId: "b207c44332844523a3a3b0469e5652d7",
    key: "fe71aea346db08f8c6fbf0592209f955",
    logo: "https://divign0fdw3sv.cloudfront.net/Images/ChannelLogo/contenthub/337_144.png"
  },
  lifetime: {
    name: "Lifetime",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_lifetime.mpd",
    keyId: "cf861d26e7834166807c324d57df5119",
    key: "64a81e30f6e5b7547e3516bbf8c647d0",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_Lifetime_2020.svg/2560px-Logo_Lifetime_2020.svg.png"
  },
  foodNetwork: {
    name: "Food Network",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-09-prod.akamaized.net/out/u/cg_foodnetwork_hd1.mpd",
    keyId: "b7299ea0af8945479cd2f287ee7d530e",
    key: "b8ae7679cf18e7261303313b18ba7a14",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Food_Network_logo.svg/1200px-Food_Network_logo.svg.png"
  },
  axn: {
    name: "AXN",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_axn_sd.mpd",
    keyId: "fd5d928f5d974ca4983f6e9295dfe410",
    key: "3aaa001ddc142fedbb9d5557be43792f",
    logo: "http://linear-poster.astro.com.my/prod/logo/AXN_v1.png"
  },
  abcAustralia: {
    name: "ABC Australia",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-10-prod.akamaized.net/out/u/dr_abc_aus.mpd",
    keyId: "389497f9f8584a57b234e27e430e04b7",
    key: "3b85594c7f88604adf004e45c03511c0",
    logo: "https://i.imgur.com/kVVax44.png"
  },
  travelChannel: {
    name: "Travel Channel",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-08-prod.akamaized.net/out/u/travel_channel_sd.mpd",
    keyId: "f3047fc13d454dacb6db4207ee79d3d3",
    key: "bdbd38748f51fc26932e96c9a2020839",
    logo: "https://i.imgur.com/ZCYeUV2.png"
  },
  bloomberg: {
    name: "Bloomberg",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-09-prod.akamaized.net/out/u/bloomberg_sd.mpd",
    keyId: "ef7d9dcfb99b406cb79fb9f675cba426",
    key: "b24094f6ca136af25600e44df5987af4",
    logo: "https://poster.starhubgo.com/Linear_channels2/708_1920x1080_HTV.png"
  },
  bbc_news: {
    name: "BBC News",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-04-prod.akamaized.net/out/u/bbcworld_news_sd.mpd",
    keyId: "f59650be475e4c34a844d4e2062f71f3",
    key: "119639e849ddee96c4cec2f2b6b09b40",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/BBC_News_2022_%28Alt%29.svg/1200px-BBC_News_2022_%28Alt%29.svg.png"
  },
  cartoon_network: {
    name: "Cartoon Network",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-12-prod.akamaized.net/out/u/dr_cartoonnetworkhd.mpd",
    keyId: "a2d1f552ff9541558b3296b5a932136b",
    key: "cdd48fa884dc0c3a3f85aeebca13d444",
    logo: "https://poster.starhubgo.com/Linear_channels2/316_1920x1080_HTV.png"
  },
  dreamworks: {
    name: "DreamWorks",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/cg_dreamworks_hd1.mpd",
    keyId: "4ab9645a2a0a47edbd65e8479c2b9669",
    key: "8cb209f1828431ce9b50b593d1f44079",
    logo: "https://i.imgur.com/cgfKSDP.png"
  },
  hits_now: {
    name: "HITS Now",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-09-prod.akamaized.net/out/u/cg_hitsnow.mpd",
    keyId: "14439a1b7afc4527bb0ebc51cf11cbc1",
    key: "92b0287c7042f271b266cc11ab7541f1",
    logo: "https://aqfadtv.xyz/logos/HITSNow.png"
  },
  moonbug_kids: {
    name: "Moonbug",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_moonbug_kids_sd.mpd",
    keyId: "0bf00921bec94a65a124fba1ef52b1cd",
    key: "0f1488487cbe05e2badc3db53ae0f29f",
    logo: "https://aqfadtv.xyz/logos/Moonbug.png"
  },
  cnn_ph: {
    name: "CNN Philippines",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-grp-03-prod.akamaized.net/out/u/cg_cnnhd.mpd",
    keyId: "900c43f0e02742dd854148b7a75abbec",
    key: "da315cca7f2902b4de23199718ed7e90",
    logo: "https://i.imgur.com/JOg1GGl.png"
  },
// Converge Stream
  kapamilya_sd: {
    name: "Kapamilya Channel",
    type: "widevine",
    manifestUri: "http://143.44.136.110:6910/001/2/ch00000090990000001248/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseUri: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Kapamilya_Channel_Logo_2020.svg/2560px-Kapamilya_Channel_Logo_2020.svg.png"
  },
  kapamilya_hd: {
    name: "Kapamilya Channel HD",
    type: "widevine",
    manifestUri: "http://143.44.136.110:6910/001/2/ch00000090990000001286/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseUri: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Kapamilya_Channel_Logo_2020.svg/2560px-Kapamilya_Channel_Logo_2020.svg.png"
  },
  pbo: {
    name: "PBO",
    type: "widevine",
    manifestUri: "http://143.44.136.113:6910/001/2/ch00000090990000001078/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseUri: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Pinoy_Box_Office_logo.svg/1200px-Pinoy_Box_Office_logo.svg.png"
  },
  dzmm: {
    name: "DZMM Teleradyo",
    type: "widevine",
    manifestUri: "http://143.44.136.110:6910/001/2/ch00000090990000001249/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseUri: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/DZMM_TeleRadyo.svg/1200px-DZMM_TeleRadyo.svg.png"
  },
  anc: {
    name: "ANC",
    type: "widevine",
    manifestUri: "http://143.44.136.110:6910/001/2/ch00000090990000001274/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseUri: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://i.imgur.com/Bcu69bU.png"
  },
  myx: {
    name: "MYX Philippines",
    type: "widevine",
    manifestUri: "http://143.44.136.111:6910/001/2/ch00000090990000001252/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseUri: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://i.imgur.com/CIPTNnT.png"
  },
  gma7: {
    name: "GMA 7",
    type: "widevine",
    manifestUri: "http://143.44.136.110:6910/001/2/ch00000090990000001093/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseUri: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://i.imgur.com/Cu1tAY8.png"
  },
  gtv: {
    name: "GTV",
    type: "widevine",
    manifestUri: "http://143.44.136.110:6910/001/2/ch00000090990000001143/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseUri: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://i.imgur.com/geuq18u.png"
  },
  all_tv: {
    name: "ALL TV",
    type: "widevine",
    manifestUri: "http://143.44.136.110:6910/001/2/ch00000090990000001179/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseUri: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://brandlogo.org/wp-content/uploads/2024/05/All-TV-Logo-300x300.png.webp"
  },
  bilyonaryo: {
    name: "Bilyonaryo Channel",
    type: "widevine",
    manifestUri: "http://143.44.136.111:6910/001/2/ch00000090990000001124/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseUri: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcxvjeBIthYiEaZHeVeYpDicIlOTdv3G6lzoal3VM2xVzWu_J7XxM657oz&s=10"
  },
  tv5: {
    name: "TV5",
    type: "widevine",
    manifestUri: "http://143.44.136.111:6910/001/2/ch00000090990000001088/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseUri: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://static.wikia.nocookie.net/russel/images/7/7a/TV5_HD_Logo_2024.png/revision/latest/scale-to-width-down/290?cb=20240202141126"
  },
  a2z: {
    name: "A2Z",
    type: "widevine",
    manifestUri: "http://143.44.136.113:6910/001/2/ch00000090990000001087/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseUri: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://static.wikia.nocookie.net/russel/images/8/85/A2Z_Channel_11_without_Channel_11_3D_Logo_2020.png/revision/latest?cb=20231101144828"
  },
  net25: {
    name: "NET 25",
    type: "widevine",
    manifestUri: "http://143.44.136.111:6910/001/2/ch00000090990000001090/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseUri: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://i.imgur.com/pPPubX5.png"
  },
  ibc13: {
    name: "IBC 13",
    type: "widevine",
    manifestUri: "http://143.44.136.111:6910/001/2/ch00000090990000001089/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseUri: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://static.wikia.nocookie.net/logopedia/images/f/f5/IBC_13_Logo_2012.png/revision/latest?cb=20170830080345"
  },
  untv: {
    name: "UNTV",
    type: "widevine",
    manifestUri: "http://143.44.136.111:6910/001/2/ch00000090990000001091/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseUri: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/99/UNTV-Logo-2016.svg/300px-UNTV-Logo-2016.svg.png"
  },
  ptv4: {
    name: "PTV4",
    type: "widevine",
    manifestUri: "http://143.44.136.113:6910/001/2/ch00000090990000001086/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseServer: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://static.wikia.nocookie.net/russel/images/d/dc/PTV_4_Para_Sa_Bayan_Alternative_Logo_June_2017.png/revision/latest?cb=20171019065428"
  },
  dzrh: {
    name: "DZRH TV",
    type: "widevine",
    manifestUri: "http://143.44.136.110:6910/001/2/ch00000090990000001174/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseServer: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://static.wikia.nocookie.net/russel/images/6/62/DZRH_TV_Logo_November_2021.png/revision/latest?cb=20211215134648"
  },
  knowledge_channel: {
    name: "Knowledge Channel",
    type: "widevine",
    manifestUri: "http://143.44.136.110:6910/001/2/ch00000090990000001340/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseServer: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://i.imgur.com/UIqEr2y.png"
  },
  aliw_channel: {
    name: "Aliw Channel",
    type: "widevine",
    manifestUri: "http://143.44.136.110:6910/001/2/ch00000090990000001109/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseServer: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://upload.wikimedia.org/wikipedia/en/b/b9/Aliw_Channel_23_logo.png"
  },
  cltv36: {
    name: "CLTV 36",
    type: "widevine",
    manifestUri: "http://143.44.136.110:6910/001/2/ch00000090990000001314/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseServer: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://static.wikia.nocookie.net/logopedia/images/4/48/Cl_tv_36_ph.png/revision/latest?cb=20130823135759"
  },
  rjtv: {
    name: "RJTV",
    type: "widevine",
    manifestUri: "http://143.44.136.110:6910/001/2/ch00000090990000001338/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseServer: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://static.wikia.nocookie.net/russel/images/8/82/DZRJ_810_AM_TV_Logo_2022.png/revision/latest/scale-to-width-down/300?cb=20250102143126"
  },
  rjtv29: {
    name: "RJTV 29",
    type: "widevine",
    manifestUri: "http://143.44.136.110:6910/001/2/ch00000090990000001159/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseServer: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://static.wikia.nocookie.net/logopedia/images/5/59/Screenshot_2019-08-30_at_5.25.09_PM.png"
  },
  gnn: {
    name: "GNN",
    type: "widevine",
    manifestUri: "http://143.44.136.110:6910/001/2/ch00000090990000001234/manifest.mpd?virtualDomain=001.live_hls.zte.com",
    licenseServer: "http://143.44.136.74:9443/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/27/GNN_Logo_2025.png"
  }

};



let currentChannelKey = Object.keys(channels)[0]; // Default to the first channel

function renderChannelButtons(filter = "") {
  const list = document.getElementById("channelList");
  list.innerHTML = "";

  Object.entries(channels).forEach(([key, channel]) => {
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
    drmConfig.widevine = { url: channel.licenseServer };
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
    stretching: "exactfit"
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

renderChannelButtons();
loadChannel(currentChannelKey);
