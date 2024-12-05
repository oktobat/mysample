import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { adminLogout } from '@/store/member'

const FooterBlock = styled.div`
  background:#eb1414; margin-top:100px; padding:50px 50px 20px; color:#fff;
  .inner { display:flex; 
    h2 { margin-bottom:15px;
      &.community { margin-top:25px }
    }
    div { flex:1; 
      &:nth-child(1) { flex:1.5}
    }
    .col1 p:nth-child(1) { font-size:33px; font-weight:bold  }
    .col1 p:nth-child(2) { margin:25px 0;  }
    ul { list-style:disc; margin-left:25px;
      font-size:18px; 
      li { line-height:1.8em;  
        a { border-bottom:1px solid #fff; line-height:1.2em }
      }
    }
  }
  .copyright { border-top:1px solid #fff; text-align:center; line-height:3em; margin-top:20px;  }
`

const Footer = () => {
  const user = useSelector(state=>state.member.user)

  return (
    <FooterBlock>
      <div className="inner">
        <div className="col1">
          <p>ISUWELL FOODS<br/> PVT.LTD.</p>
          <p>RZD 91, Nihal Vihar, Nangloi, Delhi<br/>
          110087</p>
          <p>+91 9319 9319 74<br/>
          contactus@bitchan.in</p>
          <p style={{ marginTop:'40px'}}>
            { user?.m_role!=="ROLE_ADMIN" ? <Link to="/adminJoin">관리자회원가입</Link> :
              <>
                <Link to="/adminList">관리자리스트</Link>
                <Link to="/memberList" style={{ marginLeft:"10px"}}>일반회원명단</Link>
              </>
            }
          </p>
        </div>
        <div className="col2">
          <h2>고객센터</h2>
          <ul>
            <li><a href="#">자주 하는 질문들</a></li>
            <li><a href="#">주문안내</a></li>
            <li><a href="#">결제안내</a></li>
            <li><a href="#">배송안내</a></li>
          </ul>
        </div>
        <div className="col3">
          <h2>문의</h2>
          <ul>
            <li><a href="#">카카오톡 채널(한국어)</a></li>
            <li><a href="#">Whatsapp (English)</a><br/>+91 9319 9319 74</li>
          </ul>
          <h2 className="community">커뮤니티</h2>
          <ul>
            <li><a href="#">인스타그램</a></li>
            <li><a href="#">네이버밴드</a></li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        &copy; 2023 ISUWELL Foods Pvt. Ltd. All Rights Reserved
      </div>
    </FooterBlock>
  );
};

export default Footer;