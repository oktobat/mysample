import React from 'react';
import styled from 'styled-components'

const DetailImagesSection = styled.div`
  margin:100px 0;
  text-align:center;
  img { max-width:100%; margin:50px 0 }
`

const DetailImages = ({images}) => {
  return (
    <DetailImagesSection>
      {
        images.map((item, index)=>(
          <div key={index}>
            <img src={`${import.meta.env.VITE_API_URL}/goodsImg/${item.img_url}`} alt={item.g_name} />
          </div>
        ))
      }    
    </DetailImagesSection>
  );
};

export default DetailImages;