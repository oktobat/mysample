package com.example.mysample.service;

import com.example.mysample.dto.GoodsDto;
import com.example.mysample.dto.GoodsImageVo;
import com.example.mysample.dto.OrderDetailVo;
import com.example.mysample.mapper.GoodsImageMapper;
import com.example.mysample.mapper.GoodsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GoodsServiceImpl implements GoodsService {

    private final GoodsMapper goodsMapper;

    private final GoodsImageMapper goodsImageMapper;

    @Override
    public List<GoodsDto> mainGoods(String g_type) {
        List<GoodsDto> list = goodsMapper.selectMainGoods(g_type);
        System.out.println("서비스"+list.toString());
        return list;
    }

    @Override
    public List<GoodsDto> categoryData(int pNum, int scale, String g_type) throws DataAccessException {
        List<GoodsDto> goodsList = goodsMapper.selectGoodsList(pNum, scale, g_type);
        return goodsList;
    }

    @Override
    public List<GoodsDto> searchData(int pNum, int scale, String keyword) throws DataAccessException {
        List<GoodsDto> goodsList = goodsMapper.selectSearchGoodsList(pNum, scale, keyword);
        return goodsList;
    }

    @Override
    public int goodsListCount(String g_category) throws DataAccessException {
        return goodsMapper.selectGoodsCount(g_category);
    }

    @Override
    public int searchListCount(String keyword) throws DataAccessException {
        return goodsMapper.selectSearchGoodsCount(keyword);
    }

    @Override
    public String registerGoodsConfirm(Map<String, Object> newGoodsMap) throws DataAccessException {
        GoodsDto goods = (GoodsDto) newGoodsMap.get("item");
        List<String> images = (List<String>) newGoodsMap.get("imageFileList");
        long g_no = insertNewGoods(goods);
        String message = null;
        int result = 0;
        if ( images!=null && g_no>0) {
            Map<String, Object> map = new HashMap<>();
            map.put("images", images);
            map.put("g_no", g_no);
            result = goodsImageMapper.insertDetailImage(map);
        }
        if (g_no>0) {
            if (result>0) {
                message = "성공";
            } else {
                message = "부분성공";
            }
        } else {
            message = "실패";
        }
        return message;
    }

    private long insertNewGoods(GoodsDto goodsDto) {
        goodsMapper.insertNewGoods(goodsDto);
        return goodsDto.getG_no();
    }

    @Override
    public List detailImage(long g_no) throws DataAccessException {
        return goodsImageMapper.selectImages(g_no);
    }

    @Override
    public int modifyGoodsConfirm(GoodsDto goodsDto) throws DataAccessException {
        return goodsMapper.updateGoods(goodsDto);
    }

    @Override
    public int updateImage(GoodsImageVo goodsImageVo) throws DataAccessException {
        return goodsImageMapper.updateImage(goodsImageVo);
    }

    @Override
    public int removeImage(long img_no) throws DataAccessException {
        return goodsImageMapper.deleteGoodsImage(img_no);
    }

    @Override
    public int registerImage(GoodsImageVo goodsImageVo) throws DataAccessException {
        return goodsImageMapper.insertImage(goodsImageVo);
    }

    @Override
    public int removeGoods(long g_no) throws DataAccessException {
        return goodsMapper.deleteGoods(g_no);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = {RuntimeException.class, IllegalArgumentException.class, Exception.class})
    public int updateGoodsInventory(OrderDetailVo orderDetailItem) throws DataAccessException {
        int result = goodsMapper.updateGoodsInventory(orderDetailItem);
        if (result == 0) {
            throw new IllegalArgumentException("재고가 부족한 상품이 있습니다.");
        }
        return result;
    }

}
