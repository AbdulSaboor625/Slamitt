import { store } from "../Redux/store";

export default class SegmentHandler {
  static EVENTS = Object.freeze({
    SIGN_UP: "SIGN_UP",
    SIGN_UP_COMPLETED: "SIGN_UP/COMPLETED",
    SIGN_IN: "SIGN_IN",
    RESET_PASSWORD: "SIGN_IN/RESET_PASSWORD",
    FORGOT_PASSWORD: "SIGN_IN/FORGOT_PASSWORD",
    COMPETITION_CREATE_PHASE_1: "COMPETITION/CREATE/STEP_1",
    COMPETITION_CREATE_PHASE_2: "COMPETITION/CREATE/STEP_2",
    COMPETITION_CREATE_PHASE_3: "COMPETITION/CREATE/STEP_3",
    ALLOW_REGISTRATION: "COMPETITION/REGISTRATION/ALLOW_REGISTRATION",
    BULK_UPLOAD: "COMPETITION/REGISTRATION/BULK_UPLOAD",
  });

  static ERROR_MESSAGES = Object.freeze({
    EVENT_NOT_FOUND: "No such event exists!",
  });

  constructor(segment) {
    this.analytics = segment;
  }

  /**
   * The function sets the user's activity status and identifies the user for analytics purposes.
   * @param [user=null] - A user object containing information such as userCode, email, and type
   * (either "USER" or "JUDGE").
   * @param [type=USER] - The type of user, which can be either "USER" or "JUDGE". If no user is
   * provided, the default type is "USER".
   */
  setUserActive(user = null, type = "USER") {
    const { auth, judge } = store.getState();
    let payload = {};
    if (user) {
      payload = {
        userCode: type === "USER" ? user.userCode : user.judgeCode,
        email: user.email,
        type: type === "USER" ? "USER" : "JUDGE",
      };
    } else if (auth.judgeToken)
      payload = {
        userCode: judge.judgeCode,
        email: judge.email,
        type: "JUDGE",
      };
    else if (auth.slamittToken)
      payload = {
        userCode: auth.user.userCode,
        email: auth.user.email,
        type: "USER",
      };
    else payload = { userCode: "", type: "GUEST" };

    if (payload.userCode) {
      this.analytics.identify(payload.userCode, payload);
    } else {
      this.analytics.identify(null, payload);
    }
  }

  /**
   * The function tracks a user event using Segment and sends the event payload to the Segment
   * instance.
   * @param event - The name or type of the event being tracked. It could be something like
   * "buttonClicked" or "formSubmitted".
   */
  trackUserEvent(event, payload) {
    const eventPayload = this.getEventPayload(event, payload);
    console.log(eventPayload);
    if (eventPayload instanceof Error) throw eventPayload;

    this.analytics.track(event, payload);
  }

  /**
   * The function returns a new Error object with the provided message.
   * @param message - The error message that will be included in the Error object that is returned.
   * @returns A new Error object with the specified message is being returned.
   */
  getError(message) {
    return new Error(message);
  }

  /**
   * The function returns an event payload object based on the event and user input.
   * @param event - The event parameter is a string that represents the type of event being triggered. It
   * is used to determine what data should be included in the payload.
   * @param user - The `user` parameter is an object that contains information about the user who
   * triggered the event. It has two properties: `type` and `userCode`. These properties are used to
   * create the payload for the `SIGN_IN` event in the Segment analytics system.
   * @returns an object with properties "user_type" and "user_code" if the "event" parameter matches the
   * "SIGN_IN" event in the Segment.EVENTS object. If the "event" parameter does not match any event in
   * the EVENTS object, the function returns an error message using the getError() function. However, the
   * implementation of the getError() function is not shown
   */
  getEventPayload(event, payload) {
    switch (event) {
      case SegmentHandler.EVENTS.SIGN_IN:
        return {
          user_type: "USER",
          firstName: payload.fName,
          lastName: payload.lName,
          userCode: payload.userCode,
          email: payload.email,
        };
      default:
        return payload;
    }
  }
}
