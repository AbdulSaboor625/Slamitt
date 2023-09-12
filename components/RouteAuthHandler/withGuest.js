import moment from "moment";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/Actions";
import { routes } from "../../utility/config";

const withGuest = (WrappedComponent) => {
  const Wrapper = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { slamittToken, loginTime } = useSelector((state) => state.auth);
    useEffect(() => {
      if (slamittToken) {
        if (
          !loginTime ||
          moment(loginTime).isSameOrBefore(moment().subtract(29, "days"))
        ) {
          dispatch(logout());
          return;
        }
        router.replace(routes.dashboard);
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withGuest;
