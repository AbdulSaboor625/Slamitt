import { Input, Typography } from "antd";
import { useEffect } from "react";
import AppNameAvater from "../../../../AppAvatar/AppNameAvater";
import {
  CheckedGreenIcon,
  CrossCircleIcon,
  DotsIcon,
} from "../../../../../utility/iconsLibrary";
import moment from "moment";

const RegistrationTable = ({
  data,
  setSelectedContainers,
  selection,
  index,
  handleContainer,
}) => {
  return (
    <div className="registrationTableRow">
      {/* <div className="tableIdBox">
        {competition?.status !== "CONCLUDED" && (
          <label className="tableIdCheckbox">
            <Input
              type="checkbox"
              checked={!!selectedContiners?.length || selection}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelection(true);
                  // const selections = [];
                  // registrationData.forEach((item) => {
                  //   item.isSelected = true;
                  //   selections.push(item.containerCode);
                  // });
                  // setSelectedContainers(selections);
                } else {
                  setSelection(false);
                  registrationData.forEach((item) => {
                    item.isSelected = false;
                  });
                  setSelectedContainers([]);
                }
              }}
            />
            <span className="customChecbox"></span>
            <span className="tableIdNumber">{index + 1}</span>
          </label>
        )}
        <div className="textOverflow">{data?.containerCode}</div>
      </div> */}
      <div className={`tableIdBox ${!data?.containerName && "invisible"}`}>
        {selection && (
          <label className="tableIdCheckbox">
            <Input
              type="checkbox"
              checked={data.isSelected}
              onChange={(e) => {
                if (e.target.checked) {
                  data.isSelected = true;
                  setSelectedContainers((prev) => [
                    ...prev,
                    ...[data.containerCode],
                  ]);
                } else {
                  data.isSelected = false;
                  setSelectedContainers((prev) =>
                    prev.filter((item) => item != data.containerCode)
                  );
                }
              }}
            />
            <span className="customChecbox"></span>
            <span className="tableIdNumber">{data?.index + 1}</span>
          </label>
        )}
        <div className="textOverflow" onClick={() => handleContainer(data)}>
          {data?.containerName}
        </div>
      </div>
      <div className="registrationTableRowContent">
        {/* {data?.users?.map((item) => ( */}
        <div className="registrationTableRowContentRow">
          <div className="tableNameBox">
              <div className="flex items-center space-x-2" onClick={() => handleContainer(data)}>
                <AppNameAvater user={data?.user} />
                <div className="textOverflow">
                  {data?.user?.firstName} {data?.user?.lastName}
                </div>
            </div>
          </div>
          <div className="tableEmailBox">
            <div className="textOverflow" onClick={() => handleContainer(data)}>
              {data?.user?.email}
            </div>
          </div>
          <div className="tableOrganisationBox">
            <div className="textOverflow" onClick={() => handleContainer(data)}>
              {data?.user?.institute}
            </div>
          </div>
          <div className="tableRegisteredBox">
            <div className="textOverflow" onClick={() => handleContainer(data)}>
              {data?.user?.createdAt
                ? moment(data?.user?.createdAt).format("DD/MM/YYYY hh:mm A")
                : null}
            </div>
          </div>
          <div className="tableStatusBox">
            <div className="textOverflow" onClick={() => handleContainer(data)}>
              {data?.user.status == "DENIED" ? (
                <div className="registrationStatusText">
                  <CrossCircleIcon className="iconCancle" />{" "}
                  <span className="statusText textOverflow">Denied</span>
                </div>
              ) : data?.user.status == "ONBOARDED" ? (
                <div className="registrationStatusText">
                  <CheckedGreenIcon className="iconChecked" />{" "}
                  <span className="statusText textOverflow">Registered</span>
                </div>
              ) : (
                <div className="registrationStatusText">
                  <DotsIcon className="iconInvited" />{" "}
                  <span className="statusText textOverflow">Invited</span>
                </div>
              )}
            </div>
          </div>
          <div className="tableListBox">
            <div className="textOverflow" onClick={() => handleContainer(data)}>
              {data?.list}
            </div>
          </div>
        </div>
        {/* // ))} */}
      </div>
    </div>
  );
};

export default RegistrationTable;
