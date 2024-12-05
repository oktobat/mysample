package com.example.mysample.controller;

import com.example.mysample.dto.CartVo;
import com.example.mysample.dto.OrderDetailVo;
import com.example.mysample.dto.OrderRequestDto;
import com.example.mysample.dto.OrderVo;
import com.example.mysample.service.OrderService;
import com.example.mysample.service.RefundService;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/payment")
public class PaymentController {

    private final OrderService orderService;

    private final RefundService refundService;

    private IamportClient iamportClient;

    @Value("${iamport.api_key}")
    private String iamportApiKey;

    @Value("${iamport.api_secret}")
    private String iamportApiSecret;

    @PostConstruct
    public void init() {					   // Rest API key     // REST API Secret
        this.iamportClient = new IamportClient(iamportApiKey, iamportApiSecret);
    }

    @RequestMapping("/verify/{imp_uid}")
    public IamportResponse<Payment> paymentByImpUid(@PathVariable("imp_uid") String imp_uid)
            throws IamportResponseException, IOException {
        // 데이터와 처음 금액이 일치 확인 이후 결제 성공 실패 여부 리턴
        System.out.println("결제 검증 서비스 실행");
        return iamportClient.paymentByImpUid(imp_uid);
    }

    @PostMapping("/orderRegister")  // 객체 order와 배열 checkOutList가 들어옴
    public ResponseEntity orderRegister(@RequestBody OrderRequestDto orderRequestDto) throws Exception {
        OrderVo orderVo = orderRequestDto.getOrder();
        List<CartVo> orderItems = orderRequestDto.getCheckOutList();
        System.out.println("주문자정보및주문번호"+orderVo);
        System.out.println("주문상품목록"+orderItems);
        // 주문 상세 정보와 카트 번호 목록 초기화
        List<OrderDetailVo> orderDetailItems = new ArrayList<>();
        List<Long> orderCartNos = new ArrayList<>();

        // 첫 번째 항목의 이미지를 orderVo에 설정
        if (!orderItems.isEmpty()) {
            orderVo.setImg_url(orderItems.get(0).getImg_url());
        }

        // 주문 항목별로 OrderDetailVo를 생성하고, 카트 번호를 추출하여 리스트에 추가
        for (CartVo item : orderItems) {
            OrderDetailVo orderDetailVo = new OrderDetailVo();
            orderDetailVo.setG_no(item.getG_no());
            orderDetailVo.setOrder_qty(item.getCart_qty());
            orderDetailVo.setG_name(item.getG_name());
            orderDetailVo.setG_price(item.getG_price());
            orderDetailVo.setImg_url(item.getImg_url());

            orderDetailItems.add(orderDetailVo);
            orderCartNos.add(item.getCart_no());
        }

        // 주문 항목 수, 총 금액, 배송비를 이용해 최종 금액 설정
        int count = orderItems.size();
        int orderAmount = orderVo.getOrder_amount();
        int shippingCost = orderVo.getShipping_cost();
        orderVo.setItem_count(count);
        orderVo.setFinal_amount(orderAmount + shippingCost);

        // 주문 상품 이름 설정 (여러 건일 경우 "상품명 외 x건" 형식)
        String itemName = orderItems.get(0).getG_name();
        orderVo.setItem_name(count > 1 ? itemName + " 외 " + (count - 1) + "건" : itemName);

        // 주문 서비스 호출 및 결제 실패 시 예외 처리
        try {
            int result = orderService.orderRegister(orderVo, orderDetailItems, orderCartNos);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            log.info("주문 상품 환불 진행 : 주문 번호 {}", orderVo.getOrder_id());

            // 환불 토큰 및 환불 요청
            try {
                String token = refundService.getToken(iamportApiKey, iamportApiSecret);
                refundService.refundRequest(token, orderVo.getOrder_id(), e.getMessage());
            } catch (IOException ex) {
                ex.printStackTrace();
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(-1);
        }
    }


    @GetMapping("/paymentCancel")
    public ResponseEntity paymentCancel(@RequestParam("order_id") String order_id) throws Exception {
        // 결제취소
        log.info("주문 상품 환불 진행 : 주문 번호 {}", order_id);
        String token = null;
        try {
            token = refundService.getToken(iamportApiKey, iamportApiSecret);
        } catch (IOException e1) {
            e1.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("실패");
        }
        try {
            refundService.refundRequest(token, order_id, "결제취소");
            return ResponseEntity.ok("성공");
        } catch (IOException e2) {
            e2.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("실패");
        }
    }

}
