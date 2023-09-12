import Api from "../../services";

export const getProfileDetails = async (userId) => {
  try {
    const response = await Api.get(`/profile/${userId}`);
    if (response.code && response.result) return response.result;
    else throw new Error(response.message);
  } catch (error) {
    return null;
  }
};

export const getEndorsements = async (userId, pageOffest) => {
  try {
    const response = await Api.get(
      `/profile/endorsements/${userId}?offset=${pageOffest}&limit=${6}`
    );
    if (response.code && response.result) return response.result;
    else throw new Error(response.message);
  } catch (error) {
    return null;
  }
};

export const getFeedbacks = async (userId, pageOffest) => {
  try {
    const response = await Api.get(
      `/profile/feedbacks/${userId}?offset=${pageOffest}&limit=${6}`
    );
    if (response.code && response.result) return response.result;
    else throw new Error(response.message);
  } catch (error) {
    return null;
  }
};

export const getCompetitions = async (userId, pageOffest) => {
  try {
    const response = await Api.get(
      `/profile/competitions/${userId}?offset=${pageOffest}&limit=${6}`
    );
    if (response.code && response.result) return response.result;
    else throw new Error(response.message);
  } catch (error) {
    return null;
  }
};
