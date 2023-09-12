import Api from "../../services";
import { SOMETHING_WENT_WRONG } from "../../utility/constants";

export const getOrganisedCompetitions = async () => {
  try {
    const response = await Api.get("/competition/organized");
    if (response && response.result) {
      const competitions = response.result;
      return competitions;
    }

    console.log(err);
    throw new Error(SOMETHING_WENT_WRONG);
  } catch (err) {
    return null;
  }
};

export const getParticipatedCompetitions = async () => {
  try {
    const response = await Api.get("/competition/participated");
    if (response && response.result) {
      const competitions = response.result;
      return competitions;
    }

    console.log(response.message);
    throw new Error(SOMETHING_WENT_WRONG);
  } catch (err) {
    return null;
  }
};

export const getCompetition = async (competitionCode) => {
  try {
    const response = await Api.get(`/competition/${competitionCode}`);
    if (response.code && response.result) {
      const competition = response.result;
      return competition;
    }

    throw new Error(SOMETHING_WENT_WRONG);
  } catch (error) {
    return null;
  }
};

export const checkMember = async (competitionCode, email) => {
  try {
    //post request to check if the user is a member of the competition
    const response = await Api.post(`/container/check-member-email`, {
      competitionCode,
      email,
    });
    if (response.code && response.result) {
      const { message } = response;
      return { message };
    }

    throw new Error(SOMETHING_WENT_WRONG);
  } catch (error) {
    return null;
  }
};

export const createCompetition = async (newCompetition) => {
  const newCompetitionBody = {
    ...newCompetition,
    categoryArray: newCompetition.categoryName,
    status: "ACTIVE",
  };

  if (newCompetition.competitionType === "TEAM")
    newCompetitionBody.minTeamSize = 2;
  if (newCompetition.image.type === "EMOJI") {
    newCompetitionBody.imageURL = null;
    newCompetitionBody.emojiObject = newCompetitionBody.image.emoji;
  } else {
    newCompetitionBody.imageURL = newCompetitionBody.image.url;
    newCompetitionBody.emojiObject = null;
  }

  try {
    const response = await Api.post(
      "/competition/createCompetition",
      newCompetitionBody
    );

    if (response.code && response.result) {
      const competition = response.result;
      window.location.href = routeGenerator(
        routes.competitionOrganised,
        {
          competitionCode: competition.competitionCode,
        },
        true
      );
      return competition;
    } else {
      console.log(response.message);
      throw new Error(SOMETHING_WENT_WRONG);
    }
  } catch (error) {
    return null;
  }
};

export const checkCompetitionName = async (name) => {
  const competitionName = name.trimStart().trimEnd();
  try {
    const response = await Api.get(
      `competition/check-existing-competition/${competitionName}`
    );
    if (response.result) return true;
    else return false;
  } catch (error) {
    console.log(error);
    return null;
  }
};
