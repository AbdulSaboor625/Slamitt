import { message } from "antd";
import { encodeBase64 } from "./common";
import {
  background2,
  background3,
  background4,
  certificate,
  damnWithText,
  ehWithText,
  medal,
  niceWithText,
  prize,
  terribleWithText,
  testimonial1,
  testimonial2,
  testimonial3,
  testimonial4,
  trophy,
  wowWithText,
} from "./imageConfig";

export const gender = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export const profession = [
  {
    label: "Student",
    value: "student",
  },
  {
    label: "Working Professional",
    value: "working-professional",
  },
  {
    label: "Currently not Working",
    value: "currently-not-working",
  },
];

export const headerDropdown = [
  {
    label: "option 1",
    url: "http://localhost:3000/auth/dashboard",
  },
  {
    label: "option 2",
    url: "http://localhost:3000/auth/dashboard",
  },
  {
    label: "option 3",
    url: "http://localhost:3000/auth/dashboard",
  },
];

export const competitionsMenu = (url, type, competitionType) => {
  if (type === "Participated") {
    return [
      {
        label: "Dashboard",
        url: `${url}?content=dashboard`,
      },
      // {
      //   label: "Chats",
      //   url: `${url}?content=chat`,
      // },
      {
        label: "Settings",
        url: `${url}?content=settings`,
      },
    ];
  } else {
    return [
      {
        label: competitionType === "SOLO" ? "Participants" : "Teams",
        url: `${url}?content=containers`,
      },
      // {
      //   label: "Chats",
      //   url: `${url}?content=chat`,
      // },
      {
        label: "Rounds",
        url: `${url}?content=round`,
      },
      {
        label: "Settings",
        url: `${url}?content=settings`,
      },
    ];
  }
};

export const participantsMenu = [
  {
    label: "Qualified",
    value: "qualified",
  },
  {
    label: "Eliminated",
    value: "eliminated",
  },
];

export const competitionsListDummy = [
  {
    name: "Name of Competition",

    picture: {
      large: "https://randomuser.me/api/portraits/women/89.jpg",
      medium: "https://randomuser.me/api/portraits/med/women/89.jpg",
      thumbnail: "https://randomuser.me/api/portraits/thumb/women/89.jpg",
    },
  },
  {
    name: "Name of Competition",

    picture: {
      large: "https://randomuser.me/api/portraits/women/89.jpg",
      medium: "https://randomuser.me/api/portraits/med/women/89.jpg",
      thumbnail: "https://randomuser.me/api/portraits/thumb/women/89.jpg",
    },
  },
  {
    name: "Name of Competition",

    picture: {
      large: "https://randomuser.me/api/portraits/women/89.jpg",
      medium: "https://randomuser.me/api/portraits/med/women/89.jpg",
      thumbnail: "https://randomuser.me/api/portraits/thumb/women/89.jpg",
    },
  },
  {
    name: "Name of Competition",

    picture: {
      large: "https://randomuser.me/api/portraits/women/89.jpg",
      medium: "https://randomuser.me/api/portraits/med/women/89.jpg",
      thumbnail: "https://randomuser.me/api/portraits/thumb/women/89.jpg",
    },
  },
  {
    name: "Name of Competition",

    picture: {
      large: "https://randomuser.me/api/portraits/women/89.jpg",
      medium: "https://randomuser.me/api/portraits/med/women/89.jpg",
      thumbnail: "https://randomuser.me/api/portraits/thumb/women/89.jpg",
    },
  },
];

export const appNotification = (type, messg) => {
  message.error({
    message: messg,
  });
};

export const competitionType = Object.freeze({
  SOLO: "SOLO",
  TEAM: "TEAM",
});

export const skills = [
  { label: "All Skills", value: "All Skills" },
  { label: "Hard Skills", value: "Hard Skills" },
  { label: "Soft Skills", value: "Soft Skills" },
];

export const roundStatus = Object.freeze({
  DRAFT: "DRAFT",
  LIVE: "LIVE",
});

