import React from "react";
import Layout from "antd/lib/layout";

import AppWrapper from "../../atoms/app-wrapper";
import TopbarWrapper from "../../atoms/topbar-wrapper";
import SidebarWrapper from "../../atoms/sidebar-wrapper";
import ShellWrapper from "../../atoms/shell-wrapper";

export interface IShellTemplate {
  children?: React.ReactNode;
  topBar?: React.ReactNode;
  sideBar?: React.ReactNode;
}

const { Content } = Layout;

export default function ShellTemplate(props: IShellTemplate) {
  //const appHeight = window.innerHeight;
  const { children, topBar, sideBar } = props;
  return (
    <AppWrapper>
      <Layout style={{ height: "100vh" }}>
        <TopbarWrapper>{topBar}</TopbarWrapper>
        <Layout style={{ flexDirection: "row", overflowX: "hidden" }}>
          <SidebarWrapper>{sideBar}</SidebarWrapper>
          <Layout
            className="isoContentMainLayout"
            style={{
              height: "100vh"
            }}
          >
            <Content
              className="isomorphicContent"
              style={{
                padding: "70px 0 0",
                background: "#f1f3f6",
                position: "relative"
              }}
            >
              <ShellWrapper>{children} </ShellWrapper>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </AppWrapper>
  );
}
