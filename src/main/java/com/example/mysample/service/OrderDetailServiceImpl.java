package com.example.mysample.service;

import com.example.mysample.dto.OrderDetailVo;
import com.example.mysample.mapper.OrderDetailMapper;
import com.example.mysample.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailServiceImpl implements OrderDetailService {

    private final OrderDetailMapper orderDetailMapper;

    @Override
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = {RuntimeException.class, Exception.class})
    public int insertOrderDetail(long orderNo, List<OrderDetailVo> orderDetailItems) throws DataAccessException {
        // 강제로 예외 발생
        if (orderDetailItems.isEmpty()) {
            throw new RuntimeException("Order detail items are empty");
        }

        return orderDetailMapper.insertOrderDetail(orderNo, orderDetailItems);
    }

    @Override
    public List<OrderDetailVo> myOrderDetailList(long order_no) throws DataAccessException {
        return orderDetailMapper.selectMyOrderDetailList(order_no);
    }
}
