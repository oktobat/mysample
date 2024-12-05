package com.example.mysample.service;

import com.example.mysample.dto.OrderDetailVo;
import com.example.mysample.dto.OrderVo;
import com.example.mysample.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRegisterService orderRegisterService;
    private final OrderDetailService orderDetailService;
    private final CartService cartService;
    private final GoodsService goodsService;
    private final OrderMapper orderMapper;

    @Override
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = {RuntimeException.class, IllegalArgumentException.class, Exception.class})
    public int orderRegister(OrderVo orderVo, List<OrderDetailVo> orderDetailItems, List<Long> orderCartNos) throws Exception {
        int totalUpdated = 0;

        try {
            // 상품 재고 업데이트
            for (OrderDetailVo orderDetailItem : orderDetailItems) {
                int result = goodsService.updateGoodsInventory(orderDetailItem);
                if (result == 0) {
                    throw new RuntimeException("재고 업데이트 실패: 상품 번호 " + orderDetailItem.getG_no());
                }
                totalUpdated += result;
            }

            // 주문 테이블에 저장후 주문번호를 추출해서 주문상세테이블에 외래키로 추가함
            long orderNo = orderRegisterService.insertRegisterOrder(orderVo);
            System.out.println("orderNo"+orderNo);
            System.out.println("orderNo"+orderDetailItems);
            orderDetailService.insertOrderDetail(orderNo, orderDetailItems);

            // 장바구니에서 해당 아이템 제거
            cartService.deleteCart(orderCartNos);

            log.info("총 업데이트된 항목 수: {}", totalUpdated);
            return totalUpdated;

        } catch (Exception e) {
            log.error("주문 등록 중 오류 발생: {}", e.getMessage(), e);
            throw e;  // 예외 재발생하여 트랜잭션 롤백
        }
    }

    @Override
    public List<OrderVo> myOrderList(int m_no) throws Exception {
        return orderMapper.selectMyOrderList(m_no);
    }



}
