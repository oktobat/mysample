import React from 'react';

const OauthRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/" replace />;
  }

  try {
    // JWT 디코딩
    const decoded = jwtDecode(token);

    if (!decoded || decoded.role !== "ROLE_MEMBER" || decoded.exp * 1000 < Date.now()) {
      alert("접근 권한이 없습니다.");
      return <Navigate to="/" replace />;
    }

    // 유효한 관리자일 경우 하위 컴포넌트 렌더링
    return <Outlet />;
  } catch (err) {
    console.error("JWT 검증 실패:", err);
    alert("유효하지 않은 토큰입니다. 다시 로그인 해주세요.");
    return <Navigate to="/" replace />;
  }
};

export default OauthRoute;