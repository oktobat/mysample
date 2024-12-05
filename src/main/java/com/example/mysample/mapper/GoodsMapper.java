package com.example.mysample.mapper;

import com.example.mysample.dto.GoodsDto;
import com.example.mysample.dto.OrderDetailVo;
import com.example.mysample.dto.OrderVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
public interface GoodsMapper {

   List<GoodsDto> selectMainGoods(String g_type);
   List<GoodsDto> selectGoodsList(@Param("pNum") int pNum,
                                  @Param("scale") int scale,
                                  @Param("g_category") String g_category);
   List<GoodsDto> selectSearchGoodsList(@Param("pNum") int pNum,
                                        @Param("scale") int scale,
                                        @Param("keyword") String keyword);
   int selectGoodsCount(@Param("g_category") String g_category);
   int selectSearchGoodsCount(@Param("keyword") String keyword);

   @Options(useGeneratedKeys = true, keyProperty = "g_no")
   long insertNewGoods(GoodsDto goodsDto);

   int updateGoods(GoodsDto goodsDto);

   int deleteGoods(@Param("g_no") long g_no);

   int updateGoodsInventory(OrderDetailVo orderDetailVo);


}
