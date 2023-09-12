export const onDoneBasicInfo = (data, userCode) => {
  try {
    if (userCode) {
      const response = Api.update(`user/update-user/${userCode}`, data);
    }
  } catch (e) {}
};
