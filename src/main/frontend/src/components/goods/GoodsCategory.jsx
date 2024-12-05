import React from 'react';
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const GoodsCategoryBlock = styled.div`
  ul.depth1 { background:#f9f0ec; display:flex; justify-content:space-around; padding:15px 0; border-radius:50px; color:#696969; font-weight:500;
    & > li { transition:all 0.3s }
    & > li:hover { color:#000 }
    & > li > a.active { color:#eb1414 }
  }
`

const GoodsCategory = () => {
  const allCategory = [
    { category: 'mealKit', name: '밀키트' },
    { category: 'vegetable', name: '채소' },
    { category: 'sideDishe', name: '밑반찬' },
    { category: 'lunchBox', name: '도시락' },
    { category: 'mainDishe', name: '일품요리' },
    { category: 'soupStew', name: '국.찌개' },
    { category: 'friedPancake', name: '튀김.전' },
    { category: 'giftCoupon', name: '상품권' }
  ]
  return (
    <GoodsCategoryBlock>
      <nav id="nav">
            <ul className="depth1 inner">
               {
                allCategory.map((item, index)=>(
                  <li key={index}>
                    <NavLink to={`/goods/${item.category}`} state={{title:item.name, getData:{category:item.category, pageGroup:1, pageNum:1}}}>{item.name}</NavLink>
                  </li>
                ))
               }
            </ul>
        </nav>
    </GoodsCategoryBlock>
  );
};

export default GoodsCategory;