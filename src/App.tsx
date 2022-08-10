import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, RouteProps } from "react-router-dom"
import dayjs from "dayjs"
const { Header, Content, Footer, Sider } = Layout;

import { RenderRouter } from "./src/router"
import { routers, routeProps } from "./src/router/routers"
import 'antd/dist/antd.css'

import styles from "./App.module.css"

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}


const transformMenu = (data: routeProps[]): MenuItem[] => data.map(item => {
  return getItem(item.title, item.path as React.Key, item.icon, item.children && transformMenu(item.children))
})

const items: MenuItem[] = transformMenu(routers);

const App: React.FC = () => {

  const navigate = useNavigate()
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([])


  const toUrl = (keyPath: string[]) => {
    const url = keyPath.reduce((prev, next) => `${next}${prev}`, '')
    navigate(url)
  }

  const openChange = (openKeys: string[]) => {
    setOpenKeys(openKeys)
  }

  const findPathTitle = (keys: string[]) => {
    let names = []
    for (const key of keys) {
      const name = findTitle(key, routers)
      names.push(name)
    }

    return names

    function findTitle(path: string, routers: routeProps[]): string {
      for (const router of routers) {
        if (router.path === path) {
          return router.title ?? ''
        }

        const current = findTitle(path, router.children ?? [])
        if (current) {
          return current
        }
      }

      return ''
    }
  }

  useEffect(() => {
    const { pathname } = location
    const selectedKeys = pathname.split('/').filter(Boolean).map(path => `/${path}`)
    setSelectedKeys(selectedKeys)
    setOpenKeys(selectedKeys)
    const breadcrumbs = findPathTitle(selectedKeys)
    setBreadcrumbs(breadcrumbs)
  }, [location])


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div className={styles["logo"]} />
        <Menu theme="dark" selectedKeys={selectedKeys} openKeys={openKeys} onOpenChange={(openKeys) => openChange(openKeys)} mode="inline" items={items} onClick={({ keyPath }) => toUrl(keyPath)} />
      </Sider>
      <Layout className={styles["site-layout"]}>
        <Header className={styles["site-layout-background"]} style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {
              breadcrumbs.map(breadcrumb => <Breadcrumb.Item>{breadcrumb}</Breadcrumb.Item>)
            }
          </Breadcrumb>
          <div className={styles["site-layout-background"]} style={{ padding: 24, minHeight: 360 }}>
            <RenderRouter />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©{dayjs().format("YYYY")} Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
