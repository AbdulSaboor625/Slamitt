import { Layout } from "antd";
import { AppPageHeader } from "../../../../components";
import withAuth from "../../../../components/RouteAuthHandler/withAuth";
import ParticipantsV2 from "../../../../components/modules/participantsDashboardModule/v2";

const Competitions = ({ pusher }) => {
  return (
    <Layout>
      <Layout.Header>
        <AppPageHeader participantSection={true} />
      </Layout.Header>
      <Layout.Content>
        {/* <ParticipantsV1 pusher={pusher} /> */}
        <ParticipantsV2 pusher={pusher} />
      </Layout.Content>
    </Layout>
  );
};

export default withAuth(Competitions);
