let slamittLogo = "";
let icon1 = "";
let icon2 = "";
let icon3 = "";
let icon4 = "";
let icon = "";
let iconLoading = "";
let slamittLogoSmall = "";
let replyIcon = "";
let medal = "";
let background1 = "";
let background2 = "";
let background3 = "";
let background4 = "";
let eh = "";
let wow = "";
let terrible = "";
let damn = "";
let nice = "";
let unscored = "";
let ehWithText = "";
let wowWithText = "";
let terribleWithText = "";
let damnWithText = "";
let niceWithText = "";
let trophy = "";
let judgeIcon = "";
let abandon = "";
let loading = "";
let container = "";
let free = "";
let profileIcon = "";
let solo =
  "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1660148562274_imgsolo.svg";
let chat = "";
let imgHead = "";
let prize = "";
let certificate = "";
let team =
  "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1660148690437_imgteam.svg";
let dashboardEmptyPlaceholder = "";
let round = "";
let teamTag = "";
let rewards = "";
let forgetImage = "";
let stars = "";
let soloTag = "";
let paid = "";
let LeaderBoardLogo = "";
let leaderboardEmptyState = "";
let defaultUserAvatar =
  "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1655749770162_defaultimage.png";

let testimonial1 =
  "https://slamitt-prod.s3.ap-south-1.amazonaws.com/1659525094800_Adithya_Anand.jpg";
let testimonial2 =
  "https://slamitt-prod.s3.ap-south-1.amazonaws.com/1659525148734_Debolina_Dutta.jpg";
let testimonial3 =
  "https://slamitt-prod.s3.ap-south-1.amazonaws.com/1659525174312_Dinesh_Sharma.jpg";
let testimonial4 =
  "https://slamitt-prod.s3.ap-south-1.amazonaws.com/1659525213608_Supreeth_Reddy.jpg";

let concludeFlag =
  "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1669055225239_concludeFlag.svg";

let abandonFlag =
  "https://rethink-competitions.s3.amazonaws.com/1669756188810_abandon.svg";

let judgeSelfInviteModal =
  "https://rethink-competitions.s3.amazonaws.com/1666794634638_Group_3311.svg";

let continueJudgeSession =
  "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1667320184557_continueSession.svg";

let newJudgeSession =
  "https://rethink-competitions.s3.amazonaws.com/1667320166650_startNewSession.svg";

let loginUsingLinkIcon =
  "https://rethink-competitions.s3.amazonaws.com/1667564197468_loginUsingLinkIcon.svg";

let noSubmissions =
  "https://rethink-competitions.s3.amazonaws.com/1668169361259_noSubmission.svg";

let concludeCompetition =
  "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1669047818085_concludeCompetition.svg";

let deleteCompIcon =
  "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1669047822492_abandonCompetition.svg";

let abandonCompIcoon =
  "https://rethink-competitions.s3.amazonaws.com/1669647796053_deleteIcon.png";
let placementImage =
  // "https://rethink-competitions.s3.amazonaws.com/1672113303109_winner.png";
  "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1675886831954_placements.png";
let placementCrownImages = {
  _1stPlacw:
    // "https://rethink-competitions.s3.amazonaws.com/1672932246840_crownImage.png",
    "https://rethink-competitions.s3.amazonaws.com/1673287709129_crown01.png",
  _2ndPlace:
    // "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1672933835753_crownImage2.png",
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673289512760_crown02.png",
  _3rdPlace:
    // "https://rethink-competitions.s3.amazonaws.com/1672933840237_crownImage3.png",
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673289573901_crown03.png",
};

let rewardsImage = {
  throphy:
    // "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673288114287_throphy.png",
    "https://rethink-competitions.s3.amazonaws.com/1673539259785_trophy.png",
  medel:
    // "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673288119116_medel.png",
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673539308759_medal.png",
  certificate:
    // "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673288123718_certificate.png",
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673539099105_certificate.png",
  prize:
    // "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673288127028_prize.png",
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673539367224_prize.png",
};

