import { Button, Row, Typography } from "antd";
import { routes } from "../../utility/config";

const AppBar = ({ isSignUp }) => {
  return isSignUp ? (
    <Row justify="end" align="middle" className="headerItemMobile">
      <Typography.Text className="mr-5 decoration-white">
        Already a member?
      </Typography.Text>
      <Button
        type="secondary"
        shape="round"
        href={`${routes.login}?fromSignUp=true`}
      >
        Login
      </Button>
    </Row>
  ) : (
    <>
      <Row justify="end" align="middle" className="headerItemMobile">
        <Typography.Text className="mr-5 decoration-white">
          Not a member?
        </Typography.Text>
        <Button type="secondary" shape="round" href={routes.register}>
          Sign up
        </Button>
      </Row>
    </>
  );
};

export default AppBar;
