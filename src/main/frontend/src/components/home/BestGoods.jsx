import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import { fetchBestGoods } from "@/store/goods"
import { useDispatch,  useSelector} from 'react-redux';
import GoodsList from '@/components/goods/GoodsList';

const BestGoodsSectionBlock = styled.div``

const BestGoodsSection = () => {
  const dispatch = useDispatch();
  const bestGoods = useSelector(state=>state.goods.bestGoods)
  const [goods, setGoods] = useState(bestGoods)

  // 컴포넌트가 마운트되고 1차 렌더링 후 자동으로 실행되는 함수
  // 의존성배열이 [] 빈 배열일때는 한번만 수행됨
  useEffect(()=>{
    dispatch(fetchBestGoods())
  }, [])

  useEffect(()=>{
    if (bestGoods.length>0) {
        setGoods(bestGoods)
    }
  }, [bestGoods])

  return (
    <BestGoodsSectionBlock>
      <h2>인기상품</h2>
      <GoodsList goods={goods} main={true} />
    </BestGoodsSectionBlock>
  );
};

export default BestGoodsSection;