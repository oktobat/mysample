package com.example.mysample.service;

import com.example.mysample.dto.OrderDetailVo;
import org.springframework.dao.DataAccessException;

import java.util.List;

public interface OrderDetailService {
    public int insertOrderDetail(long orderNo, List<OrderDetailVo> orderDetailItems) throws DataAccessException;
    public List<OrderDetailVo> myOrderDetailList(long order_no) throws DataAccessException;
}
