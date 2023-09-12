import { Skeleton } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/Actions";
import { routes } from "../../utility/config";
import {
  CATEGORIES_MODULE,
  DETAILS_MODULE,
  PROFESSION_MODULE,
} from "../../utility/constants";

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const [isLoading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const router = useRouter();
    const { slamittToken, loginTime, user } = useSelector(
      (state) => state.auth
    );
    useEffect(() => {
      if (!slamittToken) {
        router.replace(routes.login);
        // setLoading(false);
      } else {
        if (
          !loginTime ||
          moment(loginTime).isSameOrBefore(moment().subtract(29, "days"))
        ) {
          dispatch(logout());
          router.replace(routes.login);
        } else {
          let redirectRoute = "";
          if (user.step === DETAILS_MODULE) redirectRoute = routes.addDetails;
          else if (user.step === PROFESSION_MODULE)
            redirectRoute = routes.addProfession;
          else if (user.step === CATEGORIES_MODULE)
            redirectRoute = routes.addUserCategory;
          redirectRoute && router.replace(redirectRoute);
          setLoading(false);
        }
      }
    }, []);

    if (isLoading) return <Skeleton />;
    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
