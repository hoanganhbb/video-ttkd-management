import { useContext, useState, useEffect } from "react";
import { Button, Flex, Input, Form, Checkbox, Divider } from "antd";
import { colors } from "../utils/theme";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import Background from "../assets/bg.png";
import { useMediaQuery } from "react-responsive";
import { FaLock, FaUser } from "react-icons/fa6";
import axios from "axios";

function Login() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1366px)",
  });

  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1366 });

  const isSmallScreen = useMediaQuery({ maxWidth: 767 });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [OTP_CODE, setOTPCODE] = useState("");
  const [isShowOTP, setIsShowOTP] = useState(false);
  const [objectOTP, setObjectOTP] = useState(null);
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    window.localStorage.removeItem("access_token");
    setLoading(true);

    const { username, password } = values;
    if (!isShowOTP) {
      axios
        .post(
          "https://csht.vnptnghean.com.vn/users/loginonebss",
          {
            username,
            password,
          },
          {
            headers: {
              Authorization: null,
              "X-Csrftoken": null,
            },
          }
        )
        .then((res) => {
          if (res.data.secretcode) {
            setObjectOTP(res.data);
            setIsShowOTP(true);
          }
        })
        .catch((err) => {
          if (err.response.status === 401)
            toast.error(
              "Kiểm tra lại! Tài khoản hoặc mật khẩu không đúng. Vui lòng quay lại sau 5 phút!"
            );
        })
        .finally(() => setLoading(false));
    } else {
      axios
        .post("https://csht.vnptnghean.com.vn/users/loginonebss/otp", {
          username,
          secret: objectOTP.secretcode,
          otp: OTP_CODE,
        })
        .then(async (res) => {
          // const results = await axios.post("/api/login", {
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: {
          //     username,
          //   },
          // });
          // localStorage.setItem("token", results.data.token);
          localStorage.setItem("token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3N…wMjJ9.4x01mNTCqqjpYITy-upa45lutp6BMVCqhF2CnBmlTMo')
          navigate("watch");
        })
        .catch((err) => {
          if (err) {
            toast.error("Kiểm tra lại", err.detail);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        position: "relative",
        width: "100%",
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "50%",
      }}
    >
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        form={form}
        initialValues={{ username: "", password: "" }}
      >
        <Flex
          justify="center"
          style={{
            padding: 16,
            height:
              isDesktopOrLaptop || isTablet ? "calc(100vh - 96px)" : "auto",
            minWidth: 500,
          }}
          gutter={[16, 16]}
          align={isDesktopOrLaptop || isTablet ? "center" : "flex-start"}
        >
          <div>
            <div
              style={{
                padding: 24,
                borderRadius: 6,
                position: "relative",
                zIndex: 1,
                margin: "auto",
                background: "white",
                minWidth: 420,
                // top: isDesktopOrLaptop || isTablet ? -100 : 0
              }}
            >
              <Flex justify="center">
                <Flex
                  align="center"
                  gap={24}
                  style={{ paddingTop: 10, paddingBottom: 16 }}
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyR7RReGMh0kbman6hrjOVuigdN1fmFLXQSg&s"
                    style={{ width: isDesktopOrLaptop ? 40 : 30 }}
                  ></img>
                  <div>
                    <Flex
                      style={{
                        height: isDesktopOrLaptop ? "100%" : "auto",
                        fontSize: isDesktopOrLaptop ? 18 : 14,
                        color: colors.blue[700],
                        fontWeight: 800,
                        textAlign: "center",
                      }}
                      align="center"
                    >
                      TRUNG TÂM KINH DOANH NGHỆ AN
                    </Flex>
                    <div style={{ textAlign: "center" }}>
                      Quản lý video trực tuyến
                    </div>
                  </div>
                </Flex>
              </Flex>
              <div style={{ height: 20 }}></div>

              <div style={{ display: isShowOTP ? "block" : "none" }}>
                <OtpInput
                  value={OTP_CODE}
                  onChange={setOTPCODE}
                  numInputs={6}
                  renderSeparator={<div style={{ width: 10 }}> </div>}
                  containerStyle={{
                    // justifyContent: 'space-between',
                    justifyContent: "center",
                    gap: 6,
                    marginBottom: 20,
                  }}
                  renderInput={(props) => (
                    <input
                      {...props}
                      inputMode="numeric"
                      className="otp-input-element"
                      style={{
                        height: isSmallScreen ? 32 : 40,
                        borderRadius: 10,
                        border: `1px solid ${colors.gray[400]}`,
                        fontSize: isSmallScreen ? 22 : 30,
                        fontWeight: 600,
                        textAlign: "center",
                        color: colors.orange[800],
                        padding: 5,
                        width: isSmallScreen ? 32 : 40,
                      }}
                    />
                  )}
                />
              </div>
              <div style={{ display: !isShowOTP ? "block" : "none" }}>
                <Form.Item
                  label="Tài khoản"
                  name="username"
                  rules={[
                    { required: true, message: "Bắt buộc nhập tên đăng nhập" },
                  ]}
                >
                  <Input
                    placeholder="Email nội bộ"
                    style={{ padding: "10px 12px", borderRadius: 6 }}
                    prefix={
                      <FaUser
                        color={colors.gray[300]}
                        size={16}
                        style={{ marginRight: 6 }}
                      />
                    }
                  ></Input>
                </Form.Item>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Bắt buộc nhập mật khẩu" },
                  ]}
                >
                  <Input.Password
                    placeholder="Mật khẩu"
                    style={{ padding: "10px 12px", borderRadius: 6 }}
                    prefix={
                      <FaLock
                        color={colors.gray[300]}
                        size={16}
                        style={{ marginRight: 6 }}
                      />
                    }
                  ></Input.Password>
                </Form.Item>
                <Form.Item>
                  <Checkbox>Ghi nhớ</Checkbox>
                </Form.Item>
              </div>
              <Flex style={{ margin: "10px 0" }}>
                <Button
                  name="submit"
                  type="primary"
                  htmlType="submit"
                  block
                  style={{
                    fontWeight: 600,
                    borderRadius: 6,
                    fontSize: isSmallScreen ? 14 : 16,
                    height: isSmallScreen ? 34 : 42,
                    background: "#0666b2",
                    color: colors.white,
                  }}
                  loading={loading}
                  // onClick={handleSubmit}
                >
                  {isShowOTP
                    ? "Xác nhận OTP"
                    : "Đăng nhập bằng tài khoản OneBSS"}
                </Button>
              </Flex>
            </div>
            {/* <button onClick={() => navigate('watch')}></button> */}
            <div
              style={{
                color: colors.blue[900],
                fontSize: 14,
                textAlign: "center",
                padding: 20,
              }}
            >
              © VNPT Nghệ An
            </div>
          </div>
        </Flex>
      </Form>
    </div>
  );
}

export default Login;
