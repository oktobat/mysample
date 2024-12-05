import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import { useSelector } from 'react-redux';
import JoinSection from '@/components/member/JoinSection';
import LoginSection from '@/components/member/LoginSection';
import { TfiClose } from "react-icons/tfi";

const MemberSectionBlock = styled.div`
    position:fixed; top:0; left:0; 
    right:0; bottom:0; 
    background:#fff; 
    justify-content:center;
    align-items:center;
    z-index:99999;
    display:none;
    &.on { display:flex; }
    .close {
      position:absolute; top:50px; right:50px; 
      font-size:50px; 
    }
`

const MemberSection = ({type, handleClick}) => {

  return (
    <MemberSectionBlock className={ type ? "on" : ""}>
        { type=='join' ?
          <JoinSection handleClick={handleClick} />
          :
          <LoginSection handleClick={handleClick} />
        }
        <div className="close" onClick={ ()=>handleClick(null)}>
          <span className="blind">닫기</span>
          <TfiClose />
        </div>
    </MemberSectionBlock>
  );
};

export default MemberSection;