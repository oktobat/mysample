import React, {useState, useRef} from 'react';
import styled from 'styled-components'
import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {initNotice} from '@/store/board'
import dayjs from 'dayjs'

const BoardWriteBlock = styled.div`
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

const BoardWriteSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state=>state.members.user)
  const [board, setBoard] = useState({
    writer:user.userEmail,
    subject:"",
    content:""
  })
  const subjectRef = useRef()
  const contentRef = useRef()

  const handleChange = (e)=>{
    const {name, value} = e.target
    setBoard(board=>({...board, [name]:value}))
  }

  const handleSubmit = (e)=>{
    e.preventDefault()
    if (!board.subject) {
      alert("제목을 입력하세요.")
      subjectRef.current.focus()
      return
    }
    if (!board.content) {
      alert("내용을 입력하세요.")
      contentRef.current.focus()
      return
    }
    const newNotice = {...board, date:Date.now(), hit:0}
    dispatch(initNotice(newNotice))
    navigate("/boardList")
  }

  return (
    <BoardWriteBlock>
      <form onSubmit={handleSubmit}>
        <table border="1">
          <colgroup>
            <col />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td>작성자</td>
              <td>
                <input type="text" name="writer" value={board.writer} disabled />
              </td>
            </tr>
            <tr>
              <td>제목</td>
              <td>
                <input ref={subjectRef} type="text" name="subject" value={board.subject} onChange={handleChange} />
              </td>
            </tr>
            <tr>
              <td>내용</td>
              <td>
                <textarea ref={contentRef} name="content" value={board.content} onChange={handleChange}></textarea>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="btn">
          <button type="submit">작성</button>
          <Link to="/boardList">목록</Link>
        </div>
      </form>
    </BoardWriteBlock>
  );
};

export default BoardWriteSection;