import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";


import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const Test = React.lazy(() => import("../pages/test/Test"))
const Test2 = React.lazy(() => import("../pages/test/Test2"))
const TestChild = React.lazy(() => import("../pages/test/TestChild"))
const TestChildChildren = React.lazy(() => import("../pages/test/TestChildChildren"))



export interface routeProps {
  path: string,
  /**
   * 标题
   */
  title?: string,
  icon?: React.ReactNode,
  component: React.LazyExoticComponent<any>,
  children?: routeProps[]
}

export const routers: routeProps[] = [
  {
    path: '/test',
    title: '概览',
    icon: <DesktopOutlined />,
    component: Test
  },
  {
    path: '/test2',
    component: Test2,
    title: '表格',
    icon: <PieChartOutlined />,
    children: [{
      path: '/child',
      component: TestChild,
      title: '表格一',
      icon: <UserOutlined />,
      children: [
        { path: '/children', title:'表格二', component: TestChildChildren }
      ]
    }]
  }
]



const renderPage = (data: routeProps[], parentPath: string = ''): any => {
  return data.map(item => {

    const path = `${parentPath}${item.path}`

    return (<Route
      path={path}
      key={path}
      element={
        <Suspense fallback="loading">
          <item.component />
        </Suspense>
      }
    >
      {item.children && renderPage(item.children, path)}
    </Route>)
  })
}


const RenderRouter = () => {
  return (
    <Routes>
      {renderPage(routers)}
      <Route path="*" element={
        <Suspense fallback="loading">
          <div>not found</div>
        </Suspense>
      }></Route>
    </Routes>
  );
};


export default RenderRouter
