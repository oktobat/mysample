package com.example.mysample.service;

import com.example.mysample.dto.ReviewVo;
import org.springframework.dao.DataAccessException;

import java.util.List;

public interface ReviewService {
    public int registerReviewConfirm(ReviewVo reviewVo, List<String> images) throws DataAccessException;
    public List<ReviewVo> photoReviewData(int pNum, int scale, long g_no) throws DataAccessException;
    public int photoReviewCount(long g_no) throws DataAccessException;
    public List<ReviewVo> textReviewData(int pNum, int scale, long g_no) throws DataAccessException;
    public int textReviewCount(long g_no) throws DataAccessException;
    public List<ReviewVo> myReviewList(int m_no) throws DataAccessException;
    public int modifyReviewConfirm(ReviewVo reviewVo, List<String> images) throws DataAccessException;
}
