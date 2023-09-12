import { Button, Spin, Typography } from "antd";
import React, { useState } from "react";
import {
  ArrowBackIcon,
  ReloadIcon,
  ResetCertificateIcon,
  TickIcon,
  CrossThickIcon,
  TickThickIcon,
} from "../../../../utility/iconsLibrary";
// import { TickIcon } from "@100mslive/hms-video-react";
import { useRouter } from "next/router";
import Api from "../../../../services";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../../../Redux/Actions";

const PreHeaderNavBarCertificates = ({
  screen,
  certificateDetail,
  certificateDetails,
  setCertificateDetail,
  setCertificateDetails,
  institute,
  setInstitute,
  signees,
  setSignees,
  competitionCode,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);

  const saveButtonHandler = async () => {
    try {
      setLoading(true);
      if (screen === "TEXT") {
        const payload = {
          presentedByTextLine:
            certificateDetail?.presentedByTextLine || "Is Proudly Presented By",
          performanceRecognitionTextLine:
            certificateDetail?.performanceRecognitionTextLine ||
            "In Recognition of their Excellent Performance in",
        };

        const response = await Api.post(
          `/certificate/${competitionCode}`,
          payload
        );
        if (response?.code && response?.result && response?.message) {
          setCertificateDetail((prev) => ({
            ...prev,
            presentedByTextLine: response?.result?.presentedByTextLine,
            performanceRecognitionTextLine:
              response?.result?.performanceRecognitionTextLine,
            certificateCode: response?.result?.certificateCode,
            competitionCode: response?.result?.competitionCode,
            competition: response?.result?.competition,
          }));
          setCertificateDetails((prev) => ({
            ...prev,
            presentedByTextLine: response?.result?.presentedByTextLine,
            performanceRecognitionTextLine:
              response?.result?.performanceRecognitionTextLine,
            certificateCode: response?.result?.certificateCode,
            competitionCode: response?.result?.competitionCode,
            competition: response?.result?.competition,
          }));
          dispatch(notify({ type: "success", message: response?.message }));
        }
        if (!response?.code && response?.message) {
          dispatch(notify({ type: "error", message: response?.message }));
        }
      } else if (screen === "INSTITUTE") {
        // if (!certificateDetail?.certificateCode) {
        //   dispatch(
        //     notify({
        //       type: "error",
        //       message: "Certificate not configured.",
        //     })
        //   );
        //   setLoading(false);
        //   return false;
        // }
        const payload = {
          logo: institute?.logo || "",
          name: institute?.name || user?.institute_name,
          competitionCode,
        };

        const response = await Api.post(
          `/certificateInstitute/${certificateDetail?.certificateCode}`,
          payload
        );
        if (response?.code && response?.result && response?.message) {
          setInstitute(response?.result);
          setCertificateDetails((prev) => ({
            ...prev,
            institute: response?.result,
          }));
          dispatch(notify({ type: "success", message: response?.message }));
        }

        if (!response?.code && response?.message) {
          dispatch(notify({ type: "error", message: response?.message }));
        }
      } else if (screen === "SIGNATURE") {
        // if (!certificateDetail?.certificateCode) {
        //   dispatch(
        //     notify({
        //       type: "error",
        //       message: "Certificate not configured.",
        //     })
        //   );
        //   setLoading(false);
        //   return false;
        // }

        // if (signees.length < 1) {
        //   dispatch(
        //     notify({
        //       type: "error",
        //       message: "Add atleast one signee.",
        //     })
        //   );
        //   setLoading(false);
        //   return false;
        // }
        const payload = [];
        if (signees && !!signees?.length) {
          for (let i = 0; i < signees?.length; i++) {
            const { name, designation } = signees[i];
            if (!(!name && !designation))
              if (name === "" || designation === "") {
                dispatch(
                  notify({
                    type: "error",
                    message: "Invalid signee " + (i + 1),
                  })
                );
                setLoading(false);
                return false;
              }
          }

          signees?.forEach((item) => {
            const data = {};
            // if (item?.signature) data.signature = item?.signature;
            data.signature = item?.signature;
            // if (item?.name) data.name = item?.name;
            data.name = item?.name;
            // if (item?.designation) data.designation = item?.designation;
            data.designation = item?.designation;
            if ("isHidden" in item) data.isHidden = item?.isHidden;
            payload.push(data);
          });
        }

        const response = await Api.post(
          `/certificateSignee/${certificateDetail?.certificateCode}?competitionCode=${competitionCode}`,
          payload || []
        );
        if (response?.code && response?.result && response?.message) {
          dispatch(notify({ type: "success", message: response?.message }));
          setSignees(response?.result);
          setCertificateDetails((prev) => ({
            ...prev,
            signees: response?.result,
          }));
        }

        if (!response?.code && response?.message) {
          dispatch(notify({ type: "error", message: response?.message }));
        }
      }
      setLoading(false);
    } catch (error) {
      console.log("SaveCertificateError: ", error);
      setLoading(false);
    }
  };

  return (
    <div className="certificatesPageHeader">
      <div className="certificatesPageHeaderLeft">
        <Button
          className="certificatesPageBackButton"
          icon={<ArrowBackIcon />}
          // onClick={() => router.back()}
          onClick={() =>
            router.push(
              `/auth/competitions/o/${competitionCode}?content=settings&tab=certificates`
            )
          }
        />
        <Typography.Title level={3} className="certificatesPageHeaderTitle">
          Placements & Rewards
        </Typography.Title>
      </div>
      <div className="certificatesPageHeaderRight">
        <div className="certificatesPageHeaderButtons">
          <Button
            className="certificatesPageButton"
            icon={<ReloadIcon />}
            onClick={() => {
              if (screen === "TEXT") {
                setCertificateDetail((prev) => ({
                  ...prev,
                  presentedByTextLine: certificateDetails?.presentedByTextLine,
                  performanceRecognitionTextLine:
                    certificateDetails?.performanceRecognitionTextLine,
                }));
              } else if (screen === "INSTITUTE") {
                setInstitute(certificateDetails?.institute);
              } else if (screen === "SIGNATURE") {
                setSignees(certificateDetails?.signees);
              }
            }}
          >
            <span className="iconCross visibleTabletMobile">
              <CrossThickIcon />
            </span>
            Reset Setting
          </Button>
          <Button
            className="certificatesPageButton buttonSave"
            icon={!loading && <TickIcon />}
            onClick={saveButtonHandler}
            disabled={loading}
          >
            <span className="iconTick visibleTabletMobile">
              <TickThickIcon />
            </span>
            {loading ? <div className="loader-icon" /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreHeaderNavBarCertificates;
