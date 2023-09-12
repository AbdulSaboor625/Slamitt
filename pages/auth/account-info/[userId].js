import { Layout } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppPageHeader } from "../../../components";
import withAuth from "../../../components/RouteAuthHandler/withAuth";
import ProfileContent from "../../../components/modules/profileModule";
import {
  getAllCompetitionsOrganized,
  getAllCompetitionsParticipated,
} from "../../../Redux/Actions";
const AccountInfo = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getAllCompetitionsParticipated());
    dispatch(getAllCompetitionsOrganized());
  }, []);
  return (
    <Layout>
      <Layout.Header>
        <AppPageHeader />
      </Layout.Header>
      <Layout.Content>
        <ProfileContent useOnlyBasicInfo={true} userDetails={auth.user} />
      </Layout.Content>
    </Layout>
  );
};

export default withAuth(AccountInfo);
