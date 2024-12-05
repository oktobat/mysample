package com.example.mysample.mapper;

import com.example.mysample.dto.CartVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CartMapper {
    int selectCartItemQty(@Param("m_no") int m_no, @Param("g_no") long g_no);
    int insertCart(CartVo cartVo);
    int selectCartCount(@Param("m_no") int m_no);
    List<CartVo> selectCartList(@Param("m_no") int m_no);
    int updateCart(CartVo cartVo);
    int deleteCartItem(@Param("cart_no") long cart_no);
    int deleteCheckedCart(@Param("cartNos") List cartNos);
}