export const roundCardColors = [
  "#6808fe",
  "#3157dc",
  "#1b1e38",
  "#850529",
  "#da4e31",
  "#728327",
  "#1e5128",
  "#472717",
  "#781d5f",
  "#248d61",
  "#00aca2",
  "#de8701",
  "#3835c9",
  "#907014",
  "#660000",
  "#d63b26",
  "#9550ad",
  "#ff9900",
  "#00a3ff",
  "#45158e",
];

export const routes = Object.freeze({
  login: "/login/",
  loginPassword: "/login/add-password",
  register: "/sign-up/",
  judgeLogin: "/login/judge/",
  registerPassword: "/sign-up/add-password",
  registerOtp: "/sign-up/otp-verify",
  addDetails: "/sign-up/add-details",
  addProfession: "/sign-up/add-prof",
  addUserCategory: "/sign-up/add-user-category",
  addInterest: "/auth/pick-interest",
  forgotPassword: "/forgot-password/",
  forgotPasswordResetLink: "/forgot-password/new-password",
  dashboard: "/auth/dashboard/",
  competitionOrganised: "/auth/competitions/o",
  competitionParticipated: "/auth/competitions/p",
  judgeDashboard: "/auth/dashboard/judge/",
  profile: "/profile",
  accountInfo: "/auth/account-info",
  pageNotFound: "/page-not-found",
  leaderboard: "/leaderboard",
  leaderboardPublic: "/leaderboard/public/",
  inviteParticipantPublic: "/login/invite-members/public/",
  inviteParticipant: "/login/invite-members/dashboard/",
  inviteParticipantRegistration: "/login/invite-members/registration/",
  authRegistrations: "/registrations/auth/",
});

export const routeGenerator = (route, query, baseUrlRequired = false) => {
  let BASE_URL = "";
  if (baseUrlRequired) BASE_URL = process.env.NEXT_PUBLIC_NEXT_URL;
  const encodedQuery = encodeBase64(query);
  switch (route) {
    case routes.competitionOrganised:
      return `${BASE_URL}${route}/${query.competitionCode}`;
    case routes.competitionParticipated:
      return `${BASE_URL}${route}/${query.competitionCode}`;
    case routes.crewLogin:
      return `${BASE_URL}${route}${encodedQuery}`;
    case routes.inviteGetStarted:
      return `${BASE_URL}${route}${encodedQuery}`;
    case routes.crewGetStarted:
      return `${BASE_URL}${route}${encodedQuery}`;
    case routes.judgeLogin:
      return `${BASE_URL}${route}${encodedQuery}`;
    case routes.pageNotFound:
      return `${BASE_URL}${route}`;
    case routes.profile:
      return `${BASE_URL}${route}/${query.userId}`;
    case routes.leaderboard:
      return `${BASE_URL}${route}/${query.leaderboardID}`;
    case routes.leaderboardPublic:
      return `${BASE_URL}${route}/${query.leaderboardID}`;
    case routes.inviteParticipantPublic:
      return `${BASE_URL}${routes.register}?participant=${encodedQuery}&to=${BASE_URL}${route}${encodedQuery}`;
    case routes.inviteParticipant:
      return `${BASE_URL}${routes.inviteParticipant}${encodedQuery}?to=${BASE_URL}${routes.authRegistrations}${encodedQuery}`;
    case routes.inviteParticipantRegistration:
      return `${BASE_URL}${routes.inviteParticipantRegistration}${encodedQuery}`;
    case routes.judgeDashboard:
      return `${BASE_URL}${route}/${query.competitionCode}`;
    case routes.authRegistrations:
      return `${BASE_URL}${route}${encodedQuery}`;
    default:
      return `${BASE_URL}${route}`;
  }
};

export const initialSliderEmojis = [
  "https://rethink-competitions.s3.ap-south-1.amazonaws.com/assets/image+112.png", // angry
  "https://rethink-competitions.s3.ap-south-1.amazonaws.com/assets/image+113.png", // eh
  "https://rethink-competitions.s3.ap-south-1.amazonaws.com/assets/image+114.png", // avg
  "https://rethink-competitions.s3.ap-south-1.amazonaws.com/assets/image+115.png", // excited
  "https://rethink-competitions.s3.ap-south-1.amazonaws.com/assets/image+116.png", // loved it
];

