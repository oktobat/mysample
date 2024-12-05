package com.example.mysample.service;

import com.example.mysample.dto.OrderVo;
import com.example.mysample.mapper.GoodsMapper;
import com.example.mysample.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderRegisterServiceImpl implements OrderRegisterService {

    private final OrderMapper orderMapper;

    @Override
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = {RuntimeException.class, IllegalArgumentException.class, Exception.class})
    public long insertRegisterOrder(OrderVo orderVo) throws DataAccessException {
        orderMapper.insertOrder(orderVo);
        return orderVo.getOrder_no();
    }
}
