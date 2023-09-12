import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { routes } from "../../utility/config";

const withJudgeAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const { judgeToken } = useSelector((state) => state.auth);
    useEffect(() => {
      if (!judgeToken) {
        router.replace(routes.login);
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withJudgeAuth;
