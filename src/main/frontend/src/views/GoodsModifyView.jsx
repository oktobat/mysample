import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom'
import GoodsModifySection from '@/components/goods/GoodsModifySection'
import axios from 'axios'

const GoodsModifyView = () => {
  const location = useLocation();
  const { item, title, pageData, category } = location.state
  const [images, setImages] = useState([]);

  const loadImages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/goods/detailImage`, {
        params: { g_no: item.g_no },
      });
      console.log(response.data)  
      setImages(response.data || []);
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  useEffect(()=>{
    loadImages()
  },[])

  return (
    <div>
      <GoodsModifySection goodsVo={item} images={images} loadImages={loadImages} title={title} pageData={pageData} category={category} />
    </div>
  );
};

export default GoodsModifyView;