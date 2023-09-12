import moment from "moment";

export const encodeBase64 = (data) => {
  return Buffer.from(JSON.stringify(data)).toString("base64");
};
export const decodeBase64 = (data) => {
  return JSON.parse(Buffer.from(data, "base64").toString("ascii"));
};

export function getUniqueId() {
  const uniq =
    "id" + new Date().getTime() + Math.random().toString(16).slice(2);
  return uniq;
}

export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function weightedScoreCalculator(roundScores, roundWeightage) {
  let WeightedAverage = 0;
  roundScores?.forEach((rscr) => {
    WeightedAverage += rscr.assessment.reduce((sum, v) => sum + v.points, 0);
  });

  if (roundScores?.length)
    return (
      ((WeightedAverage * 1.0) / roundScores.length) *
      ((roundWeightage * 1.0) / 100)
    ).toPrecision(4);
  else return 0;
}

export const getPresenceChannelName = (channelName) =>
  `presence-${channelName}`;

export const validBrowser = () => {
  // if (typeof window !== "undefined") {
  // const agent = window.navigator.userAgent.toLowerCase();
  // var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
  // var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // if (isSafari && iOS) {
  //   return false;
  // } else if (isSafari) {
  //   return false;
  // } else {
  //   return true;
  // }
  // }
  return true;
};

export const isValidEmail = (email) => {
  const re = /\S+@\S+\.\S\S+/;
  return re.test(email);
};

