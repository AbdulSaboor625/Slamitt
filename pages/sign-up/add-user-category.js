import { Layout } from "antd";
import { AddUserCategoryModule } from "../../modules/sign-up";
import { getContainer } from "../../requests/container";
import { getCompetition } from "../../requests/competition";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { decodeBase64 } from "../../utility/common";
import withAuth from "../../components/RouteAuthHandler/withAuth";

const AddUserCategory = () => {
  const router = useRouter();

  const { to = "", participant = "" } = router.query;
  const [container, setContainer] = useState({});
  const [competition, setCompetition] = useState({});

  useEffect(() => {
    if (participant) {
      const _decoded = participant ? decodeBase64(participant) : {};
      if (_decoded && _decoded.containerCode && _decoded.competitionCode) {
        getContainer(_decoded.containerCode).then((res) => {
          res && setContainer(res);
        });
        getCompetition(_decoded.competitionCode).then((res) => {
          res && setCompetition(res);
        });
      }
    }
  }, [participant]);
  return (
    <Layout>
      <AddUserCategoryModule to={to} participant={participant} />
    </Layout>
  );
};

export default withAuth(AddUserCategory);
