package com.example.mysample.service;

import com.example.mysample.dto.CartVo;
import org.springframework.dao.DataAccessException;

import java.util.List;

public interface CartService {
    public int getCartItemQty(int m_no, long g_no) throws DataAccessException;
    public int cartIn(CartVo cartVo) throws DataAccessException;
    public int cartGoodsCount(int m_no) throws DataAccessException;
    public List<CartVo> cartList(int m_no) throws DataAccessException;
    public int cartUpdate(CartVo cartVo) throws DataAccessException;
    public int cartDelete(long cart_no) throws DataAccessException;
    public int cartCheckedRemove(List cartNos) throws DataAccessException;

    public int deleteCart(List<Long> orderCartNos) throws DataAccessException;
}
