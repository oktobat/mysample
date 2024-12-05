package com.example.mysample.mapper;

import com.example.mysample.dto.OrderDetailVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderDetailMapper {

    int insertOrderDetail(@Param("order_no") long order_no, @Param("orderDetailItems") List<OrderDetailVo> orderDetailItems);
    List<OrderDetailVo> selectMyOrderDetailList(@Param("order_no") long order_no);
    int updateOrderDetailReviewed(@Param("order_detail_no") long order_detail_no);
}
