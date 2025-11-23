const WORKER_URL = "https://stream.shakzz.workers.dev/"; 

const channels = {
  thrill: {
    name: "Thrill",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=thrill`,
    logo: "https://i.imgur.com/kgqsalZ.png",
    group: ["movies"]
  },
  animex: {
    name: "AnimeX",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=animex`,
    logo: "https://logomakerr.ai/uploads/output/2023/08/01/8d87f4803925f46fcdb6b9ae8a1e6244.jpg",
    group: ["cartoons & animations"]
  },
  PBBMain: {
    name: "PBB Main",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=PBBMain`,
    logo: "https://i.imgur.com/n5rdR3v.png",
    group: ["entertainment"]
  },
  PBBDiningArea: {
    name: "PBB Dining Area",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=PBBDiningArea`,
    logo: "https://i.imgur.com/n5rdR3v.png",
    group: ["entertainment"]
  },
  PBBPoolArea: {
    name: "PBB Pool Area",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=PBBPoolArea`,
    logo: "https://i.imgur.com/n5rdR3v.png",
    group: ["entertainment"]
  },
  discoveryscience: {
    name: "Discovery Science",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=discoveryscience`,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkA_8vr9UZUhtkaFi6AshM83zQwhPWBGWX-Q&s",
    group: ["documentary"]
  },
  KidoodleTV: {
    name: "Kidoodle TV",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=KidoodleTV`,
    logo: "https://d1iiooxwdowqwr.cloudfront.net/pub/appsubmissions/20201230211817_FullLogoColor4x.png",
    group: ["cartoons & animations"]
  },
  StrawberryShortcake: {
    name: "Strawberry Shortcake",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=StrawberryShortcake`,
    logo: "https://upload.wikimedia.org/wikipedia/en/f/ff/Strawberry_Shortcake_2003_Logo.png",
    group: ["cartoons & animations"]
  },
  SonictheHedgehog: {
    name: "Sonic the Hedgehog",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=SonictheHedgehog`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Sonic_The_Hedgehog.svg/1200px-Sonic_The_Hedgehog.svg.png",
    group: ["cartoons & animations"]
  },
  SuperMario: {
    name: "Super Mario",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=SuperMario`,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFkMkkUmZBGslGWGZMN2er5emlnqGCCU49wg&s",
    group: ["cartoons & animations"]
  },
  Teletubbies: {
    name: "Teletubbies",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=Teletubbies`,
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Teletubbies_Logo.png/330px-Teletubbies_Logo.png",
    group: ["cartoons & animations"]
  },
  anione: {
    name: "Ani One",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=anione`,
    logo: "https://www.medialink.com.hk/img/ani-one-logo.jpg",
    group: ["cartoons & animations"]
  },
  jeepneytv: {
    name: "Jeepney TV",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=jeepneytv`,
    logo: "https://upload.wikimedia.org/wikipedia/en/1/15/Jeepney_TV_Logo_2015.svg",
    group: ["entertainment"]
  },
  aniplus: {
    name: "Aniplus",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=aniplus`,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJj494OpI0bKrTrvcHqEkzMYzqtfLNdWjQrg&s",
    group: ["cartoons & animations"]
  },
  sinemanila: {
    name: "SineManila",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=sinemanila`,
    logo: "https://raw.githubusercontent.com/Shakzz890/LoidForger/main/SineManila.png",
    group: ["movies", "entertainment"]
  },
  pbarush: {
    name: "PBA Rush",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=pbarush`,
    logo: "https://static.wikia.nocookie.net/russel/images/0/00/PBA_Rush_Logo_2016.png/revision/latest/scale-to-width-down/250?cb=20250217140355",
    group: ["entertainment"]
  },
  animalplanet: {
    name: "Animal Planet",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=animalplanet`,
    logo: "https://i.imgur.com/SkpFpW4.png",
    group: ["documentary"]
  },
  discoverychannel: {
    name: "Discovery Channel",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=discoverychannel`,
    logo: "https://i.imgur.com/XsvAk5H.png",
    group: ["documentary"]
  },
  nickelodeon: {
    name: "Nickelodeon",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=nickelodeon`,
    logo: "https://i.imgur.com/4o5dNZA.png",
    group: ["cartoons & animations"]
  },
  nickjr: {
    name: "Nick Jr",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=nickjr`,
    logo: "https://i.imgur.com/iIVYdZP.png",
    group: ["cartoons & animations"]
  },
  pbo: {
    name: "PBO",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=pbo`,
    logo: "https://i.imgur.com/550RYpJ.png",
    group: ["movies", "entertainment"]
  },
  angrybirds: {
    name: "Angry Birds",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=angrybirds`,
    logo: "https://www.pikpng.com/pngl/m/83-834869_angry-birds-theme-angry-birds-game-logo-png.png",
    group: ["cartoons & animations"]
  },
  zoomooasia: {
    name: "Zoo Moo Asia",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=zoomooasia`,
    logo: "https://ia803207.us.archive.org/32/items/zoo-moo-kids-2020_202006/ZooMoo-Kids-2020.png",
    group: ["cartoons & animations", "entertainment"]
  },
  mrbeanlive: {
    name: "MR Bean Live Action",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=mrbeanlive`,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdSj6OHTQv9_53OX9ZwSjCqOTkYj5dDUZUW0irJhXranWx7zI1YhEIwg&s=10",
    group: ["cartoons & animations", "entertainment"]
  },
  iQIYI: {
    name: "iQIYI",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=iQIYI`,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs3X1_D_GkWQbMiZzbmaoFets_gAeM6zKGhvtuAD7y46OH9zcqWCnLoG3K&s=10",
    group: ["entertainment"]
  },
  tv5: {
    name: "TV 5 HD",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=tv5`,
    logo: "https://vignette.wikia.nocookie.net/russel/images/f/f9/TV5_Logo_2011.png/revision/latest?cb=20161204035016",
    group: ["news", "entertainment"]
  },
  Kapamilya: {
    name: "Kapamilya Channel HD",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=Kapamilya`,
    logo: "https://cms.cignal.tv/Upload/Images/Kapamilya Channel Logo alpha.png",
    group: ["news", "entertainment"]
  },
  hbo: {
    name: "HBO",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=hbo`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/de/HBO_logo.svg",
    group: ["movies"]
  },
  hbofam: {
    name: "HBO Family",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=hbofam`,
    logo: "https://www.pikpng.com/pngl/m/41-419283_hbo-family-logo-hbo-family-logo-png-clipart.png",
    group: ["movies"]
  },
  hbohits: {
    name: "HBO Hits",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=hbohits`,
    logo: "https://cms.cignal.tv/Upload/Images/HBO Hits-1.jpg",
    group: ["movies"]
  },
  hbosig: {
    name: "HBO Signature",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=hbosig`,
    logo: "https://www.nicepng.com/png/detail/233-2333069_hbo-signature-logo-png.png",
    group: ["movies"]
  },
  cinemax: {
    name: "Cinemax",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=cinemax`,
    logo: "https://logodix.com/logo/2138572.png",
    group: ["movies"]
  },
  cinemaone: {
    name: "Cinema One",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=cinemaone`,
    logo: "https://download.logo.wine/logo/Cinema_One/Cinema_One-Logo.wine.png",
    group: ["movies"]
  },
  cartoonnetworkhd: {
    name: "Cartoon Network HD",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=cartoonnetworkhd`,
    logo: "https://logos-world.net/wp-content/uploads/2021/08/Cartoon-Network-Logo-2010-present.png",
    group: ["cartoons & animations"]
  },
  cartoonnetwork: {
    name: "Cartoon Network",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=cartoonnetwork`,
    logo: "https://logos-world.net/wp-content/uploads/2021/08/Cartoon-Network-Logo-2010-present.png",
    group: ["cartoons & animations"]
  },
  animax: {
    name: "Animax",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=animax`,
    logo: "https://iconape.com/wp-content/files/px/285466/svg/animax-logo-logo-icon-png-svg.png",
    group: ["cartoons & animations"]
  },
  tapmovies: {
    name: "Tap Movies",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=tapmovies`,
    logo: "https://cms.cignal.tv/Upload/Images/Tap-movies.jpg",
    group: ["movies"]
  },
  tapactionflix: {
    name: "Tap Action Flix",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=tapactionflix`,
    logo: "https://github.com/tv-logo/tv-logos/blob/main/countries/philippines/tap-action-flix-ph.png?raw=true",
    group: ["movies"]
  },
  animexhidive: {
    name: "Anime X Hidive",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=animexhidive`,
    logo: "https://www.tablotv.com/wp-content/uploads/2023/12/AnimeXHIDIVE_official-768x499.png",
    group: ["cartoons & animations"]
  },
  disneychannel: {
    name: "Disney Channel",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=disneychannel`,
    logo: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/20768ccf-f5b0-4b5e-bd31-ad33d6cf6a35/dei91io-5b3a14cb-c0c8-4033-b487-3574252333bd.jpg/v1/fill/w_1191,h_671,q_70,strp/disney_channel_logo__blue__by_littlekj20_dei91io-pre.jpg",
    group: ["cartoons & animations"]
  },
  disneyxdd: {
    name: "Disney XD",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=disneyxdd`,
    logo: "https://logos-world.net/wp-content/uploads/2023/06/Disney-XD-Logo-2009.png",
    group: ["cartoons & animations"]
  },
  disneyjr: {
    name: "Disney Jr.",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=disneyjr`,
    logo: "https://www.pinpng.com/pngs/m/418-4182937_disney-junior-tv-logo-hd-png-download.png",
    group: ["cartoons & animations"]
  },
  tfcasia: {
    name: "TFC Asia",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=tfcasia`,
    logo: "https://img.mytfc.com/cmsroot/abscms/media/mytfctv/channels/iwantoriginals/iwanttfc_channel_thumbnail-768x430.png?ext=.png",
    group: ["entertainment"]
  },
  cnn: {
    name: "CNN International",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=cnn`,
    logo: "https://laguia.tv/_nuxt/img/CNN_512.0e91aae.png",
    group: ["news", "entertainment"]
  },
  anc: {
    name: "ANC",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=anc`,
    logo: "https://data-corporate.abs-cbn.com/corp/medialibrary/dotcom/corp news sports 2020/anc station id/anc goes global_2.jpg",
    group: ["news", "entertainment"]
  },
  axn: {
    name: "AXN",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=axn`,
    logo: "https://icon2.cleanpng.com/20180702/pfc/kisspng-axn-television-channel-sony-channel-television-sho-axn-5b3a0ac39f5e85.1062681315305304996528.jpg",
    group: ["news", "entertainment"]
  },
  crave1: {
    name: "Crave 1",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=crave1`,
    logo: "https://the-bithub.com/crave1",
    group: ["movies"]
  },
  crave2: {
    name: "Crave 2",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=crave2`,
    logo: "https://the-bithub.com/crave",
    group: ["movies"]
  },
  cinemo: {
    name: "Cinemo",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=cinemo`,
    logo: "https://th.bing.com/th/id/OIP.YQlhh4Welb3cggK1H7oE3QHaEF?rs=1&pid=ImgDetMain",
    group: ["movies"]
  },
  amc: {
    name: "AMC+",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=amc`,
    logo: "https://shop.amc.com/cdn/shop/products/AMCP-LOGO-100011-FR-RO_1500x.png?v=1650990755",
    group: ["movies"]
  },
  amcthriller: {
    name: "AMC Thrillers",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=amcthriller`,
    logo: "https://provider-static.plex.tv/6/epg/channels/logos/gracenote/6e7af423114c9f735d17e142783f233a.png",
    group: ["movies"]
  },
  paramount: {
    name: "Paramount Movies",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=paramount`,
    logo: "https://logodownload.org/wp-content/uploads/2014/07/paramount-logo-1.png",
    group: ["movies"]
  },
  gmapinoytv: {
    name: "GMA PINOY TV",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=gmapinoytv`,
    logo: "https://aphrodite.gmanetwork.com/entertainment/articles/900_675_Main_Image22_1109_-20221109181156.jpg",
    group: ["news", "entertainment"]
  },
  tvnprem: {
    name: "TVN Premium",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=tvnprem`,
    logo: "https://blog.kakaocdn.net/dn/SNPof/btqwO6OKJbH/kGkD29gebJ6bUFjri4E6Ak/img.jpg",
    group: ["movies"]
  },
  tvnmovies: {
    name: "TVN Movies",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=tvnmovies`,
    logo: "https://yt3.ggpht.com/a/AATXAJy1C8c3pOmn9lAsPovaRcKqIvw2OAAfHK-HtA=s900-c-k-c0xffffffff-no-rj-mo",
    group: ["movies"]
  },
  tvnpinoy: {
    name: "TVN Movies Pinoy",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=tvnpinoy`,
    logo: "https://stmify.com/wp-content/uploads/2024/12/418-s.webp",
    group: ["movies"]
  },
  wwe: {
    name: "WWE",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=wwe`,
    logo: "https://mcdn.wallpapersafari.com/medium/43/73/OC5BrI.png",
    group: ["sports"]
  },
  onesports: {
    name: "One Sports +",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=onesports`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/OneSportsPlus_logo.svg/300px-OneSportsPlus_logo.svg.png",
    group: ["sports", "entertainment"]
  },
  onesportshd: {
    name: "One Sports HD",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=onesportshd`,
    logo: "https://i.imgur.com/imI97L2.png",
    group: ["sports", "entertainment"]
  },
  nbaph: {
    name: "NBA TV PH",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=nbaph`,
    logo: "https://pngset.com/images/nba-tv-philippines-nba-tv-philippines-cignal-person-text-label-logo-transparent-png-2509143.png",
    group: ["sports", "entertainment"]
  },
  studiouniversal: {
    name: "Studio Universal",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=studiouniversal`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Logo_Studio_Universal.svg/1200px-Logo_Studio_Universal.svg.png",
    group: ["movies"]
  },
  filmrisehorror: {
    name: "Filmrise Horror",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=filmrisehorror`,
    logo: "https://the-bithub.com/fhorror",
    group: ["movies"]
  },
  rakutenviki: {
    name: "Rakuten Viki",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=rakutenviki`,
    logo: "https://img.icons8.com/color/452/rakuten-viki.png",
    group: ["movies", "entertainment"]
  },
  miramax: {
    name: "Miramax Movies",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=miramax`,
    logo: "https://the-bithub.com/miramax",
    group: ["movies"]
  },
  ionplus: {
    name: "Ion Plus",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=ionplus`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/ION_Plus_logo.svg/1200px-ION_Plus_logo.svg.png",
    group: ["news", "entertainment"]
  },
  ionmystery: {
    name: "Ion Mystery",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=ionmystery`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/ION_Mystery_logo.svg/1200px-ION_Mystery_logo.svg.png",
    group: ["movies", "entertainment"]
  },
  dove: {
    name: "Dove Channel",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=dove`,
    logo: "https://the-bithub.com/dove",
    group: ["entertainment"]
  },
  bbcearth: {
    name: "BBC Earth",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=bbcearth`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/BBC_Earth.svg",
    group: ["documentary"]
  },
  rckentr: {
    name: "Rock Entertainment",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=rckentr`,
    logo: "https://assets-global.website-files.com/64e81e52acfdaa1696fd623f/652f763c600497122b122df0_logo_ent_red_web.png",
    group: ["news", "entertainment"]
  },
  amznmovie: {
    name: "Amazon Movies",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=amznmovie`,
    logo: "https://the-bithub.com/amznmovies",
    group: ["movies"]
  },
  hitsnow: {
    name: "Hits HD",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=hitsnow`,
    logo: "https://medianet.mv/media/channel/229x0-icon.png",
    group: ["movies"]
  },
  kix: {
    name: "Kix HD",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=kix`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/KIX_logo.svg/1200px-KIX_logo.svg.png",
    group: ["entertainment"]
  },
  history: {
    name: "History",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=history`,
    logo: "https://logos-world.net/wp-content/uploads/2023/07/History-Logo.jpg",
    group: ["documentary"]
  },
  nbcsprts: {
    name: "NBC Sports",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=nbcsprts`,
    logo: "https://i.ibb.co/PN0fjNF/90-removebg-preview.png",
    group: ["sports"]
  },
  warner: {
    name: "Warner TV",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=warner`,
    logo: "https://tse2.mm.bing.net/th/id/OIP.7d6tiaMYWpWIGI6iAN47zAHaG3?rs=1&pid=ImgDetMain&o=7&rm=3",
    group: ["movies", "entertainment"]
  },
  moviesnow: {
    name: "Movies Now",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=moviesnow`,
    logo: "https://bestmediainfo.com/uploads/2017/08/MOVIES-NOW-LOGO_6.jpg",
    group: ["movies"]
  },
  myxglobal: {
    name: "MYX",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=myxglobal`,
    logo: "https://seeklogo.com/images/M/myx-logo-8C7D28B9EF-seeklogo.com.png",
    group: ["entertainment"]
  },
  alja: {
    name: "Al jazeera",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=alja`,
    logo: "https://www.liblogo.com/img-logo/al1049a118-al-jazeera-logo-al-jazeera-to-deliver-bloomberg-news-content-for-expanded-global.png",
    group: ["news", "entertainment"]
  },
  channelnwasia: {
    name: "Channel News Asia",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=channelnwasia`,
    logo: "https://logowik.com/content/uploads/images/cna-channel-news-asia9392.jpg",
    group: ["news", "entertainment"]
  },
  premleague: {
    name: "Premier League",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=premleague`,
    logo: "https://logos-world.net/wp-content/uploads/2023/02/Premier-League-Logo-2007.png",
    group: ["sports"]
  },
  mtvlive: {
    name: "MTV",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=mtvlive`,
    logo: "https://tse3.mm.bing.net/th/id/OIP.lMLVpSGutDFitqvokkgp6AHaHT?w=774&h=764&rs=1&pid=ImgDetMain&o=7&rm=3",
    group: ["entertainment"]
  },
  one_ph: {
    name: "One PH",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=one_ph`,
    logo: "https://i.imgur.com/gkluDe9.png",
    group: ["news", "entertainment"]
  },
  buko: {
    name: "BuKO",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=buko`,
    logo: "https://i.imgur.com/Wv0K5Yc.png",
    group: ["news", "entertainment"]
  },
  sari_sari: {
    name: "SARI‑SARI",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=sari_sari`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Sari-Sari_Channel_logo.svg/1200px-Sari-Sari_Channel_logo.svg.png",
    group: ["news", "entertainment"]
  },
  ptv4: {
    name: "PTV4",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=ptv4`,
    logo: "https://static.wikia.nocookie.net/russel/images/d/dc/PTV_4_Para_Sa_Bayan_Alternative_Logo_June_2017.png",
    group: ["news", "entertainment"]
  },
  one_sports: {
    name: "One Sports",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=one_sports`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/One_Sports_logo.svg/2560px-One_Sports_logo.svg.png",
    group: ["sports"]
  },
  one_news: {
    name: "One News",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=one_news`,
    logo: "https://i.imgur.com/bpRiu54.png",
    group: ["news", "entertainment"]
  },
  rptv: {
    name: "RPTV",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=rptv`,
    logo: "https://static.wikia.nocookie.net/russel/images/f/fb/RPTV_Alternative_Logo_2024.png",
    group: ["news", "entertainment"]
  },
  a2z: {
    name: "A2Z",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=a2z`,
    logo: "https://static.wikia.nocookie.net/russel/images/8/85/A2Z_Channel_11_without_Channel_11_3D_Logo_2020.png"
  },
  bilyonaryo: {
    name: "Bilyonaryo Channel",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=bilyonaryo`,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcxvjeBIthYiEaZHeVeYpDicIlOTdv3G6lzoal3VM2xVzWu_J7XxM657oz&s=10",
    group: ["news", "entertainment"]
  },
  viva_cinema: {
    name: "Viva Cinema",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=viva_cinema`,
    logo: "https://static.wikia.nocookie.net/russel/images/2/2f/Viva_Cinema_(2021-.n.v.).png",
    group: ["movies"]
  },
  tmc: {
    name: "TMC",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=tmc`,
    logo: "https://upload.wikimedia.org/wikipedia/en/2/27/Tmc2021logo.png",
    group: ["movies"]
  },
  dreamworks_tagalized: {
    name: "DreamWorks (Tagalized)",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=dreamworks_tagalized`,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDPoIb5G0splDYh5wCQY_vWyooZSSjfalhaQ&s",
    group: ["cartoons & animations"]
  },
  tap_sports: {
    name: "Tap Sports",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=tap_sports`,
    logo: "https://i.imgur.com/ZsWDiRF.png",
    group: ["sports"]
  },
  tvup: {
    name: "TVUP!",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=tvup`,
    logo: "https://cms.cignal.tv/Upload/Images/TVUP Logo .png",
    group: ["news", "entertainment"]
  },
  rock_action: {
    name: "Rock Action",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=rock_action`,
    logo: "https://uploads-ssl.webflow.com/64e961c3862892bff815289d/64f57100366fe5c8cb6088a7_logo_ext_web.png",
    group: ["movies"]
  },
  tap_tv: {
    name: "Tap TV",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=tap_tv`,
    logo: "https://i.imgur.com/KJaSftF.png",
    group: ["news", "entertainment"]
  },
  knowledge_channel: {
    name: "Knowledge Channel",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=knowledge_channel`,
    logo: "https://i.imgur.com/UIqEr2y.png",
    group: ["entertainment"]
  },
  deped_tv: {
    name: "DepEd TV",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=deped_tv`,
    logo: "https://static.wikia.nocookie.net/russel/images/f/f3/DepEd_TV_Logo_2020.png",
    group: ["news", "entertainment"]
  },
  fashion_tv: {
    name: "Fashion TV",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=fashion_tv`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Fashion_TV_logo_2017.svg/1200px-Fashion_TV_logo_2017.svg.png",
    group: ["entertainment"]
  },
  hits: {
    name: "HITS",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=hits`,
    logo: "https://i.imgur.com/YeqyD9W.png",
    group: ["movies"]
  },
  uaap: {
    name: "UAAP Varsity Channel",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=uaap`,
    logo: "https://i.imgur.com/V0sxXci.png",
    group: ["sports"]
  },
  truefm: {
    name: "TrueFM TV",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=truefm`,
    logo: "https://upload.wikimedia.org/wikipedia/en/4/40/Radyo5truefmlogo.webp",
    group: ["news", "entertainment"]
  },
  tvMaria: {
    name: "TV Maria",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=tvMaria`,
    logo: "https://upload.wikimedia.org/wikipedia/en/c/c1/TV_MARIA_logo.png",
    group: ["news", "entertainment"]
  },
  rockentertainment: {
    name: "Rock Entertainment",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=rockentertainment`,
    logo: "https://i.imgur.com/fx1Y2Eh.png",
    group: ["entertainment"]
  },
  spotv: {
    name: "SPOTV",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=spotv`,
    logo: "https://ownassetsmysky.blob.core.windows.net/assetsmysky/production/media-upload/1634257286_thumb-spotv.png",
    group: ["entertainment"]
  },
  spotv2: {
    name: "SPOTV2",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=spotv2`,
    logo: "https://ownassetsmysky.blob.core.windows.net/assetsmysky/production/media-upload/1634257305_thumb-spotv-2.png",
    group: ["entertainment"]
  },
  premierSports2: {
    name: "Premier Sports 2",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=premierSports2`,
    logo: "https://ownassetsmysky.blob.core.windows.net/assetsmysky/production/plans-and-bundles/1641949301_premier-sports-2.png",
    group: ["sports"]
  },
  lifetime: {
    name: "Lifetime",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=lifetime`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_Lifetime_2020.svg/2560px-Logo_Lifetime_2020.svg.png",
    group: ["entertainment"]
  },
  foodNetwork: {
    name: "Food Network",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=foodNetwork`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Food_Network_logo.svg/1200px-Food_Network_logo.svg.png",
    group: ["entertainment"]
  },
  abcAustralia: {
    name: "ABC Australia",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=abcAustralia`,
    logo: "https://i.pinimg.com/736x/5a/66/65/5a666508bc5851a6a9c1151e7eefff3d.jpg",
    group: ["documentary"]
  },
  travelChannel: {
    name: "Travel Channel",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=travelChannel`,
    logo: "https://i.imgur.com/ZCYeUV2.png",
    group: ["documentary"]
  },
  bloomberg: {
    name: "Bloomberg",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=bloomberg`,
    logo: "https://thumbs.dreamstime.com/b/bloomberg-logo-editorial-illustrative-white-background-logo-icon-vector-logos-icons-set-social-media-flat-banner-vectors-svg-210442338.jpg",
    group: ["news", "entertainment"]
  },
  bbc_news: {
    name: "BBC News",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=bbc_news`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/BBC_News_2022_(Alt).svg/1200px-BBC_News_2022_(Alt).svg.png",
    group: ["news", "entertainment"]
  },
  dreamworks: {
    name: "DreamWorks HD",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=dreamworks`,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDPoIb5G0splDYh5wCQY_vWyooZSSjfalhaQ&s",
    group: ["cartoons & animations"]
  },
  moonbug_kids: {
    name: "Moonbug",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=moonbug_kids`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Moonbug2ndLogo.png",
    group: ["cartoons & animations"]
  },
  cnn_ph: {
    name: "CNN Philippines",
    type: "clearkey",
    manifestUri: `https://stream.shakzz.workers.dev/?id=cnn_ph`,
    logo: "https://laguia.tv/_nuxt/img/CNN_512.0e91aae.png",
    group: ["news", "entertainment"]
  },
  cartoonChannelPH: {
    name: "Cartoon Channel PH (10 - 8)",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=cartoonChannelPH`,
    logo: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b58bbc88-0030-4447-b99e-19e7dbc51b14/de71xo3-266469a4-3bd5-4bd7-890e-192c7798e0bb.png/v1/fill/w_1192,h_670/cartoon_channel_ph_logo__2020___present__by_kierariel_de71xo3-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6IlwvZlwvYjU4YmJjODgtMDAzMC00NDQ3LWI5OWUtMTllN2RiYzUxYjE0XC9kZTcxeG8zLTI2NjQ2OWE0LTNiZDUtNGJkNy04OTBlLTE5MmM3Nzk4ZTBiYi5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.2FyUXQBaLF5j9GldZMJAM1ltGPFq7pMwwr6V7wyGpFs",
    group: ["cartoons & animations"]
  },
  mrbean: {
    name: "MR BEAN",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=mrbean`,
    logo: "https://i.imgur.com/zKGnFe4.png",
    group: ["cartoons & animations"]
  },
  supertoons: {
    name: "SuperToons TV",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=supertoons`,
    logo: "https://tvpnlogopeu.samsungcloud.tv/platform/image/sourcelogo/vc/00/02/34/GBBD5100001HL_20241030T142601SQUARE.png",
    group: ["cartoons & animations"]
  },
  jungopinoytv: {
    name: "Jungo Pinoy TV",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=jungopinoytv`,
    logo: "https://yt3.googleusercontent.com/oT4LFcdusmWboxy8ZC9c6NS0riqRi6_96U-gXLT7C-NarXKKFjLDbyko6iFJVfr743e4eTnv=s900-c-k-c0x00ffffff-no-rj",
    group: ["movies", "entertainment"]
  },
  hallypop: {
    name: "Hallypop",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=hallypop`,
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/25/GMA_HALLYPOP_LOGO_2020.jpg",
    group: ["movies", "entertainment"]
  },
  screamflix: {
    name: "ScreamFlix",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=screamflix`,
    logo: "https://static.wikia.nocookie.net/logopedia/images/f/fb/Scream_Flix_Logo_2022.png/revision/latest/scale-to-width-down/1200?cb=20250419020619",
    group: ["movies", "entertainment"]
  },
  frontrow: {
    name: "Front Row",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=frontrow`,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRneG2hIDzQS75A9KHg2FJTbE76qj9fX301dA&s",
    group: ["news", "entertainment"]
  },
  combatgo: {
    name: "Combat Go",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=combatgo`,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYm23zkJn2ZVrGTMUfLULxPtcAycgK-zb96A&s",
    group: ["movies"]
  },
  awsn: {
    name: "AWSN",
    type: "hls",
    manifestUri: `https://stream.shakzz.workers.dev/?id=awsn`,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScrgyuzyxnS4PB5zqcMI9MyZwjgxsEwr4lpg&s",
    group: ["sports"]
  }
};
