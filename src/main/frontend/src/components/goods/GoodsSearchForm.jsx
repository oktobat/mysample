import React, {useState} from 'react';
import {useNavigate } from 'react-router-dom'
import { FaMagnifyingGlass } from "react-icons/fa6";


const GoodsSearchForm = () => {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState("")

  const onSearch = (e)=>{
    e.preventDefault()
    navigate(`/goods/search`, {state:{title:keyword, getData:{category:keyword, pageGroup:1, pageNum:1}}})
    setKeyword("")
  }

  return (
    <div className="col2">
      <form onSubmit={ onSearch }>
          <input type="text" name="keyword" value={keyword} onChange={ (e)=>setKeyword(e.target.value) } placeholder="상품명 입력" />
          <button type="submit"><FaMagnifyingGlass /></button>
      </form>
    </div>
  );
};

export default GoodsSearchForm;