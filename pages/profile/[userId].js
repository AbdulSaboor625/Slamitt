import { Layout } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppPageHeader } from "../../components";
import ProfileContent from "../../components/modules/profileModule";
import {
  getAllCompetitionsOrganized,
  getAllCompetitionsParticipated,
} from "../../Redux/Actions";
import withAuth from "../../components/RouteAuthHandler/withAuth";
const Profile = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    if (auth.slamittToken) {
      dispatch(getAllCompetitionsParticipated());
      dispatch(getAllCompetitionsOrganized());
    }
  }, [auth.slamittToken]);
  return (
    <Layout>
      <Layout.Header>
        {auth.slamittToken ? <AppPageHeader /> : <div></div>}
      </Layout.Header>
      <Layout.Content>
        <ProfileContent />
      </Layout.Content>
    </Layout>
  );
};

export default withAuth(Profile);
