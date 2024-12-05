package com.example.mysample.mapper;

import com.example.mysample.dto.OrderDetailVo;
import com.example.mysample.dto.OrderVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderMapper {
    @Options(useGeneratedKeys = true, keyProperty = "order_no")
    long insertOrder(OrderVo orderVo);

    List<OrderVo> selectMyOrderList(@Param("m_no") int m_no);


}
