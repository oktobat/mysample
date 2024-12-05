import React, {useState, useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'
import GoodsModifyImage from '@/components/goods/GoodsModifyImage'

const GoodsModifySectionBlock = styled.div`
  .prevNext { margin:50px 0; }
  .modify_goods_form { padding:0 200px 50px;
    input { width:100%; height:40px; margin:5px 0;}
    select  { width:100%; height:40px; margin:5px 0 }
    button { height:40px; margin:5px 0; }
    .red_btn { background:#eb1414; }
  }
`

const GoodsModifySection = ({goodsVo, images, loadImages, title, pageData, category}) => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    g_no: goodsVo.g_no,
    g_category: goodsVo.g_category,
    g_type: goodsVo.g_type,
    g_name: goodsVo.g_name,
    g_code: goodsVo.g_code,
    g_price: goodsVo.g_price,
    g_inventory: goodsVo.g_inventory,
  });

  const gnameRef = useRef()
  const gpriceRef = useRef()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Submitting form:", form);
    if (!form.g_name){
			alert("상품명을 입력하세요.")
			gnameRef.current.focus()
			return;
		} else if (!form.g_price) {
			alert("가격을 입력하세요.")
			gpriceRef.current.focus()
			return
		}
      axios.put(`${import.meta.env.VITE_API_URL}/goods/modifyGoodsConfirm`, form)
      .then(res=>{
        alert("상품정보가 수정됐습니다.")
      })
      .catch(err=>{
        console.log(err)
        alert("상품정보 수정 중 오류가 발생했습니다.");
      })
  };

  return (
    <GoodsModifySectionBlock className="inner">
      <div className="prevNext">
        {category ? (
            <Link to={`/goods/${category === 'search' ? 'search' : pageData.category}`} state={{ title, getData:pageData }}>
              뒤로가기
            </Link>
          ) : (
            <button type="button" onClick={() => navigate(-1)}>
              뒤로가기
            </button>
          )}
      </div>
      <div className="title">
        <h2>상품정보수정</h2>
      </div>
      <div className="modify_goods_form">
        <form name="modify_goods_form" onSubmit={handleSubmit}>
          <input type="hidden" name="g_no" value={form.g_no} />
          <select name="g_category" value={form.g_category} onChange={handleChange}>
            <option value="uncategory">미분류</option>
            <option value="mealKit">밀키트</option>
            <option value="vegetable">채소</option>
            <option value="sideDishe">밑반찬</option>
            <option value="lunchBox">도시락</option>
            <option value="mainDishe">일품요리</option>
            <option value="soupStew">국.찌개</option>
            <option value="friedPancake">튀김.전</option>
            <option value="giftCoupon">상품권</option>
          </select>
          <br />
          <select name="g_type" value={form.g_type} onChange={handleChange}>
            <option value="untype">일반상품</option>
            <option value="best">인기상품</option>
            <option value="new">신상품</option>
          </select>
          <br />
          <input
            type="text"
            ref={gnameRef}
            name="g_name"
            placeholder="상품명"
            value={form.g_name}
            onChange={handleChange}
          />
          <br />
          <input
            type="text"
            name="g_code"
            placeholder="상품코드"
            value={form.g_code}
            onChange={handleChange}
          />
          <br />
          <input
            type="text"
            ref={gpriceRef}
            name="g_price"
            placeholder="가격"
            value={form.g_price}
            onChange={handleChange}
          />
          <br />
          <input
            type="text"
            name="g_inventory"
            placeholder="수량"
            value={form.g_inventory}
            onChange={handleChange}
          />
          <br />
          <div>
            <button className="red_btn" type="submit">
              전송
            </button>
            <button className="red_btn" type="reset" onClick={() => setForm(goodsVo)}>
              취소
            </button>
          </div>
        </form>

        <GoodsModifyImage images={images} loadImages={loadImages} gno={form.g_no} />

      </div>
    </GoodsModifySectionBlock>
  );
};

export default GoodsModifySection;