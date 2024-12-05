import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import { fetchNewGoods } from "@/store/goods"
import { useDispatch,  useSelector} from 'react-redux';
import GoodsList from '@/components/goods/GoodsList';

const NewGoodsSectionBlock = styled.div``

const NewGoodsSection = () => {
  const dispatch = useDispatch();
  const newGoods = useSelector(state=>state.goods.newGoods)
  const [goods, setGoods] = useState(newGoods)

  // 컴포넌트가 마운트되고 1차 렌더링 후 자동으로 실행되는 함수
  // 의존성배열이 [] 빈 배열일때는 한번만 수행됨
  useEffect(()=>{
    dispatch(fetchNewGoods())
  }, [])

  useEffect(()=>{
    if (newGoods.length>0) {
        setGoods(newGoods)
    }
  }, [newGoods])

  return (
    <NewGoodsSectionBlock>
      <h2>새로 나왔어요!!</h2>
      <GoodsList goods={goods} main={true} />
    </NewGoodsSectionBlock>
  );
};

export default NewGoodsSection;