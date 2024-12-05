package com.example.mysample.controller;

import com.example.mysample.dto.GoodsDto;
import com.example.mysample.dto.ReviewVo;
import com.example.mysample.service.ReviewService;
import com.example.mysample.util.MultiUploadFileService;
import com.example.mysample.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/review")
public class ReviewController {

    private final MultiUploadFileService multiUploadFileService;
    private final ReviewService reviewService;

    @PostMapping("/registerReviewConfirm")
    public ResponseEntity registerReviewConfirm(@RequestPart(value="review") ReviewVo reviewVo, @RequestPart(value="file", required=false) List<MultipartFile> files) throws Exception {
        log.info("영수증리뷰 or 온라인구매리뷰: {}", reviewVo);
        List<String> imageFileList = new ArrayList<>();
        if (files!=null && !files.isEmpty()) {
            imageFileList = multiUploadFileService.multiUpload(files);
        }
        if (reviewVo.getReceipt_detail_no() != null && reviewVo.getReceipt_detail_no() == 0) {
            reviewVo.setReceipt_detail_no(null); // 0을 null로 변환
        }

        if (reviewVo.getOrder_detail_no() != null && reviewVo.getOrder_detail_no() == 0) {
            reviewVo.setOrder_detail_no(null); // 0을 null로 변환
        }
        try {
            int review_no = reviewService.registerReviewConfirm(reviewVo, imageFileList);
            return ResponseEntity.ok(review_no);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("오류");
        }
    }

    // 포토리뷰 요청하기
    @GetMapping("/photoReviewData")
    public ResponseEntity photoReviewData(@RequestParam("pageGroup") int pageGroup, @RequestParam("pageNum") int pageNum, @RequestParam("g_no") long g_no) {
        int amount = 3;
        int pageNums = 10;
        Map<String, Object> map = new HashMap<>();
        if (g_no>0) {
            List<ReviewVo> photoReviewList = reviewService.photoReviewData((pageNum-1)*amount, amount, g_no);
            int totArticles = reviewService.photoReviewCount(g_no);
            PageVo pageVo = new PageVo(pageGroup, pageNum, amount, pageNums, totArticles);
            map.put("photoReviewList", photoReviewList);
            map.put("totalCount", totArticles);
            map.put("pageVo", pageVo);
            return ResponseEntity.ok(map);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("오류");
        }
    }

    @GetMapping("/textReviewData")
    public ResponseEntity textReviewData(@RequestParam("pageGroup") int pageGroup, @RequestParam("pageNum") int pageNum, @RequestParam("g_no") long g_no) {
        int amount = 3;
        int pageNums = 10;
        Map<String, Object> map = new HashMap<>();
        if (g_no>0) {
            List<ReviewVo> textReviewList = reviewService.textReviewData((pageNum-1)*amount, amount, g_no);
            int totArticles = reviewService.textReviewCount(g_no);
            PageVo pageVo = new PageVo(pageGroup, pageNum, amount, pageNums, totArticles);
            map.put("textReviewList", textReviewList);
            map.put("totalCount", totArticles);
            map.put("pageVo", pageVo);
            return ResponseEntity.ok(map);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("오류");
        }
    }

    @GetMapping("/myReviewList")
    public ResponseEntity myReviewList(@RequestParam("m_no") int m_no) {
        List<ReviewVo> myReviewList = reviewService.myReviewList(m_no);
        if (myReviewList.size()>0) {
            return ResponseEntity.ok(myReviewList);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("오류");
        }
    }

    @PostMapping("/modifyReviewConfirm")
    public ResponseEntity modifyReviewConfirm(@RequestPart(value="review") ReviewVo reviewVo, @RequestPart(value="file", required=false) List<MultipartFile> files) throws Exception {
        List<String> imageFileList = new ArrayList<>();
        if (files!=null && !files.isEmpty()) {
            imageFileList = multiUploadFileService.multiUpload(files);
        }
        try {
            int result = reviewService.modifyReviewConfirm(reviewVo, imageFileList);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("오류");
        }
    }

}
