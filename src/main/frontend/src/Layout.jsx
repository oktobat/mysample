import React from 'react';
import { Outlet } from 'react-router-dom'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

// Outlet : 부모 라우트의 레이아웃을 유지하면서 자식 라우트의 내용을 동적으로 표시할 수 있게 함
//          React Router에서 제공하는 컴포넌트로, 중첩된 라우트를 렌더링하는 데 사용됨
//          즉, 자식 라우트가 렌더링되는 위치를 표시함

const Layout = () => {
  return (
    <div>
      <Header />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
};

export default Layout;