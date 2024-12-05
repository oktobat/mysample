package com.example.mysample.controller;

import com.example.mysample.dto.ReceiptDetailDto;
import com.example.mysample.dto.ReceiptDto;
import com.example.mysample.service.ReceiptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/receipt")
public class ReceiptController {

    private final ReceiptService receiptService;

    @GetMapping("/myReceiptList")
    public ResponseEntity myReceiptList(@RequestParam("m_no") int m_no) throws Exception {
        log.info("유저번호: {}", m_no);
        List<ReceiptDto> myReceiptList = receiptService.myReceiptList(m_no);
        if (myReceiptList.size()>0) {
            return ResponseEntity.ok(myReceiptList);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/myReceiptDetailList")
    public ResponseEntity myReceiptDetailList(@RequestParam("receipt_id") long receipt_id) throws Exception {
        log.info("영수증 id: {}", receipt_id);
        List<ReceiptDetailDto> myReceiptDetailList = receiptService.myReceiptDetailList(receipt_id);
        if (myReceiptDetailList.size()>0) {
            return ResponseEntity.ok(myReceiptDetailList);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PostMapping("/registerReceipt")
    public ResponseEntity registerReceipt(@RequestBody ReceiptDto receiptDto) throws Exception {
        try {
            int result = receiptService.registerReceipt(receiptDto);
            log.info("result: {}", result);
            if (result > 0) {
                return ResponseEntity.ok("등록 성공");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("등록 실패");
            }
        } catch (DuplicateKeyException e) {
            log.error("중복키 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("영수증ID 중복");
        } catch (Exception e) {
            log.error("등록 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }

}
