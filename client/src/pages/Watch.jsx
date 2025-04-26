import { useEffect, useRef } from "react";
import { Flex, Layout, Menu } from "antd";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { colors } from "../utils/theme";
import { FaVideo } from "react-icons/fa6";
import { jwtDecode } from "jwt-decode";

const { Header, Content, Sider } = Layout;

export default function Watch() {
  const videoRef = useRef();
  const token = localStorage.getItem("token");  
  const { username } = jwtDecode(token);

  useEffect(() => {
    const player = new Plyr(videoRef.current);
    return () => player.destroy();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }} theme="light">
      <Header
        style={{
          color: colors.blue[900],
          fontSize: "18px",
          background: "#fff",
        }}
      >
        <Flex gap={16} align="center">
          <img
            src="/api/video?filename=video_sang_2304.mov"
            alt=""
            style={{ width: 150, height: "auto" }}
          ></img>
          Quản lý video trực tuyến
        </Flex>
        <Flex>{username}</Flex>
      </Header>
      <Layout>
        <Content className="flex items-center justify-center">
          <div
            style={{
              width: "100%",
              padding: 36,
            }}
          >
            <video
              ref={videoRef}
              controls
              style={{ width: "100%", borderRadius: 10 }}
            >
              <source
                src="http://113.160.171.15:8815/video?filename=video_sang_2304.mov"
                type="video/mp4"
              />
            </video>
            <div style={{ marginTop: 16 }}>
              <Flex align="center" gap={24}>
                <FaVideo size={40} color={colors.gray[500]}></FaVideo>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: colors.blue[900],
                      fontSize: 24,
                    }}
                  >
                    Chương trình tăng trưởng kinh doanh Phần I
                  </div>
                  <div style={{ fontWeight: 400, color: colors.gray[500] }}>
                    Sáng ngày 23/04/2025
                  </div>
                </div>
              </Flex>
            </div>
          </div>
        </Content>
        <Sider width={540} theme="light">
          <Menu mode="inline" defaultSelectedKeys={["1"]}></Menu>
        </Sider>
      </Layout>
    </Layout>
  );
}
