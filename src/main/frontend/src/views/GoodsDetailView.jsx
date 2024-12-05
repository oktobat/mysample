import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import GoodsDetailSection from '@/components/goods/GoodsDetailSection'

const GoodsDetailView = () => {
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
    console.log(images.toString())
  },[])

  return (
    <div>
      <GoodsDetailSection goodsVo={item} images={images} pageData={pageData} title={title} category={category} />
    </div>
  );
};

export default GoodsDetailView;