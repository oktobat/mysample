import React from 'react';
import {Route, Routes}  from 'react-router-dom'
import AdminRoute from '@/router/AdminRoute'
import MemberRoute from '@/router/MemberRoute'
import OauthRoute from '@/router/OauthRoute'
import OAuthCallbackView from '@/views/OAuthCallbackView'
import Layout from '@/Layout'
import HomeView from '@/views/HomeView'
import GoodsView from '@/views/GoodsView'
import CartView from '@/views/CartView'
import GoodsRegisterView from '@/views/GoodsRegisterView'
import GoodsModifyView from '@/views/GoodsModifyView'
import GoodsDetailView from '@/views/GoodsDetailView'
import CheckOutView from '@/views/CheckOutView'
import MemberModifyView from '@/views/MemberModifyView'
import OrderFinishView from '@/views/OrderFinishView'
import OrderListView from '@/views/OrderListView'
import OrderDetailView from '@/views/OrderDetailView'
// import ReviewListView from '@/views/ReviewListView'
import ReceiptReviewView from '@/views/ReceiptReviewView'
import ReceiptDetailView from '@/views/ReceiptDetailView'
import AdminLoginView from '@/views/AdminLoginView'
import AdminJoinView from '@/views/AdminJoinView'
import AdminListUpView from '@/views/AdminListUpView'
import MemberListUpView from '@/views/MemberListUpView'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={ <HomeView /> } />
        <Route path="/goods/:category" element={ <GoodsView /> } />
        <Route path="/goodsDetail/:gno" element={ <GoodsDetailView /> } />
        <Route path="/orderFinish" element={ <OrderFinishView /> } />
        <Route path="/adminLogin" element={ <AdminLoginView /> } />
        <Route path="/adminJoin" element={ <AdminJoinView /> } />
        <Route path="/oauth/callback/:provider" element={ <OAuthCallbackView />} />
        <Route element={<AdminRoute />}>
          <Route path="/adminList" element={<AdminListUpView />} />          
          <Route path="/memberList" element={<MemberListUpView />} /> 
          <Route path="/goodsRegister" element={ <GoodsRegisterView /> } />          
          <Route path="/goodsModify/:gno" element={ <GoodsModifyView /> } />
        </Route>
        <Route element={<MemberRoute />}>
          <Route path="/cartList" element={ <CartView /> } />
          <Route path="/checkOutList" element={ <CheckOutView /> } />
          <Route path="/memberModify" element={ <MemberModifyView /> } />
          <Route path="/myOrderList" element={ <OrderListView /> } />
          <Route path="/myOrderDetail/:odno" element={ <OrderDetailView /> } />
          {/* <Route path="/myReviewList" element={ <ReviewListView /> } /> */}
          <Route path="/receiptReview" element={ <ReceiptReviewView /> } />
          <Route path="/receiptDetail/:rid" element={ <ReceiptDetailView /> } />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;