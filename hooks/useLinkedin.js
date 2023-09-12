import { useEffect, useRef, useState } from "react";
// I'm importing axios here just for testing purpose and after test on dev I'll move it
import axios from "axios";
import { judgeSignup, notify } from "../Redux/Actions";
import { store } from "../Redux/store";
import { getUniqueId } from "../utility/common";
import Api from "../services";

const useLinkedinLogin = ({ competitionRoundCode, invitedEmail }) => {
  const popupRef = useRef(null);
  const clientId =
    process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "774rr4konkyr0p";
  const redirectUri = `${process.env.NEXT_PUBLIC_NEXT_URL}/api/linkedin`;
  useEffect(() => {
    return () => {
      window.removeEventListener("message", handleJudgeLoginOnCodeReceive);
      popupRef.current = null;
    };
  }, []);

  const handleJudgeLoginOnCodeReceive = async (event) => {
    console.log(event);
    if (event.origin !== window.location.origin) {
      return;
    }

    const { type, payload } = event.data;
    if (type === "linkedin-login" && payload.code) {
      console.log("payload: ", payload);
      localStorage.setItem("OAUTH2_LINKEDIN_CODE", payload.code);

      store.dispatch(
        judgeSignup({
          competitionRoundCode,
          linkedinCode: payload.code,
        })
      );

      // === this code is under testing but just pushing it for linkedIn login purpose === //
      const response = await axios.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        {
          grant_type: "authorization_code",
          code: payload.code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret:
            process.env.LINKEDIN_CLIENT_SECRET || "oDd1DG2yFFgvPMrZ",
        }
      );

      // get the logged in user's email
      const accessToken = response.data.access_token;

      const getUserEmail = async (accessToken) => {
        const response = await axios.get(
          "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "cache-control": "no-cache",
              "X-Restli-Protocol-Version": "2.0.0",
            },
          }
        );
        return response.data.elements[0]["handle~"].emailAddress;
      };

      const linkedInEmail = await getUserEmail(accessToken);

      let sameEmailAsInvited = invitedEmail === linkedInEmail ? true : false;

      console.log("invitedEmail: ", invitedEmail);
      console.log("linkedInEmail: ", linkedInEmail);
      console.log("sameEmailAsInvited: ", sameEmailAsInvited);

      const removeInvitedJudgeEmail = async () => {
        try {
          const response = await Api.get(
            `judge/getJudges/${competitionRoundCode}`
          );
          if (response.code && response.result) {
            let invitedJudge = response.result.find(
              (item) => item.email === invitedEmail
            );

            const response = await Api.get(
              `/judge/remove-judge/${invitedJudge.judgeCode}`
            );

            if (response.code) {
              console.log(
                "Invited judge email is removed due to linkedIn login with different email. ",
                invitedEmail
              );
            } else {
              throw new Error(response.message);
            }

            return;
          } else {
            throw new Error(response.message);
          }
        } catch (error) {
          dispatch(notify({ type: "error", message: error.message }));
        }
      };

      if (!sameEmailAsInvited) {
        removeInvitedJudgeEmail();
      }

      // === === //
    }
  };

  const handleLogin = () => {
    const scope = "r_liteprofile%20r_emailaddress";
    const state = getUniqueId();
    const responseType = "code";
    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

    popupRef.current = window.open(
      url,
      "Linkedin Login",
      "width=800,height=600",
      true
    );

    const checkPopupClosed = setInterval(() => {
      if (!popupRef.current || popupRef.current.closed) {
        clearInterval(checkPopupClosed);
      } else {
        try {
          if (
            popupRef.current.location.href.indexOf(`${redirectUri}?code=`) !==
            -1
          ) {
            const code = new URLSearchParams(
              popupRef.current.location.search
            ).get("code");
            // store.dispatch(pushRequest());
            window.postMessage(
              { type: "linkedin-login", payload: { code } },
              window.location.origin
            );
            console.log("popupRef: ", popupRef);
            popupRef.current.close();
          }
        } catch (error) {
          console.error(error);
        }
      }
    }, 500);

    window.addEventListener("message", handleJudgeLoginOnCodeReceive);
  };

  return { handleLogin };
};

export default useLinkedinLogin;
