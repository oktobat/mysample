import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import dayjs from 'dayjs'

const BoardListBlock = styled.div`
  margin:0 0 50px; 
  table {
    col:nth-child(1) {width:50px }
    col:nth-child(2) {width:auto }
    col:nth-child(3) {width:200px }
    col:nth-child(4) {width:100px }
    col:nth-child(5) {width:100px }
    th { padding:5px }
    td { 
      padding:5px; text-align:center;
      &:nth-child(2) { text-align:left }
    }
  }
  .btn {
    text-align:center; margin:20px 0; 
    a { padding:10px 20px; background:red; color:#fff }
  }
`

const BoardListSection = () => {
  const user = useSelector(state=>state.members.user)
  const list = useSelector(state=>state.boards.notice)
  const [notice, setNotice] = useState(list)

  useEffect(()=>{
    setNotice(list)
  }, [list])

  return (
    <BoardListBlock>
      <table border="1">
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>날짜</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          { notice.length>0 && notice.map((item, index)=>(
              <tr key={index}>
                <td>{notice.length-index}</td>
                <td><Link to={`/boardDetail/${item.subject}`} state={{ item:item }}>{item.subject}</Link></td>
                <td>{item.writer}</td>
                <td>{dayjs(item.date).format('YYYY-MM-DD')}</td>
                <td>{item.hit}</td>
              </tr>
          ))
          }
        </tbody>
      </table>
      { (user && user.userEmail=="tsalt@hanmail.net") &&
        <div className="btn">
          <Link to="/boardWrite">글쓰기</Link>
        </div>
      }
    </BoardListBlock>
  );
};

export default BoardListSection;