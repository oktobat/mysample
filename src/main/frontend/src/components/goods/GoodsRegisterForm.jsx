import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components'
import axios from 'axios'

const GoodsRegisterFormSection = styled.div`
  .register_goods_form { padding:0 200px 50px;
    input { width:100%; height:40px; margin:5px 0; &.red_btn { background:#eb1414;  } }
    select  { width:100%; height:40px; margin:5px 0 }
  }
`

const GoodsRegisterForm = () => {

  const [form, setForm] = useState({
    g_category: 'uncategory',
    g_type: 'untype',
    g_name: '',
    g_code: '',
    g_price: '',
    g_inventory: '',
});
const [files, setFiles] = useState([]);
const fileInputRef = useRef(null); // ref 생성


const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevState => ({
        ...prevState,
        [name]: value,
    }));
};

const handleFileChange = (e) => {
    setFiles([...e.target.files]);
};

const registerGoodsForm = async (e) => {
    e.preventDefault();

    const { g_name, g_price } = form;

    if (!g_name) {
        alert("상품명을 입력하세요.");
        return;
    }
    if (!g_price) {
        alert("가격을 입력하세요.");
        return;
    }

    const formData = new FormData();
    formData.append("item", new Blob([JSON.stringify(form)], { type: "application/json" }));

    files.forEach(file => {
        formData.append("file", file);
    });


    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/goods/registerGoodsConfirm`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`, // Authorization 헤더에 JWT 추가
            },
        });

        if (response.data === "성공" || response.data === "부분성공") {
            // 성공하면 폼박스 전체 리셋
            setForm({
                g_category: 'uncategory',
                g_type: 'untype',
                g_name: '',
                g_code: '',
                g_price: '',
                g_inventory: '',
            });
            setFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = null; // 파일 입력 필드 초기화
            }
        } else {
            alert("상품등록이 실패했습니다.");
            return 
        }
    } catch (error) {
        console.log(error);
        alert("상품등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <GoodsRegisterFormSection className="inner">
        <div className="title">
          <h2>상품등록</h2>
        </div>
        <div className="register_goods_form">
            <form name="register_goods_form" onSubmit={registerGoodsForm}>
              <select name="g_category" onChange={handleChange} value={form.g_category}>
                  <option value="uncategory">미분류</option>
                  <option value="mealKit">밀키트</option>
                  <option value="vegetable">채소</option>
                  <option value="sideDishe">밑반찬</option>
                  <option value="lunchBox">도시락</option>
                  <option value="mainDishe">일품요리</option>
                  <option value="soupStew">국.찌개</option>
                  <option value="friedPancake">튀김.전</option>
                  <option value="giftCoupon">상품권</option>
              </select><br/>
              <select name="g_type" onChange={handleChange} value={form.g_type}>
                  <option value="untype">일반상품</option>
                  <option value="best">인기상품</option>
                  <option value="new">신상품</option>
              </select><br/>
              <input type="text"		name="g_name" value={form.g_name} onChange={handleChange}		placeholder="상품명" /> <br/>
              <input type="text"		name="g_code" value={form.g_code} onChange={handleChange}		placeholder="상품코드" /> <br/>
              <input type="text"		name="g_price"	value={form.g_price} onChange={handleChange}	placeholder="가격" /> <br/>
              <input type="text"		name="g_inventory" value={form.g_inventory} onChange={handleChange}	placeholder="수량" /> <br/>
              <input type="file" className="files" multiple ref={fileInputRef} onChange={handleFileChange} />
              <div>
                <input className="red_btn" type="submit"	value="전송" /> 
                <input className="red_btn" type="reset"	value="취소" />
              </div>
          </form>
        </div>
    </GoodsRegisterFormSection>
  );
};

export default GoodsRegisterForm;