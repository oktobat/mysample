import React from 'react';

const Pagenation = ({pageVo, onPageChange}) => {
  const { prev, next, startPage, endPage, pageNum } = pageVo;

  const renderPageButtons = () => {
    const buttons = [];

    if (prev) {
      buttons.push(
        <button
          key="prev"
          className="page-btn"
          onClick={() => onPageChange(startPage - 1)}
        >
          Prev
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-btn ${i === pageNum ? 'on' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (next) {
      buttons.push(
        <button
          key="next"
          className="page-btn"
          onClick={() => onPageChange(endPage + 1)}
        >
          Next
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="pagination">
      {renderPageButtons()}
    </div>
  );
};

export default Pagenation;