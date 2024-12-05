package com.example.mysample.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReviewImageMapper {
    int insertReviewImage(@Param("review_no") int review_no, @Param("images") List<String> images);
}
