import { Button, Image, Typography } from "antd";
import React from "react";
import { CheckedGreenIcon, SettingsNewIcon } from "../../../../utility/iconsLibrary";
import AppModal from "../../../AppModal";

const RegistrationSetUp = ({ isVisible, setIsVisible }) => {
  return (
    <AppModal className="registrationSetupModal" isVisible={isVisible} onCancel={() => setIsVisible(false)}>
      <div className="registrationSetupModalHolder">
        <Image
          preview={false}
          src={
            "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687891327593_image_4191.png"
          }
          alt=""
        />
        <Typography.Text className="registrationSetupModalTitle">Registration Setup</Typography.Text>
        <ul className="registrationSetupList">
          <li>
            <CheckedGreenIcon />
            <p>Entry is open to all Organisations/Institutes</p>
          </li>
          <li>
            <CheckedGreenIcon /> 
            <p>Participants within a team are not required to belong to the same Organisation/Institute</p>
          </li>
          <li>
            <CheckedGreenIcon /> 
            <p>Number of registrations per Organisation/Institute is <i>not limited</i></p>
          </li>
          <li>
            <CheckedGreenIcon /> 
            <p>Teams can create and register with their own codes</p>
          </li>
        </ul>
        <Button className="registrationSetupModalButton"><SettingsNewIcon/> Settings</Button>
      </div>
    </AppModal>
  );
};

export default RegistrationSetUp;
