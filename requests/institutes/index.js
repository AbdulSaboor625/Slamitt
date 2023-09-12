import Api from "../../services";
import { SOMETHING_WENT_WRONG } from "../../utility/constants";

export const fetchInstitutes = async () => {
  try {
    const response = await Api.get(`/institute/cgirhpyvay`);
    if (response.code && response.result && response.result.length) {
      return response.result;
    } else {
      throw new Error(SOMETHING_WENT_WRONG);
    }
  } catch (error) {
    return null;
  }
};
