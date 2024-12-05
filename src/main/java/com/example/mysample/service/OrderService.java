package com.example.mysample.service;

import com.example.mysample.dto.OrderDetailVo;
import com.example.mysample.dto.OrderVo;

import java.util.List;

public interface OrderService {
    public int orderRegister(OrderVo orderVo, List<OrderDetailVo> orderDetailItems, List<Long> orderCartNos) throws Exception;
    List<OrderVo> myOrderList(int m_no) throws Exception;
}
