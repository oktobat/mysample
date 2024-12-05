const openDaumPostcode = (onComplete) => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      let fullAddr = ''; // 최종 주소 변수
      let extraAddr = ''; // 조합형 주소 변수

      if (data.userSelectedType === 'R') {
        fullAddr = data.roadAddress; // 도로명 주소
      } else {
        fullAddr = data.jibunAddress; // 지번 주소
      }

      if (data.userSelectedType === 'R') {
        if (data.bname !== '') {
          extraAddr += data.bname;
        }
        if (data.buildingName !== '') {
          extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
        }
        fullAddr += (extraAddr !== '' ? ' (' + extraAddr + ')' : '');
      }

      // onComplete 콜백에 검색 결과 전달
      if (onComplete) {
        onComplete({
          zonecode: data.zonecode,
          address: fullAddr,
        });
      }
    },
  }).open();
};

export default openDaumPostcode;