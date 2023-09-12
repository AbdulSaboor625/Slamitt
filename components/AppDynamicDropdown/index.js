import { PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Image, Menu, Tooltip } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContainers, getAllRounds, notify } from "../../Redux/Actions";
import Api from "../../services";
import { getUniqueId } from "../../utility/common";
import {
  ArrowDownIcon,
  DeleteIcon,
  EditPencilIcon,
} from "../../utility/iconsLibrary";
import FormField from "../FormField";
import DeleteContainerModal from "../modules/competitonsModule/DeleteContainerModal";

const AppDynamicDropdown = ({
  readOnlyState,
  label,
  iconShow,
  handleSelect,
  handleSubmit,
  handleDelete,
  handleUpdate,
  staticItems,
  dynamicItems,
}) => {
  const [editField, setEditField] = useState("");
  const [isFieldShowing, setShowField] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemDelete, setItemDelete] = useState();
  const [rounds, setRounds] = useState();
  const allRounds = useSelector((state) => state.competition.allRounds);

  const findRoundsInARoom = (roomCode) => {
    return allRounds.filter((round) => round.assignedRoomCode === roomCode);
  };
  const [deleteText, setDeleteText] = useState("");

  const dynamicMenuList = () =>
    dynamicItems.map((item, index) => {
      let deletePopuptext = `Do you want to delete ${item.label}`;
      const roundsInRoom = findRoundsInARoom(item.roomCode);
      if (!!roundsInRoom.length) {
        deletePopuptext = (
          <p style={{ color: "black" }}>
            This list has been connected to{" "}
            <Tooltip
              color="black"
              placement="top"
              title={`${roundsInRoom?.map(
                (round, i) => `${round?.roundName} `
              )}`}
            >
              <strong className="underline">
                {roundsInRoom.length > 1 ? "multiple rounds" : "a round"}
              </strong>
            </Tooltip>
            . Delete the rounds to delete this list.
          </p>
        );
      } else {
        if (item?.containerCount === 1) {
          deletePopuptext = `There is a Contestant code within this list that will get deleted along with the list. Are you sure you want to delete this list?`;
        }
        if (item?.containerCount > 1) {
          deletePopuptext = `There are Contestant codes within this list that will get deleted along with the list. Are you sure you want to delete this list?`;
        }
      }

      return (
        <div key={index}>
          {editField === item.value ? (
            <FormField
              type="text"
              placeholder={item.label}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdate({ ...item, roomName: e.target.value });
                  setEditField("");
                }
              }}
            />
          ) : (
            <li
              className="dropdownMenuCustomItem"
              key={index}
              icon={
                item.image ? (
                  <Image
                    preview={false}
                    src={item.image}
                    height={20}
                    width={20}
                    alt="categories"
                  />
                ) : null
              }
            >
              {/* <a target="_blank" rel="noopener noreferrer" href={item?.url}> */}
              <div
                className="dropdownMenuCustomItemText"
                onClick={() => {
                  handleSelect(item);
                }}
              >
                {item.label}
              </div>

              {/* </a> */}
              {!readOnlyState && (
                <div className="dropdownMenuCustomIcons">
                  <Button
                    type="text"
                    icon={<EditPencilIcon />}
                    onClick={() => setEditField(item.value)}
                  />

                  {/* {roundsInRoom.length > 0 ? ( */}
                  {/* <Tooltip
                    color="white"
                    placement="bottom"
                    title={roundsInRoom.length > 0 &&
                      <p style={{ color: "red" }}>
                        This list has been connected to{" "}
                        <Tooltip
                          color="black"
                          placement="top"
                          title={`${roundsInRoom?.map(
                            (round, i) => `${round?.roundName} `
                          )}`}
                        >
                          <strong className="underline">
                            {roundsInRoom.length > 1
                              ? "multiple rounds"
                              : "a round"}
                          </strong>
                        </Tooltip>
                        . Delete the rounds to delete this list.
                      </p>
                    }
                  > */}
                  <Button
                    type="text"
                    onClick={() => {
                      setRounds(roundsInRoom);
                      setItemDelete(item);
                      setDeleteText(deletePopuptext);
                      setIsDeleteModalVisible(true);
                    }}
                    icon={<DeleteIcon />}
                  />
                  {/* </Tooltip> */}
                  {/* ) : (
                    <Popconfirm
                      okText="DELETE"
                      okType="button"
                      cancelText="CANCEL"
                      onConfirm={() => handleDelete(item)}
                      title={deletePopuptext}
                    >
                      <Button
                        type="text"
                        icon={<DeleteIcon />}
                        // onClick={() => {
                        //   handleDelete(item);
                        // }}
                      />
                    </Popconfirm>
                  )} */}
                </div>
              )}
            </li>
          )}
        </div>
      );
    });

  const menuAdder = (
    <li
      className="ant-dropdown-menu-item dropdownMenuCustomLink"
      key={getUniqueId()}
    >
      {isFieldShowing && (
        <FormField
          type={"text"}
          placeholder="List Name"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e.target.value);
              setShowField(false);
            }
          }}
        />
      )}

      {!editField && (
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={() => setShowField(true)}
        >
          Add Custom
        </Button>
      )}
    </li>
  );

  const staticMenuList = () => {
    return staticItems.map((item, index) => (
      <Menu.Item
        key={item.key}
        onClick={() => {
          handleSelect(item);
        }}
      >
        <div>{item.label}</div>
        {/* <a target="_blank" rel="noopener noreferrer" href={item?.url}> */}
        {/* </a> */}
      </Menu.Item>
    ));
  };

  const menuList = () => {
    const staticlist = staticMenuList();
    const dynammicList = dynamicMenuList();
    let list = [...staticlist, ...dynammicList];
    if (!readOnlyState) list = [...list, menuAdder];
    return <Menu>{list}</Menu>;
  };
  const dispatch = useDispatch();

  const _deleteRound = async (round) => {
    try {
      const response = await Api.get(
        `round/delete/${round.competitionRoundCode}`
      );
      if (response.code) {
        dispatch(getAllRounds({ cCode: round.competitionCode, initial: true }));
        dispatch(getAllContainers());
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ message: error.message, type: "error" }));
    }
  };

  return (
    <>
      <DeleteContainerModal
        deletePopuptext={deleteText}
        isModalVisible={isDeleteModalVisible}
        hideModal={() => setIsDeleteModalVisible(false)}
        deleteContainer={() => {
          if (!!rounds?.length) rounds.forEach((round) => _deleteRound(round));
          else handleDelete(itemDelete);
        }}
      />
      <Dropdown
        overlay={menuList}
        trigger={["click"]}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
      >
        <a className="ant-dropdown-link">
          {label} {iconShow && <ArrowDownIcon />}
        </a>
      </Dropdown>
    </>
  );
};

export default AppDynamicDropdown;
