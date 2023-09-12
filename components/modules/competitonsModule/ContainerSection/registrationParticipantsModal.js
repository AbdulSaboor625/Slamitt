import { LinkOutlined } from "@ant-design/icons";
import { Select, Typography } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { encodeBase64 } from "../../../../utility/common";
import { routeGenerator, routes } from "../../../../utility/config";
import AppModal from "../../../AppModal";
import AppQrCode from "../../../AppQrCode";
import { DownloadIcon } from "../../../../utility/iconsLibrary";
import AppSelect from "../../../AppSelect";

const RegistrationParticipantsModal = ({
  isVisible,
  setVisible,
  competition,
  roomCode,
  room,
  setVisibiltyTeamSizeModal,
  dropdownRoom = false,
  roomOptions,
}) => {
  const [roomSelected, setRoomSelected] = useState(roomCode);
  const token = encodeBase64(useSelector((state) => state.auth.slamittToken));
  const [qrUrl, setQrUrl] = useState(null);
  return (
    <AppModal
      className="assignTeamModalParent"
      isVisible={isVisible}
      onOk={() => setVisible(false)}
      onCancel={() => {
        setVisible(false);
      }}
    >
      <div className="assignTeamModal">
        {!dropdownRoom ? (
          <Typography.Title className="assignTeamModalHeading">
            Invite participants to {room?.roomName}
          </Typography.Title>
        ) : (
          <Typography.Title className="assignTeamModalHeading">
            Invite participants to
            <AppSelect
              dropdownRender={(menu) => (
                <div>
                  <div
                    style={{
                      padding: "16px 18px 14px",
                      textTransform: "uppercase",
                      color: "#AEAEAE",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    Lists
                  </div>
                  {menu}
                </div>
              )}
              option={roomOptions}
              value={roomSelected}
              defaultValue={{ label: room.roomName, value: room.roomCode }}
              onChange={(e) => setRoomSelected(e)}
            />
          </Typography.Title>
        )}
        <div className="assignTeamModalContent">
          <div className="qrCodeInfo">
            <Typography.Text className="qrCodeInfoTextLink">
              {" "}
              <LinkOutlined /> Invite via Link
            </Typography.Text>
          </div>
          <div className="invitelinkField">
            <div className="qrCodeInfoText">
              <Typography.Text copyable={{ tooltips: false }}>
                {routeGenerator(
                  routes.inviteParticipantRegistration,
                  {
                    competitionCode: competition?.competitionCode,
                    // roomCode: roomCode,
                    roomCode: roomSelected,
                    token: token,
                  },
                  true
                )}
              </Typography.Text>
            </div>
          </div>
          <div className="qrCodeInfo">
            <Typography.Text className="qrCodeInfoText or">Or</Typography.Text>
            <Typography.Text className="qrCodeInfoTextLink">
              Scan QR Code
              <a href={qrUrl} download>
                <DownloadIcon />
              </a>
            </Typography.Text>
            <Typography.Text className="qrCodeInfoTextLink none">
              Scan or{" "}
              <a
                href={qrUrl}
                download
                style={{
                  marginRight: "0.2rem",
                  marginLeft: "0.2rem",
                  color: "#666",
                  textDecoration: "underline",
                }}
              >
                Download
              </a>{" "}
              QR Code
            </Typography.Text>
          </div>
          <div className="qrCodeBox">
            <AppQrCode
              value={routeGenerator(
                routes.inviteParticipantRegistration,
                {
                  competitionCode: competition?.competitionCode,
                  // roomCode: roomCode,
                  roomCode: roomSelected,
                  token: token,
                },
                true
              )}
              setUrl={(e) => setQrUrl(e)}
            />
          </div>
          <div className="attentionMessageBlock">
            <strong className="attentionMessageBlockTitle">ATTENTION:</strong>
            1. Do not use iPhone&apos;s default QR code scanner as it is
            unreliable for prolonged sessions.
            <br />
            2. Try to avoid using Slamitt on an in-app browser (like within
            Gmail, Instagram, etc). Instead, launch the link into a completely
            new browser session for uninterrupted use.
          </div>
        </div>
        {/* <Button type="primary" className="buttonViewSettings">
          <Typography.Text onClick={() => setVisibiltyTeamSizeModal(true)}>
            View Team Settings
          </Typography.Text>
        </Button> */}
      </div>
    </AppModal>
  );
};

export default RegistrationParticipantsModal;
