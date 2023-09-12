import { store } from "../Redux/store";
import { isValidEmail } from "./common";
export const emailRule = [
  {
    required: true,
    message: "Email is required!",
  },
  {
    type: "email",
    message: "Please enter a valid Email!",
  },
];

export const confirmPasswordRule = [
  {
    required: true,
    message: "Please confirm your password!",
  },
  ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(
        new Error("Passwords that you entered do not match!")
      );
    },
  }),
];

export const passwordRule = [
  {
    required: true,
    message: "Please add your password!",
  },
  {
    min: 6,
    message: "Passwords should not be less than 6 characters",
  },
  // {
  //   validator: (_, value) => {
  //     if (value.length < 6) {
  //       return Promise.reject(
  //         new Error("Passwords should not be less than 6 characters")
  //       );
  //     }
  //     return Promise.resolve();
  //   },
  // },
];

export const textRule = [{ required: true, message: "This Field is required" }];

export const uploadMediaRule = [
  {
    required: true,
    message: "This Field is required",
  },
];

/**
 *
 * @param {array} institutes[]
 * @returns {object} {valid:true,message:""}
 *
 * valid is true if all users are from same institute or competition is not belongs to institute
 */
export const validateContainerInstitute = (instituteIdx, data) => {
  const { competition, containers } = store.getState();
  const defaultInstitute = "";
  const containerWithUser = containers.all.find((cnt) => cnt.users.length);
  if (containerWithUser)
    defaultInstitute = containerWithUser.users[0].institute;

  if (competition.isBelongsToSameOrgOrInstitute) {
    const filteredData = data.filter((row) => {
      if (defaultInstitute) {
        if (row[instituteIdx] === defaultInstitute) return row;
        else return false;
      } else return row;
    });
    return {
      valid: Boolean(filteredData.length === data.length),
      message:
        filteredData.length === data.length
          ? ""
          : "row skipped due to user belonged to some other institute",
      filteredData,
    };
  }
  return {
    valid: true,
    message: "",
    filteredData: data,
  };
};

/**
 *
 * @param {array} containers[]
 * @returns {object}  {
    valid: boolean,
    duplicate:[],
    nonDuplicate:[],
    duplicatesWithinSameList:[]
  };
 *
 * valid is true if all containers are unique else valid will be false and it will return a list of duplicate containers and non duplicate too
 */
export const validateDuplicateContainers = (uploadedContainers) => {
  const { containers } = store.getState();
  const duplicate = [];
  const nonDuplicate = [];
  uploadedContainers.forEach((uploadedContainer) => {
    const cnt = containers.all.find(
      (container) => uploadedContainer.containerName === container.containerName
    );
    if (cnt) duplicate.push(uploadedContainer);
    else nonDuplicate.push(uploadedContainer);
  });

  // const duplicatesWithinSameList = uploadedContainers.filter(
  //   (cnt) =>
  //     uploadedContainers.filter(
  //       (item) =>
  //         item.containerName.toLowerCase() === cnt.containerName.toLowerCase
  //     ).length > 1
  // );
  return {
    valid: !Boolean(duplicate.length),
    duplicate,
    nonDuplicate,
    // duplicatesWithinSameList,
  };
};

/**
 *
 * @param {array,number} containers[],emailIdx
 * @returns {object} {filteredData:[]}
 *
 * remove duplicate users which are duplicates within same list as well as in competition and is not an organizer or member of crew
 */
