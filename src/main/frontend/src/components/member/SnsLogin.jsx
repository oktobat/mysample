import React, {useEffect} from 'react';
import { RiKakaoTalkFill } from "react-icons/ri";
import { FaGoogle } from "react-icons/fa";
import { SiNaver } from "react-icons/si";
import styled from 'styled-components'

const SnsLoginBlock = styled.div`
   margin:50px 0; text-align:center; 
   span { display:inline-block; font-size:20px; margin:0 5px; border-radius:50%; 
    width:50px; height:50px; text-align:center; line-height:50px; cursor:pointer;
    &:nth-child(1) { background:#ffe102; color:#3b2122; }
    &:nth-child(2) { background:#1b66c9; color:#fff; font-size:18px; }
    &:nth-child(3) { background:#17b752; color:#fff; font-size:18px;}
  }
`

const SnsLogin = () => {

  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY;
      window.Kakao.init(kakaoKey);
      console.log('Kakao SDK initialized:', window.Kakao.isInitialized());
    }
  }, []);

  const handleKakaoLogin = () => {
    const redirectUri = `${window.location.origin}/oauth/callback/kakao`;
    window.Kakao.Auth.authorize({
      redirectUri,
    });
  };

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/oauth/callback/google`;
    const scope = "profile email"; 
    const responseType = "code"; 
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
  
    window.location.href = authUrl; // 로그인 페이지로 리다이렉트
  };

  // const handleNaverLogin = () => {
  //   const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
  //   const redirectUri = `${window.location.origin}/oauth/callback/naver`;
  //   const state = Math.random().toString(36).substr(2, 11); // 고유 상태 값
  //   const authUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;
  //   window.location.href = authUrl;
  // };

  return (
    <SnsLoginBlock>
      <span onClick={handleKakaoLogin}>
        <RiKakaoTalkFill />
      </span>
      <span onClick={handleGoogleLogin}>
        <FaGoogle />
      </span>
      {/*
      <span onClick={handleNaverLogin}>
        <SiNaver />
      </span> */}
    </SnsLoginBlock>
  );
};


export default SnsLogin;