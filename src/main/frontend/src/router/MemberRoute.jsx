import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const MemberRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/" replace />;
  }

  try {
    // JWT 디코딩
    const decoded = jwtDecode(token);

    // 토큰 만료 확인
    if (decoded.exp * 1000 < Date.now()) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
      return <Navigate to="/" replace />;
    }

    // ROLE_MEMBER 또는 ROLE_ADMIN인지 확인
    if (decoded.role === "ROLE_MEMBER" || decoded.role === "ROLE_ADMIN") {
      // 유효한 사용자일 경우 하위 컴포넌트 렌더링
      return <Outlet />;
    }

    // 권한이 없는 경우
    alert("접근 권한이 없습니다.");
    return <Navigate to="/" replace />;
  } catch (err) {
    console.error("JWT 검증 실패:", err);
    alert("유효하지 않은 토큰입니다. 다시 로그인 해주세요.");
    return <Navigate to="/" replace />;
  }
};

export default MemberRoute;