import React from 'react';
import styled from 'styled-components';
import MainSlide from '@/components/home/MainSlide'
import NewGoods from '@/components/home/NewGoods'
import BestGoods from '@/components/home/BestGoods'


const HomeSectionBlock = styled.div`
  h2 { text-align:center; font-size:30px; margin:50px 0 30px }
`

const HomeView = () => {
  return (
    <HomeSectionBlock>
      <MainSlide />
      <div className="inner">
        <NewGoods />
        <BestGoods />
      </div>
    </HomeSectionBlock>
  );
};

export default HomeView;