import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DashBoardModule } from "../../../components";
import withAuth from "../../../components/RouteAuthHandler/withAuth";
import {
  clearPersistConfig,
  getAllCompetitionsOrganized,
  getAllCompetitionsParticipated,
  getCategoryAndSubCategory,
} from "../../../Redux/Actions";
import { routeGenerator, routes } from "../../../utility/config";

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const persistConfig = useSelector((state) => state.persistConfig);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (persistConfig.competitionCode && persistConfig?.email === user?.email) {
      const url = persistConfig.organized
        ? routeGenerator(routes.competitionOrganised, {
            competitionCode: persistConfig.competitionCode,
          })
        : routeGenerator(routes.competitionParticipated, {
            competitionCode: persistConfig.competitionCode,
          });
      if (
        persistConfig.organized &&
        user.userCode === persistConfig.createdBy
      ) {
        router.replace(url);
        return;
      } else if (!persistConfig.organized) {
        router.replace(url);
        return;
      } else {
        dispatch(clearPersistConfig());
      }
    }
    dispatch(getCategoryAndSubCategory());
    dispatch(getAllCompetitionsParticipated());
    dispatch(getAllCompetitionsOrganized());
    dispatch(clearPersistConfig());
  }, []);
  return <DashBoardModule />;
};

export default withAuth(Dashboard);
