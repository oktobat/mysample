package com.example.mysample.service;

import com.example.mysample.dto.ReviewVo;
import com.example.mysample.mapper.OrderDetailMapper;
import com.example.mysample.mapper.ReceiptDetailMapper;
import com.example.mysample.mapper.ReviewImageMapper;
import com.example.mysample.mapper.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewMapper reviewMapper;
    private final OrderDetailMapper orderDetailMapper;
    private final ReviewImageMapper reviewImageMapper;
    private final ReceiptDetailMapper receiptDetailMapper;

    @Override
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = {RuntimeException.class, IllegalArgumentException.class, Exception.class})
    public int registerReviewConfirm(ReviewVo reviewVo, List<String> images) throws DataAccessException {
        System.out.println("reviewVo"+reviewVo);
        int reviewNo = insertNewReview(reviewVo);  // 리뷰 삽입 및 번호 반환
        System.out.println("reviewNo"+reviewNo);
        if (reviewNo <= 0) {
            throw new RuntimeException("리뷰 삽입 실패");
        }
        // order_detail_no가 null이 아닌 경우에만 updateOrderDetailReviewed 호출
        if (reviewVo.getOrder_detail_no() != null) {
            updateOrderDetailReviewed(reviewVo.getOrder_detail_no());
        }

        // receipt_detail_no가 null이 아닌 경우에만 updateReceiptDetailReviewed 호출
        if (reviewVo.getReceipt_detail_no() != null) {
            updateReceiptDetailReviewed(reviewVo.getReceipt_detail_no());
        }

        if (images != null && !images.isEmpty()) { // null 체크와 비어 있는 경우를 동시에 확인
            insertReviewImages(reviewNo, images);
        }
        return reviewNo;
    }

    @Override
    public List<ReviewVo> photoReviewData(int pNum, int scale, long g_no) throws DataAccessException {
        return reviewMapper.selectPhotoReviewList(pNum, scale, g_no);
    }

    @Override
    public int photoReviewCount(long g_no) throws DataAccessException {
        return reviewMapper.selectPhotoReviewCount(g_no);
    }

    @Override
    public List<ReviewVo> textReviewData(int pNum, int scale, long g_no) throws DataAccessException {
        return reviewMapper.selectTextReviewList(pNum, scale, g_no);
    }

    @Override
    public int textReviewCount(long g_no) throws DataAccessException {
        return reviewMapper.selectTextReviewCount(g_no);
    }

    @Override
    public List<ReviewVo> myReviewList(int m_no) throws DataAccessException {
        return reviewMapper.selectMyReviewList(m_no);
    }

    @Override
    public int modifyReviewConfirm(ReviewVo reviewVo, List<String> images) throws DataAccessException {
        int updateCount = reviewMapper.updateReview(reviewVo);  // 리뷰 삽입 및 번호 반환
        if (updateCount <= 0) {
            throw new RuntimeException("업데이트 실패");
        }
        if (images != null && !images.isEmpty()) { // null 체크와 비어 있는 경우를 동시에 확인
            insertReviewImages(reviewVo.getReview_no(), images);
        }
        return updateCount;
    }


    private int insertNewReview(ReviewVo reviewVo) {
        int result = reviewMapper.insertNewReview(reviewVo);
        System.out.println(reviewVo.getReview_no());
        return reviewVo.getReview_no();  // 삽입 후 자동 생성된 리뷰 번호 반환
    }

    private void updateOrderDetailReviewed(long orderDetailNo) {
        int updatedRows = orderDetailMapper.updateOrderDetailReviewed(orderDetailNo);
        if (updatedRows <= 0) {
            throw new RuntimeException("주문 상세 정보 업데이트 실패");
        }
    }

    private void updateReceiptDetailReviewed(long receiptDetailNo) {
        int updatedRows = receiptDetailMapper.updateReceiptDetailReviewed(receiptDetailNo);
        if (updatedRows <= 0) {
            throw new RuntimeException("주문 상세 정보 업데이트 실패");
        }
    }

    private void insertReviewImages(int reviewNo, List<String> images) {
        try {
            reviewImageMapper.insertReviewImage(reviewNo, images);  // 여러 이미지 삽입
        } catch (Exception e) {
            throw new RuntimeException("리뷰 이미지 삽입 중 오류 발생", e);
        }
    }

}
