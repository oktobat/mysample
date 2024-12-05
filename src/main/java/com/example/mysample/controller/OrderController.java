package com.example.mysample.controller;

import com.example.mysample.dto.OrderDetailVo;
import com.example.mysample.dto.OrderVo;
import com.example.mysample.service.OrderDetailService;
import com.example.mysample.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/order")
public class OrderController {

    private final OrderService orderService;
    private final OrderDetailService orderDetailService;

    @GetMapping("/myOrderList")
    public ResponseEntity myOrderList(@RequestParam("m_no") int m_no) throws Exception {
        List<OrderVo> myOrderList = orderService.myOrderList(m_no);
        if (myOrderList.size()>0) {
            return ResponseEntity.ok(myOrderList);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("실패");
        }
    }

    @GetMapping("/myOrderDetailList")
    public ResponseEntity myOrderDetailList(@RequestParam("order_no") long order_no) throws Exception {
        List<OrderDetailVo> myOrderDetailList = orderDetailService.myOrderDetailList(order_no);
        if (myOrderDetailList.size()>0) {
            return ResponseEntity.ok(myOrderDetailList);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("실패");
        }
    }

}