export const scoreSliderEmojis = [
  // "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1657876198718_group2497.png",
  // "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1657876234476_group2498.png",
  // "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1657876253312_group2499.png",
  // "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1657876265562_group2500.png",
  // "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1657876277448_group2501.png",
  terribleWithText,
  ehWithText,
  niceWithText,
  wowWithText,
  damnWithText,
];

export const CONTAINER_ROUND_CODE_LIMIT = 45;
export const CONTAINER_SCORING_EMPTY_STATE = background2;
export const AGE_LIMIT = 13;

export const judgeEmptyState = Object.freeze({
  PROGRESS: background3,
  SCORED: background4,
});

export const settings = Object.freeze({
  COMPETITION: "COMPETITION",
  REGISTRATION: "REGISTRATION",
  CREW: "CREW",
  BANK: "BANK",
  SETUP: "SETUP",
  CERTIFICATES: "CERTIFICATES",
});
export const chatOptions = [
  { label: "Meet", value: "meet" },
  { label: "Delete chat", value: "delete" },
  { label: "Starred", value: "starred" },
  { label: "View media", value: "media" },
  { label: "Settings", value: "settings" },
];

export const chatSelectionOptions = [
  { label: "Recent", value: "recent" },
  { label: "Teams", value: "teams" },
  { label: "My crew", value: "myCrew" },
];

export const settingsParticipated = Object.freeze({
  REGISTRATION: "REGISTRATION",
  TEAM: "TEAM",
});

export const sampleCsvContainers = [
  {
    teamname: "Gryffindor",
    firstname: "Harry",
    lastname: "Potter",
    email: "harrypotter@hogwarts.com",
  },
  {
    teamname: "Gryffindor",
    firstname: "Ron",
    lastname: "Weasly",
    email: "ronald@hogwarts.com",
  },
  {
    teamname: "Hufflepuff",
    firstname: "Sirius",
    lastname: "Black",
    email: "sirius@hogwarts.com",
  },
  {
    teamname: "Slytherin",
    firstname: "Lord",
    lastname: "Voldemort",
    email: "tomriddle@hogwarts.com",
  },
  {
    teamname: "Ravenclaw",
    firstname: "Luna",
    lastname: "Lovegood",
    email: "luna@hogwarts.com",
  },
  {
    teamname: "Slytherin",
    firstname: "Draco",
    lastname: "Malfoy",
    email: "dracomalfoy@hogwarts.com",
  },
];

export const socketEvents = {
  judge_fetch_container: "JUDGE_FETCH_CONTAINER",
  container_fetch_score: "CONTAINER_FETCH_SCORE",
  new_container_created: "NEW_CONTAINER_CREATED",
  weightage_change: "WEIGHTAGE_CHANGE",
  room_containers_update: "ROOM_CONTAINERS_UPDATE",
  judge_status_update: "JUDGE_STATUS_UPDATE",
  judge_terminate_sessions: "JUDGE_TERMINATE_SESSIONS",
  participant_invitation: "PARTICIPANT_INVITATION",
  update_competition_setting: "UPDATE_COMPETITION_SETTING",
  update_submissions: "UPDATE_SUBMISSIONS",
  crew_status_update: "CREW_STATUS_UPDATE",
  organizer_release_scores: "ORGANIZER_RELEASE_SCORES",
  round_score_update: "ROUND_SCORE_UPDATE",
  round_delete: "ROUND_DELETE",
  round_live: "ROUND_LIVE",
  timeline_update: "TIMELINE_UPDATE",
  submission_settings_update: "SUBMISSION_SETTINGS_UPDATE",
  BULK_CREATE_CONTAINERS: "BULK_CREATE_CONTAINERS",
  UPDATE_SLAM_COINS: "UPDATE_SLAM_COINS",
  PLACEMENTS_UPDATED: "PLACEMENTS_UPDATED",
};

export const awsBaseUrl = "https://rethink-competitions.s3.amazonaws.com/";

export const ERROR_CODES = Object.freeze({
  COMPETITION_UPDATE_FAILED: "COMPETITION_UPDATE_FAILED",
  CREW_NOT_PRESENT: "CREW_NOT_PRESENT",
});

