import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import axios from 'axios'

const GoodsModifyImageBlock = styled.div`
  .detailInfo { margin:100px 0;
    .modiBtn { margin-bottom:50px;
      button { margin:10px; 
        padding:10px; background:#ddd
      }
    } 
  }
  .insert {text-align:center;
    button { margin:10px; 
      padding:10px; background:#ddd
    }
  }
`

const GoodsModifyImage = ({images, loadImages, gno}) => {
  const [currentImgs, setCurrentImgs] = useState([])
  
  const handleImageChange = async (imgNo) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.click();

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('img_no', imgNo);

        try {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/goods/updateImage`, formData,  {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
          });
          if (response.data > 0) {
            loadImages();
          } else {
            alert('이미지 변경에 실패했습니다.');
          }
        } catch (error) {
          console.error(error);
          alert('서버 오류로 인해 이미지 변경에 실패했습니다.');
        }
      }
    };
  };

  const handleImageRemove = async (imgNo) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/goods/removeImage`, {params:{img_no:imgNo}});
      if (response.data > 0) {
        alert("이미지가 삭제됐습니다.")
        setCurrentImgs(currentImgs.filter(img=>img.img_no!==imgNo))
      } else {
        alert('이미지 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('서버 오류로 인해 이미지 삭제에 실패했습니다.');
    }
  }

  useEffect(()=>{
    setCurrentImgs(images)
  }, [images])

  const handleImageInsert = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.click();

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('g_no', gno)
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/goods/registerImage`, formData,  {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
          });
          if (response.data > 0) {
            await loadImages();
          } else {
            alert('이미지 추가에 실패했습니다.');
          }
        } catch (error) {
          console.error(error);
          alert('서버 오류로 인해 이미지 추가에 실패했습니다.');
        }
      }
    };
  }

  return (
    <GoodsModifyImageBlock>
      <div className="detailInfo">
        {
          currentImgs.map((item, index)=>(
            <div style={{textAlign:'center'}} key={index}>
              <div><img src={`${import.meta.env.VITE_API_URL}/goodsImg/${item.img_url}`} alt={item.g_no} /></div>
              <div className='modiBtn'>
                <button type='button' className='del' onClick={() => handleImageRemove(item.img_no)}>삭제</button>
                <button type='button' className='mod' onClick={() => handleImageChange(item.img_no)}>변경</button>
              </div>
            </div>
          ))
        }
      </div>
      <div className="insert">
        <button type="button" onClick={ handleImageInsert }>이미지추가</button>
      </div>
    </GoodsModifyImageBlock>
  );
};

export default GoodsModifyImage;