if (process.env.NEXT_PUBLIC_ENV === "PROD") {
  slamittLogo =
    "https://rethink-competitions.s3.amazonaws.com/1659457683781_1657234403885slamittlogo.svg";
  icon3 =
    "https://rethink-competitions.s3.amazonaws.com/1659457683774_1656708496131icon3.png";
  iconLoading =
    "https://rethink-competitions.s3.amazonaws.com/1659457683769_1658251544746iconloading.png";
  icon2 =
    "https://rethink-competitions.s3.amazonaws.com/1659457683756_1656708469081icon2.png";
  slamittLogoSmall =
    "https://rethink-competitions.s3.amazonaws.com/1659457683750_1655746609367slamittlogosmall.png";
  replyIcon =
    "https://rethink-competitions.s3.amazonaws.com/1659457683816_1654286022562replyicon.svg";
  medal =
    "https://rethink-competitions.s3.amazonaws.com/1659457683859_medal.png";
  background1 =
    "https://rethink-competitions.s3.amazonaws.com/1659457683809_1655731665708teams.png";
  damn =
    "https://rethink-competitions.s3.amazonaws.com/1659457683999_1658333650456damn.svg";
  judgeIcon =
    "https://rethink-competitions.s3.amazonaws.com/1659457683821_1658349919116judgeicon.png";
  abandon =
    "https://rethink-competitions.s3.amazonaws.com/1659457683914_1653594533892abandon.svg";
  loading =
    "https://rethink-competitions.s3.amazonaws.com/1659457683931_1656969428178loading.png";
  container =
    "https://rethink-competitions.s3.amazonaws.com/1659457683722_1655731578044container.png";
  free = "https://rethink-competitions.s3.amazonaws.com/1659457684060_free.svg";
  icon4 =
    "https://rethink-competitions.s3.amazonaws.com/1659457683795_1656708512671icon04.png";
  trophy =
    "https://rethink-competitions.s3.amazonaws.com/1659457683948_trophy.png";
  eh =
    "https://rethink-competitions.s3.amazonaws.com/1659457683893_1658333577725eh.svg";
  icon =
    "https://rethink-competitions.s3.amazonaws.com/1659457683853_1658518223289icon.png";
  terribleWithText =
    "https://rethink-competitions.s3.amazonaws.com/1660301295474_Group_2497.svg";
  wow =
    "https://rethink-competitions.s3.amazonaws.com/1659457683924_1658333631771wow.svg";
  // solo =
  //   // "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1660148562274_imgsolo.svg";
  //   "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673463795988_imagesolo.png";
  nice =
    "https://rethink-competitions.s3.amazonaws.com/1659457683962_1658333602712nice.svg";
  unscored =
    "https://rethink-competitions.s3.amazonaws.com/1662976410300_unscored.svg";
  chat = "https://rethink-competitions.s3.amazonaws.com/1659457683870_chat.png";
  imgHead =
    "https://rethink-competitions.s3.amazonaws.com/1659457683874_1657052236254imghead.png";
  prize =
    "https://rethink-competitions.s3.amazonaws.com/1659457683864_prize.png";
  certificate =
    "https://rethink-competitions.s3.amazonaws.com/1659457683936_certificate.png";
  // team =
  //   // "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1660148690437_imgteam.svg";
  //   "https://rethink-competitions.s3.amazonaws.com/1673463560256_imageteam.png";
  dashboardEmptyPlaceholder =
    "https://rethink-competitions.s3.amazonaws.com/1659457683885_1655751645489dashboardemptyplaceholder.png";
  ehWithText =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1660301326076_Group_2498.svg";
  round =
    "https://rethink-competitions.s3.amazonaws.com/1659457683880_1655731635437round.png";
  niceWithText =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1660301340007_Group_2499.svg";
  wowWithText =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1660301359600_Group_2500.svg";
  teamTag =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1659457684038_teamTag.svg";
  damnWithText =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1660301374583_Group_2501.svg";
  terrible =
    "https://rethink-competitions.s3.amazonaws.com/1659457683980_1658333533430terrible.svg";
  rewards =
    "https://rethink-competitions.s3.amazonaws.com/1659457683801_1651836227047rewards.svg";
  forgetImage =
    "https://rethink-competitions.s3.amazonaws.com/1659457684033_1657290298871forgetimage.png";
  stars =
    "https://rethink-competitions.s3.amazonaws.com/1659457683847_1656957241652stars.png";
  soloTag =
    "https://rethink-competitions.s3.amazonaws.com/1659457684079_soloTag.svg";
  background2 =
    // "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1659457684076_1655731614840perticipant.png";
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1680625805054_perticipant.png",
  icon1 =
    "https://rethink-competitions.s3.amazonaws.com/1659457683763_1656708441722icon1.png";
  profileIcon =
    "https://rethink-competitions.s3.amazonaws.com/1659457683789_1655749770162defaultimage.png";
  paid =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1659457684066_paid.svg";
  background3 =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1659457684026_Group2655.svg";
  background4 =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1659457684020_1658142626982Group2656.svg";
  LeaderBoardLogo =
    // "https://rethink-competitions.s3.amazonaws.com/1662801380409_LEADERBOARD.svg";
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663264491268_textleaderboard.png";
  leaderboardEmptyState =
    "https://rethink-competitions.s3.amazonaws.com/1663047932854_leaderboardEmptyState.svg";
} else {
  slamittLogo =
    "https://rethink-competitions.s3.amazonaws.com/1659457683781_1657234403885slamittlogo.svg";
  icon3 =
    "https://rethink-competitions.s3.amazonaws.com/1659457683774_1656708496131icon3.png";
  iconLoading =
    "https://rethink-competitions.s3.amazonaws.com/1659457683769_1658251544746iconloading.png";
  icon2 =
    "https://rethink-competitions.s3.amazonaws.com/1659457683756_1656708469081icon2.png";
  slamittLogoSmall =
    "https://rethink-competitions.s3.amazonaws.com/1659457683750_1655746609367slamittlogosmall.png";
  replyIcon =
    "https://rethink-competitions.s3.amazonaws.com/1659457683816_1654286022562replyicon.svg";
  medal =
    "https://rethink-competitions.s3.amazonaws.com/1659457683859_medal.png";
  background1 =
    "https://rethink-competitions.s3.amazonaws.com/1659457683809_1655731665708teams.png";
  damn =
    "https://rethink-competitions.s3.amazonaws.com/1659457683999_1658333650456damn.svg";
  judgeIcon =
    "https://rethink-competitions.s3.amazonaws.com/1659457683821_1658349919116judgeicon.png";
  abandon =
    "https://rethink-competitions.s3.amazonaws.com/1659457683914_1653594533892abandon.svg";
  loading =
    "https://rethink-competitions.s3.amazonaws.com/1667398202623_timer.png";
  container =
    "https://rethink-competitions.s3.amazonaws.com/1659457683722_1655731578044container.png";
  free = "https://rethink-competitions.s3.amazonaws.com/1659457684060_free.svg";
  icon4 =
    "https://rethink-competitions.s3.amazonaws.com/1659457683795_1656708512671icon04.png";
  trophy =
    "https://rethink-competitions.s3.amazonaws.com/1659457683948_trophy.png";
  eh =
    "https://rethink-competitions.s3.amazonaws.com/1659457683893_1658333577725eh.svg";
  icon =
    "https://rethink-competitions.s3.amazonaws.com/1659457683853_1658518223289icon.png";
  terribleWithText =
    "https://rethink-competitions.s3.amazonaws.com/1660301295474_Group_2497.svg";
  wow =
    "https://rethink-competitions.s3.amazonaws.com/1659457683924_1658333631771wow.svg";
  solo =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1660148562274_imgsolo.svg";
  // "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673463795988_imagesolo.png";
  nice =
    "https://rethink-competitions.s3.amazonaws.com/1659457683962_1658333602712nice.svg";
  unscored =
    "https://rethink-competitions.s3.amazonaws.com/1662976410300_unscored.svg";

  chat = "https://rethink-competitions.s3.amazonaws.com/1659457683870_chat.png";
  imgHead =
    "https://rethink-competitions.s3.amazonaws.com/1659457683874_1657052236254imghead.png";
  prize =
    "https://rethink-competitions.s3.amazonaws.com/1659457683864_prize.png";
  certificate =
    "https://rethink-competitions.s3.amazonaws.com/1659457683936_certificate.png";
  team =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1660148690437_imgteam.svg";
  // "https://rethink-competitions.s3.amazonaws.com/1673463560256_imageteam.png";
  dashboardEmptyPlaceholder =
    "https://rethink-competitions.s3.amazonaws.com/1659457683885_1655751645489dashboardemptyplaceholder.png";
  ehWithText =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1660301326076_Group_2498.svg";
  round =
    "https://rethink-competitions.s3.amazonaws.com/1659457683880_1655731635437round.png";
  niceWithText =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1660301340007_Group_2499.svg";
  wowWithText =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1660301359600_Group_2500.svg";
  teamTag =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1659457684038_teamTag.svg";
  damnWithText =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1660301374583_Group_2501.svg";
  terrible =
    "https://rethink-competitions.s3.amazonaws.com/1659457683980_1658333533430terrible.svg";
  rewards =
    "https://rethink-competitions.s3.amazonaws.com/1659457683801_1651836227047rewards.svg";
  forgetImage =
    "https://rethink-competitions.s3.amazonaws.com/1659457684033_1657290298871forgetimage.png";
  stars =
    "https://rethink-competitions.s3.amazonaws.com/1659457683847_1656957241652stars.png";
  soloTag =
    "https://rethink-competitions.s3.amazonaws.com/1659457684079_soloTag.svg";
  background2 =
    // "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1659457684076_1655731614840perticipant.png";
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1680625805054_perticipant.png",
  icon1 =
    "https://rethink-competitions.s3.amazonaws.com/1659457683763_1656708441722icon1.png";
  profileIcon =
    "https://rethink-competitions.s3.amazonaws.com/1659457683789_1655749770162defaultimage.png";
  paid =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1659457684066_paid.svg";
  background3 =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1659457684026_Group2655.svg";
  background4 =
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1659457684020_1658142626982Group2656.svg";
  LeaderBoardLogo =
    // "https://rethink-competitions.s3.amazonaws.com/1662801380409_LEADERBOARD.svg";
    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663264491268_textleaderboard.png";
  leaderboardEmptyState =
    "https://rethink-competitions.s3.amazonaws.com/1663047932854_leaderboardEmptyState.svg";
}
export {
  judgeSelfInviteModal,
  slamittLogo,
  icon1,
  icon2,
  icon3,
  icon4,
  icon,
  iconLoading,
  slamittLogoSmall,
  replyIcon,
  medal,
  background1,
  background2,
  background3,
  background4,
  eh,
  wow,
  terrible,
  damn,
  nice,
  unscored,
  ehWithText,
  wowWithText,
  terribleWithText,
  damnWithText,
  niceWithText,
  trophy,
  judgeIcon,
  abandon,
  loading,
  container,
  free,
  profileIcon,
  solo,
  chat,
  imgHead,
  prize,
  certificate,
  team,
  dashboardEmptyPlaceholder,
  round,
  teamTag,
  rewards,
  forgetImage,
  stars,
  soloTag,
  paid,
  testimonial1,
  testimonial2,
  testimonial3,
  testimonial4,
  defaultUserAvatar,
  concludeFlag,
  LeaderBoardLogo,
  leaderboardEmptyState,
  continueJudgeSession,
  newJudgeSession,
  loginUsingLinkIcon,
  noSubmissions,
  concludeCompetition,
  deleteCompIcon,
  abandonCompIcoon,
  abandonFlag,
  placementImage,
  placementCrownImages,
  rewardsImage,
};