export const rewardsOption = [
  {
    id: 1,
    label: "Trophy",
    image: trophy,
  },
  {
    id: 2,
    label: "Medal",
    image: medal,
  },
  {
    id: 3,
    label: "Certificate",
    image: certificate,
  },
  {
    id: 4,
    label: "Prize",
    image: prize,
    emojiObject: null,
  },
];

export const testimonials = [
  {
    img: testimonial1,
    // review: `The interface was very smooth, not just for me but it was easy to plan all the judging criteria. And the basic thing is automation. So I just feed in the data, I don't need to maintain an Excel or anything. Basically, my headache is very low. Once all the teams are done it collates automatically and generates an excel so I can instantaneously declare the results.`,
    review: `The interface was very smooth, not just for me but it was easy to plan all the judging criteria.`,
    name: `Adithya Anand`,
    designation: `Student Organiser, NSRCEL, IIM Bangalore`,
  },
  {
    img: testimonial2,
    // review: `I've never used an app for judging, it's always been pen & paper. So I think we're getting digital in every sense so that is quite interesting. In addition, it is very user-friendly.`,
    review: `I've never used an app for judging, it's always been pen & paper. So we're going digital in every sense which is quite interesting. In addition, it is very user-friendly.`,
    name: `Debolina Dutta`,
    designation: `Professor of Practice-Organisation Behaviour and Human Resource Management, IIM Bangalore`,
  },
  {
    img: testimonial3,
    // review: `Instead of using pen and paper we use this app. It was all pretty easy. It also tends to happen that maybe you evaluate the first presenter but after the fourth or fifth you want to recheck it. Those are the things I liked because I could read just some of the evaluations. I liked it!`,
    review: `Super easy to use! The process to re-check and edit scores became very efficient. I liked it!`,
    name: `Dinesh Sharma`,
    designation: `CEO & Founder of Vizual Platform`,
  },
  {
    img: testimonial4,
    // review: `I could notice right from the beginning that the moment you slide it, the emotion changes. I think that makes it more visual for me, I kind of like to look at visual things. So you know the moment it slides or when I want to reduce or increase the score, that expression comes & I can relate to it. I don't know how to quantify it but in terms of being able to connect to that part of giving scores was really good!`,
    review: `I could notice right from the beginning that the moment you move the slider, the emotion changes. When I want to reduce or increase the score, that expression comes & I can relate to it.`,
    name: `Supreeth Reddy`,
    designation: `Strategic Advisor of Vizual Platform`,
  },
];

export const judgeTestimonials = [
  {
    bg: "#6808FE",
    // img: "https://rethink-competitions.s3.amazonaws.com/1666844989820_Group_3296.png",
    img: "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1666973382270_imgflow.png",
    text: "Tap on the card to judge contastants based on criteria",
  },
  {
    bg: "#000000",
    // img: "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1666845054386_emojiSlide.png",
    img: "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1666845054386_emojiSlide.png",
    text: "Slide the emoji to begin scoring",
  },
  {
    bg: "#FEBC10",
    img: "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1666845082906_submit.png",
    text: "Type SUBMIT and hit the button to release scores to the organiser",
  },
];

export const registrationTestimonials = [
  {
    bg: "#6808FE",
    img: "https://rethink-competitions.s3.amazonaws.com/1671557405171_participantDashboard.png",
    text: "Get Personalised Dashboards for team and solo competitions",
  },
  {
    bg: "#000000",
    img: "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1671557409036_performance.png",
    text: "Track your Performance Reviews & competition updates in Real Time",
  },
  {
    bg: "#FEBC10",
    img: "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1671557412953_skillInventory.png",
    text: "Build your skill inventory with every competition you participate in",
  },
];

export const suportedBrowsers = [
  {
    name: "Chrome",
    img: "https://rethink-competitions.s3.amazonaws.com/1666950620385_chrome.png",
  },
  // {
  //   name: "Safari",
  //   img: "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1666950717965_safari.png",
  // },
  {
    name: "Firefox",
    img: "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1666950754893_firefox.png",
  },
  {
    name: "Opera",
    img: "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1666950779701_opera.png",
  },
  {
    name: "Edge",
    img: "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1666950810245_edge.png",
  },
];
