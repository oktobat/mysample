import React, {useEffect} from 'react';
import styled from 'styled-components'
import {useSelector, useDispatch } from 'react-redux'
import {removeNotice, modifyHit } from '@/store/board'
import {Link, useNavigate} from 'react-router-dom'


const BoardDetailBlock = styled.div`
  max-width:600px; margin:0 auto 50px; 
  table {
    col:nth-child(1) { width:100px; }
    col:nth-child(2) { width:auto; }
    td { padding:5px;
      input { width:100%; border:1px solid #ddd; height:30px; padding:5px; }
      textarea { width:100%; border:1px solid #ddd; padding:5px; height:200px }
    }
  }
  .btn { text-align:center; margin-top:20px;
    button, a { margin:0 10px; padding:10px 20px; background:#ddd;
        font-size:14px }
  }
`

const BoardDetailSection = ({item}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state=>state.members.user)
  const onRemove = (e)=>{
    e.preventDefault()
    dispatch(removeNotice(item))
    navigate("/boardList")
  }
  useEffect(()=>{
    dispatch(modifyHit(item))
  }, [])
  return (
    <BoardDetailBlock>
      <table border="1">
          <colgroup>
            <col />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td>작성자</td>
              <td>
                <input type="text" name="writer" value={item.writer} disabled />
              </td>
            </tr>
            <tr>
              <td>제목</td>
              <td>
                <input type="text" name="subject" value={item.subject} disabled />
              </td>
            </tr>
            <tr>
              <td>내용</td>
              <td>
                <textarea name="content" value={item.content} disabled></textarea>
              </td>
            </tr>
          </tbody>
      </table>
      <div className="btn">
        { (user && user.userEmail==item.writer) &&
          <>
            <Link to={`/boardModify/${item.subject}`} state={{item:item}}>수정</Link>
            <a href="#none" onClick={onRemove}>삭제</a>
          </>
        }
        <Link to="/boardList">목록</Link>
      </div>
    </BoardDetailBlock>
  );
};

export default BoardDetailSection;