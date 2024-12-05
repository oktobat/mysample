package com.example.mysample.util;

import lombok.Data;

@Data
public class PageVo {
    private int pageGroup;  // 현재 페이지 그룹
    private int pageNum;    // 현재 페이지 번호
    private int amount;     // 한 페이지당 출력할 게시물 수
    private int pageNums;   // 페이지 네이션 버튼에 보여줄 페이지 수
    private int totArticles;// 전체 게시물 수
    private int startPage;  // 페이지 네이션의 시작 페이지
    private int endPage;    // 페이지 네이션의 끝 페이지
    private boolean prev;   // 이전 페이지 그룹으로 이동 가능 여부
    private boolean next;   // 다음 페이지 그룹으로 이동 가능 여부

    // 생성자
    public PageVo(int pageGroup, int pageNum, int amount, int pageNums, int totArticles) {
        this.pageGroup = pageGroup;
        this.pageNum = pageNum;
        this.amount = amount;
        this.pageNums = pageNums;
        this.totArticles = totArticles;

        // 페이지 네이션 시작과 끝 계산
        this.endPage = (int) (Math.ceil((double) pageNum / pageNums) * pageNums);
        this.startPage = this.endPage - pageNums + 1;

        int realEndPage = (int) (Math.ceil((double) totArticles / amount));

        if (this.endPage > realEndPage) {
            this.endPage = realEndPage;
        }

        this.prev = this.startPage > 1;
        this.next = this.endPage < realEndPage;
    }

    // toString 메소드 (디버깅용)
    @Override
    public String toString() {
        return "PageVo [pageGroup=" + pageGroup + ", pageNum=" + pageNum +
                ", amount=" + amount + ", pageNums=" + pageNums +
                ", totArticles=" + totArticles + ", startPage=" + startPage +
                ", endPage=" + endPage + ", prev=" + prev + ", next=" + next + "]";
    }
}