export const titleCase = (str) => {
  if (!str) return str;
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
export const getQueryParamsToString = (data) => {
  return data ? "?" + new URLSearchParams(data).toString() : "";
};

export const isValidURL = (str) => {
  // const linkRegex = /^(?:(?:https?|ftp):\/\/)?[^\s/$.?#].[^\s]*$/i;
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  // if (str.match(linkRegex)) {
  //   return true;
  // } else {
  //   return false;
  // }
  return !!pattern.test(str);
};

// adding https:// to url if not present
export const addHttpsToUrl = (url) => {
  if (!url) return url;
  if (url.indexOf("http") === 0) return url;
  return "https://" + url;
};

export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const getCrewPermissions = (crews = [], email) => {
  let permissions = null;
  crews?.forEach((crew) => {
    if (crew?.email === email) {
      permissions = crew?.permissions;
    }
  });
  return permissions;
};

export const findUnassigned = (containers) => {
  let conts = [];
  containers?.forEach((cont) => {
    if (cont.users.length === 0) {
      conts.push(cont);
    }
  });
  return conts;
};

export const calculateDuration = (eventTime, hours) => {
  let endTime = moment(eventTime).add(hours, "hours");
  return moment.duration(endTime.diff(moment()));
};

export const getInitials = (user) => {
  let initials = "";
  if (user?.fName) {
    initials += user.fName[0];
    initials += user.lName ? user.lName[0] : "";
    return initials;
  }
  initials += user?.firstName?.[0] || "";
  initials += user?.lastName ? user.lastName?.[0] : "";
  return initials;
};
export const isOnboardedUsers = (containers) => {
  let flag = false;
  containers?.forEach((cont) => {
    if (flag) return flag;
    cont?.users &&
      cont?.users?.forEach((user) => {
        if (user?.status === "ONBOARDED" || cont?.users?.length > 1) {
          flag = true;
          return flag;
        }
      });
  });
  return flag;
};

export const findRegisteredUsers = (users) => {
  let userRegistered = 0;
  let flag = false;
  users?.map((user) => {
    if (user?.status === "ONBOARDED") {
      userRegistered++;
    }
  });
  if (userRegistered === users?.length) {
    flag = true;
  }
  return { flag, userRegistered };
};

/**
 * @param {container}
 * single or multiple containers depends upon multiple flag
 * @param {competition}
 * completition data
 * @param {multiple}
 * when true multiple containers can be accepted
 * @returns {boolean}
 * if multiple flag is set to false the particular container is valid registration or not is only being returned
 * @returns {Object}
 * if multiple flag is set to true validRegistration flag as well as all the valid registrations and the invalid are also returned
 * ```
 * {
 *    isValid:Boolean
 *    valid:[ ]
 *    invalid:[ ]
 * }
 * ```
 *
 */

export const isValidRegistration = (
  container,
  competition,
  multiple = false
) => {
  const minTeamSize = competition?.minTeamSize;
  const competitionType = competition?.competitionType;

  if (multiple) {
    const valid = [];
    const invalid = [];
    container.forEach((cnt) => {
      const { userRegistered } = findRegisteredUsers(cnt.users);

      if (
        competitionType === "TEAM" &&
        minTeamSize &&
        userRegistered === minTeamSize
      ) {
        valid.push(cnt);
      } else if (
        competitionType === "TEAM" &&
        minTeamSize &&
        userRegistered < minTeamSize
      ) {
        invalid.push(cnt);
      } else if (
        competitionType === "TEAM" &&
        competition?.teamSize > userRegistered
      ) {
        invalid.push(cnt);
      } else if (competitionType === "SOLO" && userRegistered !== 1) {
        invalid.push(cnt);
      } else {
        valid.push(cnt);
      }
    });
    return { valid, invalid, isValid: Boolean(!invalid.length) };
  }

  // single container check
  const { userRegistered } = findRegisteredUsers(container.users);
  console.log(userRegistered);
  if (
    competitionType === "TEAM" &&
    minTeamSize &&
    userRegistered >= minTeamSize
  ) {
    return true;
  }
  if (
    competitionType === "TEAM" &&
    minTeamSize &&
    userRegistered < minTeamSize
  ) {
    return false;
  }
  if (competitionType === "TEAM" && competition?.teamSize > userRegistered) {
    return false;
  }
  // if (competitionType === "SOLO" && userRegistered !== 1) {
  //   return false;
  // }
  return true;
};
export const checkLegalRegistration = (competition = {}, container = {}) => {
  const registeredUsers = findRegisteredUsers(container?.users);
  let flag = false;
  if (competition?.competitionType === "TEAM") {
    if (competition?.minTeamSize) {
      if (container?.users?.length < competition?.minTeamSize) flag = false;
      else {
        if (registeredUsers.userRegistered >= competition?.minTeamSize) {
          flag = true;
        } else flag = false;
      }
    } else {
      if (registeredUsers.userRegistered === competition?.teamSize) {
        flag = true;
      } else flag = false;
    }
  } else {
    if (registeredUsers.userRegistered === 1) {
      flag = true;
    } else flag = false;
  }
  return flag;
};

export const isBelongToSameInstitute = (institutes, addedInstitutes) => {
  const matchingInstitutes = addedInstitutes?.map((name) => {
    const matched = institutes?.find(
      (institute) =>
        institute?.label?.toLowerCase().includes(name?.toLowerCase()) ||
        institute?.instituteName?.toLowerCase().includes(name?.toLowerCase())
    );
    if (matched) {
      return {
        instituteName: matched?.label || matched?.instituteName,
        ...matched,
      };
    } else {
      return { instituteName: name, isActive: false };
    }
  });

  console.log("matchingInstitutes", matchingInstitutes);

  let allVarified = true;
  let atLeastOneVarified = false;
  matchingInstitutes?.forEach((institute) => {
    if (!institute?.isActive) {
      allVarified = false;
    }
  });

  matchingInstitutes?.forEach((institute) => {
    if (institute?.isActive) {
      atLeastOneVarified = true;
    }
  });

  if (allVarified) {
    if (
      [...new Set(matchingInstitutes.map((obj) => obj.instituteName))].length >
      1
    ) {
      return false;
    } else {
      return true;
    }
  } else {
    if (atLeastOneVarified && addedInstitutes?.length > 1) {
      return false;
    } else {
      return true;
    }
  }
};

export const checkAllUsersHaveEmail = (users) => {
  let flag = true;
  users?.forEach((user) => {
    if (!user?.email) {
      flag = false;
    }
  });
  return flag;
};

export const calculatePoint = (container) => {
  // let totalPoints = 0;

  // container?.roundData.forEach((obj) => {
  //   const roundScores = obj.roundScore;

  //   // Iterate over each roundScore array
  //   roundScores.forEach((roundScore) => {
  //     const assessmentArray = roundScore.assessment;

  //     // Iterate over each assessment object
  //     assessmentArray.forEach((assessment) => {
  //       totalPoints += (assessment.points * obj.Round.roundWeightage) / 100;
  //     });
  //   });
  // });
  let temp = 0;
  let adjustedScore = 0;

  container?.roundData?.forEach((round) => {
    adjustedScore += round?.adjustedScore
      ? (round?.adjustedScore * round?.Round?.roundWeightage) / 100
      : 0;
    temp += parseFloat(
      weightedScoreCalculator(
        round.roundScore.filter(
          ({ submit, assessment }) =>
            submit === true && assessment.filter(({ points }) => points != null)
        ),
        round.Round?.roundWeightage
      )
    );
  });
  const totalRoundScore = container?.mockRoundData.reduce(
    (accumulator, currentValue) =>
      accumulator +
      (currentValue?.roundScore * currentValue?.Round?.roundWeightage) / 100,
    0
  );

  return Number(temp) + Number(totalRoundScore) + Number(adjustedScore);
};

// const weightedScoreCalculator = (roundScores, roundWeightage) => {
//   let WeightedAverage = 0;
//   roundScores.forEach((rscr) => {
//     WeightedAverage += rscr.assessment.reduce((sum, v) => sum + v.points, 0);
//   });

//   if (roundScores.length)
//     return (
//       ((WeightedAverage * 1.0) / roundScores.length) *
//       ((roundWeightage * 1.0) / 100)
//     ).toPrecision(4);
//   return 0;
// };

// For all pdf downloaded in zip file

import JSZip from "jszip";
import { saveAs } from "file-saver";
import Api from "../services";

export const downloadPdfFiles = async (pdfLinks, competitionCode) => {
  const zip = new JSZip();

  try {
    // Download each PDF file
    const downloadPromises = pdfLinks.map(async (link, index) => {
      const response = await Api.get(link, {
        responseType: "blob",
      });

      // Extract the filename from the URL
      const filename = link.substring(link.lastIndexOf("/") + 1);

      // Add the downloaded PDF to the zip
      zip.file(filename, response.data);

      return filename;
    });

    // Wait for all downloads to complete
    const filenames = await Promise.all(downloadPromises);

    // Generate the zip file
    const content = await zip.generateAsync({ type: "blob" });

    // Save the zip file and provide it for download
    saveAs(content, "pdf_files.zip");

    return filenames;
  } catch (error) {
    console.error("Error downloading PDF files:", error);
    return [];
  }
};

export function generateAcceptProperties(fileFormats) {
  const formatToAcceptMap = {
    doc: ".doc, .docx",
    pdf: ".pdf",
    ppt: ".ppt, .pptx",
    excel: ".xls, .xlsx",
    jpg: ".jpg, .jpeg",
    png: ".png",
    mp4: ".mp4",
    mov: ".mov",
    tiff: ".tiff, .tif",
    psd: ".psd",
    epf: ".epf",
    ai: ".ai",
  };

  const acceptProperties =
    fileFormats &&
    Object.keys(fileFormats)
      .filter((format) => fileFormats[format])
      .map((format) => formatToAcceptMap[format])
      .join(", ");

  // console.log(
  //   "formats1",
  //   Object.keys(fileFormats)
  //     .filter((format) => fileFormats[format])
  //     .map((format) => formatToAcceptMap[format])
  //     .join(", ")
  // );

  return acceptProperties;
}
