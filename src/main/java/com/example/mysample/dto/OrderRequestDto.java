package com.example.mysample.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDto {
    private OrderVo order;
    private List<CartVo> checkOutList;
}
