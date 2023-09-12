import { Button, Image, Typography } from "antd";
import React, { useState } from "react";
import CreateTaskModal from "./createTaskModal";
import TaskTabs from "./taskTabs";

const EmptyState = ({ setIsVisibleCreateTaskModal, competition }) => {
  return (
    <div className="tasksContentPlaceholder">
      <div className="tasksContentPlaceholderInner">
        <div className="tasksContentPlaceholderImage">
          <Image
            src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1686204464502_image_514.png"
            alt="empty Image"
            preview={false}
          />
        </div>
        {competition?.status != "CONCLUDED" ? (
          <>
            <Typography.Text className="tasksContentPlaceholderText">
              Setup the round task to begin accepting submissions or manually
              add{" "}
              {competition?.competitionType == "TEAM" ? "team" : "participant"}{" "}
              submissions
            </Typography.Text>
            <Button
              type="primary"
              onClick={() => setIsVisibleCreateTaskModal(true)}
            >
              Create a Task
            </Button>{" "}
          </>
        ) : (
          "You did not setup any tasks for this round"
        )}
      </div>
    </div>
  );
};

const Tasks = ({ round, competition }) => {
  const [task, setTask] = useState(false);
  const [isVisibleCreateTaskModal, setIsVisibleCreateTaskModal] =
    useState(false);
  return (
    <div className="tasksMainContent">
      {round?.submissionsSettings ? (
        <div className="tasksTabsContent">
          <TaskTabs
            round={round}
            competition={competition}
            setIsVisible={setIsVisibleCreateTaskModal}
            from="ORGANISER"
          />
        </div>
      ) : (
        <EmptyState
          competition={competition}
          setIsVisibleCreateTaskModal={setIsVisibleCreateTaskModal}
        />
      )}
      <CreateTaskModal
        isVisible={isVisibleCreateTaskModal}
        setIsVisible={setIsVisibleCreateTaskModal}
        round={round}
        competition={competition}
        setTask={setTask}
      />
    </div>
  );
};

export default Tasks;
