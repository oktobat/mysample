package com.example.mysample.service;

import com.example.mysample.dto.CartVo;
import com.example.mysample.mapper.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartMapper cartMapper;

    @Override
    public int getCartItemQty(int m_no, long g_no) throws DataAccessException {
        return cartMapper.selectCartItemQty(m_no, g_no);
    }

    @Override
    public int cartIn(CartVo cartVo) throws DataAccessException {
        return cartMapper.insertCart(cartVo);
    }

    @Override
    public int cartGoodsCount(int m_no) throws DataAccessException {
        return cartMapper.selectCartCount(m_no);
    }

    @Override
    public List<CartVo> cartList(int m_no) throws DataAccessException {
        return cartMapper.selectCartList(m_no);
    }

    @Override
    public int cartUpdate(CartVo cartVo) throws DataAccessException {
        return cartMapper.updateCart(cartVo);
    }

    @Override
    public int cartDelete(long cart_no) throws DataAccessException {
        return cartMapper.deleteCartItem(cart_no);
    }

    @Override
    public int cartCheckedRemove(List cartNos) throws DataAccessException {
        return cartMapper.deleteCheckedCart(cartNos);
    }

    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = {RuntimeException.class, DataAccessException.class})
    @Override
    public int deleteCart(List<Long> orderCartNos) throws DataAccessException {
        return cartMapper.deleteCheckedCart(orderCartNos);
    }
}
