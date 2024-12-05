package com.example.mysample.service;

import com.example.mysample.dto.GoodsDto;
import com.example.mysample.dto.GoodsImageVo;
import com.example.mysample.dto.OrderDetailVo;
import org.springframework.dao.DataAccessException;

import java.util.List;
import java.util.Map;

public interface GoodsService {
    public List<GoodsDto> mainGoods(String g_type) throws DataAccessException;
    public List<GoodsDto> categoryData(int pNum, int scale, String g_category) throws DataAccessException;
    public List<GoodsDto> searchData(int pNum, int scale, String keyword) throws DataAccessException;
    public int goodsListCount(String g_category) throws DataAccessException;
    public int searchListCount(String keyword) throws DataAccessException;
    public String registerGoodsConfirm(Map<String, Object> newGoodsMap) throws DataAccessException;
    public List detailImage(long g_no) throws DataAccessException;
    public int modifyGoodsConfirm(GoodsDto goodsDto) throws DataAccessException;
    public int updateImage(GoodsImageVo goodsImageVo) throws DataAccessException;
    public int removeImage(long img_no) throws DataAccessException;
    public int registerImage(GoodsImageVo goodsImageVo) throws DataAccessException;
    public int removeGoods(long g_no) throws DataAccessException;
    public int updateGoodsInventory(OrderDetailVo orderDetailItem) throws DataAccessException;
}
