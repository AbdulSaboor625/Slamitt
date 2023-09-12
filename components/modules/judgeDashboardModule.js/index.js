import { Layout } from "antd";
import React, { useEffect, useState } from "react";
import Content from "./Content";
import Header from "./Header";

const JudgeDashboardModule = ({ pusher, competitionRoundCode }) => {
  const [second, setSecond] = useState("00");
  const [minute, setMinute] = useState("00");
  const [hour, setHour] = useState("");
  const [counter, setCounter] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [pusherChannel, setPusherChannel] = useState(null);

  useEffect(() => {
    let intervalId;

    intervalId = setInterval(() => {
      const hourCounter = Math.floor(counter / 3600);
      const minuteCounter = Math.floor((counter - hourCounter * 3600) / 60);
      const secondCounter = counter % 60;

      let computedSecond =
        String(secondCounter).length === 1
          ? `0${secondCounter}`
          : secondCounter;
      let computedMinute =
        String(minuteCounter).length === 1
          ? `0${minuteCounter}`
          : minuteCounter;

      let computedHour =
        String(hourCounter).length === 1 ? `0${hourCounter}` : hourCounter;

      setSecond(computedSecond);
      setMinute(computedMinute);
      hourCounter !== 0 && setHour(computedHour);

      setCounter((counter) => counter + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [counter]);

  useEffect(() => {
    if (sessionStorage.getItem("sessionTimer")) {
      const timer = sessionStorage.getItem("sessionTimer");
      if (timer && timer.length) {
        const divisions = timer.slice(1, -1).split(":");
        if (divisions.length == 3) {
          setHour(divisions[0]);
          setMinute(divisions[1]);
          setSecond(divisions[2]);
          setCounter(
            parseInt(divisions[0]) * 3600 +
              parseInt(divisions[1]) * 60 +
              parseInt(divisions[2])
          );
        } else {
          setMinute(divisions[0]);
          setSecond(divisions[1]);
          setCounter(parseInt(divisions[0]) * 60 + parseInt(divisions[1]));
        }
      }
    }
  }, [sessionStorage.getItem("sessionTimer")]);

  let sessionTimer = `${hour !== "" ? hour + ":" : ""}${minute}:${second}`;

  return (
    <Layout className="body-scrollable">
      <Layout.Header>
        <Header
          pusherChannel={pusherChannel}
          isOnline={isOnline}
          competitionRoundCode={competitionRoundCode}
        />
      </Layout.Header>
      <Layout.Content>
        <Content
          pusherChannel={pusherChannel}
          setPusherChannel={setPusherChannel}
          isOnline={isOnline}
          setIsOnline={setIsOnline}
          sessionTimer={sessionTimer}
          competitionRoundCode={competitionRoundCode}
          pusher={pusher}
        />
      </Layout.Content>
    </Layout>
  );
};

export default JudgeDashboardModule;
