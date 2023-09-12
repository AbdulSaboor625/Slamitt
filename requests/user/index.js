import Api from "../../services";

export const createUser = async (payload) => {
  try {
    const response = await Api.post("/user/createUser", payload);
    if (response.code && response.result) return response.result;
    else throw new Error(response.message);
  } catch (error) {
    return null;
  }
};

export const createOrLoginInvitedUser = async (payload) => {
  try {
    const response = await Api.post("/user/create-user-invited", payload);
    if (response.code && response.result) return response.result;
    else throw new Error(response.message);
  } catch (error) {
    return null;
  }
};

export const getUserDetails = async (userCode, payload = {}) => {
  try {
    const response = await Api.get(`/user/${userCode}`);
    if (response.code && response.result) return response.result;
    else throw new Error(response.message);
  } catch (error) {
    console.log("user response", error);
    return null;
  }
};

export const checkEmail = async (email) => {
  try {
    const response = await Api.post(`/user/checkEmail`, {
      email,
    });

    if (response.code && response.result && response.result.userCode)
      return response.result;
    else throw new Error(response.message);
  } catch (error) {
    // console.log("user response", error);
    return null;
  }
};