export const validateContainerUsers = (data, isSolo = true) => {
  const { competition, containers } = store.getState();
  const validated = [];
  const skipped = [];
  const organizerEmail = competition.current.Organizer.email.toLowerCase();
  const crewEmails = competition.current.crew.map((crew) =>
    crew.email.toLowerCase()
  );
  const emailsOfAllUploadedRows = [];
  containers.all.forEach((cnt) => {
    const emails = cnt.users.map((usr) => usr.email);
    emailsOfAllUploadedRows.push(...emails);
  });

  for (const row of data) {
    // initial validation state is false which means all fails the validations
    const validationPhaseChecks = {
      validEmail: false,
      containerNamePresent: false,
      duplicateContainer: false,
      duplicateEmail: false,
      organizer: false,
      crew: false,
      containerisNotAlreadyOccupied: false,
      emailNotExists: false,
      firstNamePresent: false,
    };

    row.reasons = [];

    // validation for if the row is empty
    if (
      row?.firstName === "" &&
      row?.lastName === "" &&
      row?.email === "" &&
      row?.containerName === ""
    ) {
      continue;
    }

    // Container Name is empty
    if (row?.containerName) {
      validationPhaseChecks.containerNamePresent = true;
    } else {
      row.reasons.push(`${isSolo ? "Participant" : "Team"} code is empty`);
    }

    // validation for if the container has already been occupied
    const cont = containers.all.find(
      (cnt) => cnt?.containerName === row.containerName
    );
    if (!cont) validationPhaseChecks.containerisNotAlreadyOccupied = true;
    else
      row.reasons.push(
        `${isSolo ? "Participant" : "Team"} code is already occupied`
      );

    // validation for duplicate container name
    const getDuplicateContainerNameLength = validated.filter(
      (val) => val.containerName === row.containerName
    ).length;
    if (getDuplicateContainerNameLength === 0) {
      validationPhaseChecks.duplicateContainer = true;
    } else {
      row.reasons.push(
        `${isSolo ? "Participant" : "Team"} code with this name already exists`
      );
    }

    if (row?.email) {
      // validation for if the container email is valid
      if (row?.email && isValidEmail(row?.email)) {
        validationPhaseChecks.validEmail = true;
      } else {
        row.reasons.push("Invalid Email");
      }

      // validation if the email is already used
      const isEmailExists = emailsOfAllUploadedRows.find(
        (e) => e === row.email
      );
      if (!isEmailExists) validationPhaseChecks.emailNotExists = true;
      else row.reasons.push("User with this email already exists");

      // validation for duplicate emails
      const getDuplicateEmailsLength = validated.filter(
        (val) => val.email === row.email
      ).length;
      if (getDuplicateEmailsLength === 0) {
        validationPhaseChecks.duplicateEmail = true;
      } else {
        row.reasons.push("User with this email already exists");
      }

      // validation for organizer emails
      const rowWithEmailSameAsOrganizer = data.find(
        (row) => row?.email?.toLowerCase() === organizerEmail?.toLowerCase()
      );
      if (!rowWithEmailSameAsOrganizer) {
        validationPhaseChecks.organizer = true;
      } else {
        row.reasons.push("User is an organizer");
      }

      // validation for crew emails
      const rownWithEmailSameAsCrew = data.find((row) =>
        crewEmails.includes(row?.email?.toLowerCase())
      );
      if (!rownWithEmailSameAsCrew) {
        validationPhaseChecks.crew = true;
      } else {
        row.reasons.push("User is a crew member");
      }

      // validation for first name
      if (row?.firstName) {
        validationPhaseChecks.firstNamePresent = true;
      } else {
        row.reasons.push("First name is empty");
      }
    } else {
      validationPhaseChecks = {
        ...validationPhaseChecks,
        validEmail: true,
        emailNotExists: true,
        duplicateEmail: true,
        organizer: true,
        crew: true,
        firstNamePresent: true,
      };
    }

    // if any validation fails it would be added to skipped
    if (Object.values(validationPhaseChecks).every((val) => val === true)) {
      validated.push(row);
    } else {
      skipped.push(row);
    }
  }

  return {
    validated,
    skipped,
  };
};

export const groupContainersFromRows = (rows, roomCode) => {
  const { competition, rooms } = store.getState();
  const groupedUsersToContainers = {};
  const filteredRows = [];
  rows.forEach((container, idx) => {
    if (groupedUsersToContainers.hasOwnProperty(container.containerName)) {
      if (
        Array.isArray(
          groupedUsersToContainers[container.containerName].users
        ) &&
        container.email &&
        groupedUsersToContainers[container.containerName].users.length <
          competition.current.teamSize
      ) {
        filteredRows.push(container);
        groupedUsersToContainers[container.containerName].users.push({
          firstName: container.firstName,
          lastName: container.lastName,
          email: container.email,
        });
      } else if (
        container.email &&
        groupedUsersToContainers[container.containerName].users.length <
          competition.current.teamSize
      ) {
        filteredRows.push(container);

        groupedUsersToContainers[container.containerName].users = [
          {
            firstName: container.firstName,
            lastName: container.lastName,
            email: container.email,
          },
        ];
      }
    } else {
      filteredRows.push(container);

      groupedUsersToContainers[container.containerName] = {
        containerName: container.containerName,
        competitionCode: competition.current.competitionCode,
        roomCode: roomCode || rooms.selected.roomCode,
        competitionRoomCode: rooms.selected.competitionRoomCode,
        index: idx + 1,
        users: container.email
          ? [
              {
                firstName: container.firstName,
                lastName: container.lastName,
                email: container.email,
                institute: container.institute,
              },
            ]
          : [],
      };
    }
  });

  return { groupedContainers: groupedUsersToContainers, filteredRows };
};
