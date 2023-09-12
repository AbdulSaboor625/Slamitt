import { Layout } from "antd";
import { AddUserCategoryModule } from "../../../modules/sign-up";

import withAuth from "../../../components/RouteAuthHandler/withAuth";

const AddUserCategory = () => {
  return (
    <Layout>
      <AddUserCategoryModule to={""} participant={""} from="PROFILE" />
    </Layout>
  );
};

export default withAuth(AddUserCategory);
