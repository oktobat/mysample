package com.example.mysample.controller;

import com.example.mysample.dto.GoodsDto;
import com.example.mysample.dto.GoodsImageVo;
import com.example.mysample.service.GoodsService;
import com.example.mysample.util.PageVo;
import com.example.mysample.util.UploadFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.mysample.util.MultiUploadFileService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/goods")
public class GoodsRestController {

    private final GoodsService goodsService;

    private final MultiUploadFileService multiUploadFileService;

    private final UploadFileService uploadFileService;

   // 메인페이지 신상품, 인기상품 데이터 가져오기
    @GetMapping(value="/mainGoods", produces="application/json")
    public List<GoodsDto> mainGoods(@RequestParam("g_type") String g_type) {
        System.out.println(g_type);
        List<GoodsDto> mainList = goodsService.mainGoods(g_type);
        System.out.println("너니?"+mainList.toString());
        return mainList;
    }

    // 업로드한 상품이미지 가져오기(현재는 사용되지 않으며, WebConfig 클래스를 활용해서 이미지경로를 표시함)
    @GetMapping("/image")
    public ResponseEntity<Resource> returnImage(@RequestParam("image") String filename) {
        String path = "C:\\goods\\upload\\"; //이미지가 저장된 위치
        String folder = "";
        Resource resource = new FileSystemResource(path + folder + filename);
        if (!resource.exists()) return new ResponseEntity<Resource>(HttpStatus.NOT_FOUND);

        HttpHeaders header = new HttpHeaders();
        Path filePath = null;
        try {
            filePath = Paths.get(path + folder + filename);
            header.add("Content-Type", Files.probeContentType(filePath));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<Resource>(resource, header, HttpStatus.OK);
    }
    
    // 카테고리별 상품데이터 가져오기
    @GetMapping(value="/categoryData", produces="application/json")
    public Map<String, Object> categoryData(@RequestParam("pageGroup") int pageGroup, @RequestParam("pageNum") int pageNum, @RequestParam("category") String g_category) {
        int amount = 10;
        int pageNums = 10;
        Map<String, Object> map = new HashMap<>();
        List<GoodsDto> goodsList = goodsService.categoryData((pageNum-1)*amount, amount, g_category);
        int totArticles = goodsService.goodsListCount(g_category);
        PageVo pageVo = new PageVo(pageGroup, pageNum, amount, pageNums, totArticles);
        map.put("goodsList", goodsList);
        map.put("pageVo", pageVo);
        return map;
    }

    // 검색 상품데이터 가져오기
    @GetMapping(value="/searchData", produces="application/json")
    public Map<String, Object> searchData(@RequestParam("pageGroup") int pageGroup, @RequestParam("pageNum") int pageNum, @RequestParam("category") String keyword) {
        int amount = 10;
        int pageNums = 10;
        Map<String, Object> map = new HashMap<>();
        List<GoodsDto> goodsList = goodsService.searchData((pageNum-1)*amount, amount, keyword);
        int totArticles = goodsService.searchListCount(keyword);
        PageVo pageVo = new PageVo(pageGroup, pageNum, amount, pageNums, totArticles);
        map.put("goodsList", goodsList);
        map.put("pageVo", pageVo);
        return map;
    }

    @PostMapping(value="/registerGoodsConfirm", produces="text/plain; charset=UTF-8")
    public String registerGoodsConfirm(@RequestPart(value="item") GoodsDto goodsDto, @RequestPart(value="file", required=false) List<MultipartFile> files) {
        Map<String, Object> newGoodsMap = new HashMap<>();
        newGoodsMap.put("item", goodsDto);
        if (files.size()>0) {
            List<String> imageFileList = multiUploadFileService.multiUpload(files);
            newGoodsMap.put("imageFileList", imageFileList);
        }
        String message = goodsService.registerGoodsConfirm(newGoodsMap);
        return message;
    }

    @GetMapping("/detailImage")
    public ResponseEntity detailImage(@RequestParam("g_no") long g_no) {
        List<GoodsImageVo> imageList = goodsService.detailImage(g_no);
        if (imageList.size()>0) {
            return ResponseEntity.ok(imageList);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(-1);
        }
    }

    @PutMapping("/modifyGoodsConfirm")
    public ResponseEntity modifyGoodsConfirm(@RequestBody GoodsDto goodsDto) {
        int result = goodsService.modifyGoodsConfirm(goodsDto);
        if (result>0) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }

    @PostMapping("/updateImage")
    public ResponseEntity updateImage(@RequestPart(value="image") MultipartFile file, @RequestParam("img_no") long img_no, GoodsImageVo goodsImageVo){
        String changeImage = uploadFileService.upload(file);
        System.out.println(img_no);
        goodsImageVo.setImg_url(changeImage);
        goodsImageVo.setImg_no(img_no);
        int result = goodsService.updateImage(goodsImageVo);
        if (result>0) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }

    @DeleteMapping("/removeImage")
    public ResponseEntity removeImage(@RequestParam("img_no") long img_no) {
        int result = goodsService.removeImage(img_no);
        if (result>0) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }

    @PostMapping("/registerImage")
    public ResponseEntity registerImage(@RequestPart(value="image") MultipartFile file, @RequestParam("g_no") long g_no, GoodsImageVo goodsImageVo){
        String changeImage = uploadFileService.upload(file);
        goodsImageVo.setImg_url(changeImage);
        goodsImageVo.setG_no(g_no);
        int result = goodsService.registerImage(goodsImageVo);
        if (result>0) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }

    @DeleteMapping("/removeGoods")
    public ResponseEntity removeGoods(@RequestParam("g_no") long g_no) {
        int result = goodsService.removeGoods(g_no);
        if (result>0) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }

}
