import { useEffect, useRef } from "react";
import { Layout, Menu } from "antd";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

const { Header, Content, Sider } = Layout;

export default function Watch() {
  const videoRef = useRef();

  useEffect(() => {
    const player = new Plyr(videoRef.current);
    return () => player.destroy();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ color: "white", fontSize: "20px" }}>Video Viewer</Header>
      <Layout>
        <Content className="flex items-center justify-center bg-black">
          <video ref={videoRef} controls className="w-full max-w-4xl">
            <source src="/video" type="video/mp4" />
          </video>
        </Content>
        <Sider width={240} theme="dark">
          <Menu mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <a href="/video">Video 1</a>
            </Menu.Item>
            <Menu.Item key="2">
              <a href="/video2">Video 2</a>
            </Menu.Item>
          </Menu>
        </Sider>
      </Layout>
    </Layout>
  );
}
