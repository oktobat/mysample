package com.example.mysample.mapper;

import com.example.mysample.dto.ReviewVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReviewMapper {
    @Options(useGeneratedKeys=true, keyProperty="review_no")
    int insertNewReview(ReviewVo reviewVo);
    List<ReviewVo> selectPhotoReviewList(@Param("pNum") int pNum, @Param("scale") int scale, @Param("g_no") long g_no);
    int selectPhotoReviewCount(@Param("g_no") long g_no);
    List<ReviewVo> selectTextReviewList(@Param("pNum") int pNum, @Param("scale") int scale, @Param("g_no") long g_no);
    int selectTextReviewCount(@Param("g_no") long g_no);
    List<ReviewVo> selectMyReviewList(@Param("m_no") int m_no);
    int updateReview(ReviewVo reviewVo);
}
