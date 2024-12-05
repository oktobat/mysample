package com.example.mysample.mapper;

import com.example.mysample.dto.GoodsImageVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface GoodsImageMapper {
    int insertDetailImage(Map<String, Object> map);
    List selectImages(@Param("g_no") long g_no);
    int updateImage(GoodsImageVo goodsImageVo);
    int deleteGoodsImage(@Param("img_no") long img_no);
    int insertImage(GoodsImageVo goodsImageVo);
}
