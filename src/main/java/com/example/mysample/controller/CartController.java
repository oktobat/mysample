package com.example.mysample.controller;

import com.example.mysample.dto.CartVo;
import com.example.mysample.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    @PostMapping("/cartIn")
    public ResponseEntity cartIn(@RequestBody CartVo cartVo) throws Exception {
        try {
            int existingCartQty = cartService.getCartItemQty(cartVo.getM_no(), cartVo.getG_no());
            if (existingCartQty + cartVo.getCart_qty() <= cartVo.getG_inventory()) {
                int result = cartService.cartIn(cartVo);
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Inventory limit exceeded");
            }
        } catch (Exception e) {
            log.error("Error during cart insertion: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding to cart");
        }
    }

    @GetMapping("/cartGoodsCount")
    public ResponseEntity cartGoodsCount(@RequestParam("m_no") int m_no){
        System.out.println(m_no);
        int result = cartService.cartGoodsCount(m_no);
        if (result>0) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }

    @GetMapping("/cartList")
    public ResponseEntity cartList(@RequestParam("m_no") int m_no){
        System.out.println(m_no);
        List<CartVo> cartItems = cartService.cartList(m_no);
        if (cartItems.size()>0) {
            return ResponseEntity.ok(cartItems);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PutMapping("/cartUpdate")
    public ResponseEntity cartUpdate(@RequestBody CartVo cartVo) {
        System.out.println(cartVo);
        int result = cartService.cartUpdate(cartVo);
        if (result>0) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }

    @DeleteMapping("/cartDelete")
    public ResponseEntity<?> cartDelete(@RequestParam("cart_no") long cart_no, @RequestParam("m_no") int m_no) {
        int result = cartService.cartDelete(cart_no);
        if (result>0) {
            int count = cartService.cartGoodsCount(m_no);
            if (count>=0) {
                return ResponseEntity.ok(count);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(-1);
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }

    @PostMapping("/cartCheckedRemove")
    public ResponseEntity cartCheckedRemove(@RequestBody Map<String, Object> map) {
        List<Long> cartNos = (List<Long>) map.get("selectedItems");
        int m_no = (int) map.get("m_no");
        int result = cartService.cartCheckedRemove(cartNos);
        if (result>0) {
            int count = cartService.cartGoodsCount(m_no);
            if (count>=0) {
                return ResponseEntity.ok(count);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(-1);
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }


}