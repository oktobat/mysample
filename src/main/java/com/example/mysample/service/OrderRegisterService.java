package com.example.mysample.service;

import com.example.mysample.dto.OrderVo;
import org.springframework.dao.DataAccessException;

public interface OrderRegisterService {
    public long insertRegisterOrder(OrderVo orderVo) throws DataAccessException;
}
