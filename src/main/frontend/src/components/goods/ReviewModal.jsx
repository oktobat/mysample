import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components'
import {useSelector} from 'react-redux'
import axios from 'axios'

const ReviewModalBlock = styled.div`
    position:fixed; top:0; bottom:0; left:0; right:0; 
    background:rgba(0,0,0,0.5); justify-content:center; align-items:center;
    display:none;
    &.on { display:flex }
    .formBox {  background:#fff; width:800px; padding:30px; 
        table {td { border:1px solid #ddd; padding:15px 10px }}
        .star { color:#f00; input { margin-left:15px; &:nth-child(1) { margin-left:0px } } }
        textarea { padding:10px; resize:none }
        .attach {input { margin:5px 0; outline:1px solid #ddd; }}
        .btn { text-align:center; 
        button { background:red; color:#fff; padding:5px 10px; border-radius:5px; margin:20px 10px }
        }
    }
`

const ReviewModal = ({openModal, reviewedItem, onReviewComplete, onModalClose }) => {
    console.log("들어왔니?", reviewedItem)
    const user = useSelector(state=>state.member.user)
    const initialFormState = {
        rating: 5,
        comment: '',
        g_no: reviewedItem?.g_no || null,
        order_detail_no: reviewedItem?.order_detail_no || null,
        receipt_detail_no: reviewedItem?.receipt_detail_no || null,
        m_no: user?.m_no || null,
    };
    const [form, setForm] = useState(initialFormState);
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (reviewedItem) {
            setForm({
                ...initialFormState,
                g_no: reviewedItem.g_no || null,
                order_detail_no: reviewedItem.order_detail_no || null,
                receipt_detail_no: reviewedItem.receipt_detail_no || null,
            });
        }
        }, [reviewedItem, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    // 등록 버튼 클릭시 호출
    const registerReview = async (e) => {
        e.preventDefault();

        if (!form.comment) {
            alert("후기를 작성하세요.");
            return;
        }

        const formData = new FormData();
        formData.append("review", new Blob([JSON.stringify(form)], { type: "application/json" }));

        files.forEach(file => {
            formData.append("file", file);
        });

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/review/registerReviewConfirm`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                resetForm();
                const identifier = form.receipt_detail_no || form.order_detail_no;
                onReviewComplete(identifier)
                onModalClose();
            } else {
                alert("리뷰쓰기에 실패했습니다.");
            }
        } catch (error) {
            console.log(error);
            alert("리뷰쓰기 중 오류가 발생했습니다.");
        }
    };

    // 취소 버튼 클릭시 호출
    const resetForm = () => {
        setForm(initialFormState);
        setFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = null; // 파일 입력 필드 초기화
        }
    };

    if (!reviewedItem) return null;

    return (
        <ReviewModalBlock className={ openModal ? 'reviewModal on' : 'reviewModal' }>
            <div className="formBox">
                <form name="review_form">
                    <table>
                        <colgroup>
                            <col style={{ width: '100px' }} />
                            <col style={{ width: 'auto' }} />
                        </colgroup>
                        <tbody>
                            <tr>
                                <td>상품명</td>
                                <td className="gname">{reviewedItem?.g_name}</td>
                            </tr>
                            <tr>
                                <td>평점</td>
                                <td className="star">
                                    <input type="radio" name="rating" value="5" checked={form.rating == 5} onChange={handleChange} /> ★★★★★
                                    <input type="radio" name="rating" value="4" checked={form.rating == 4} onChange={handleChange} /> ★★★★☆
                                    <input type="radio" name="rating" value="3" checked={form.rating == 3} onChange={handleChange} /> ★★★☆☆
                                    <input type="radio" name="rating" value="2" checked={form.rating == 2} onChange={handleChange} /> ★★☆☆☆
                                    <input type="radio" name="rating" value="1" checked={form.rating == 1} onChange={handleChange} /> ★☆☆☆☆
                                </td>
                            </tr>
                            <tr>
                                <td>내용(필수)</td>
                                <td>
                                    <textarea
                                        name="comment"
                                        style={{ width: '100%', height: '200px' }}
                                        placeholder="10글자 이상 작성하세요!!"
                                        value={form.comment}
                                        onChange={handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>첨부사진<br />포토상품명</td>
                                <td className="attach">
                                    <input
                                    multiple
                                    ref={fileInputRef}
                                    type="file"
                                    className="files"
                                    onChange={ handleFileChange }
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="btn">
                        <button type="button" onClick={registerReview}>등록</button>
                        <button type="button" onClick={resetForm}>취소</button>
                        <button type="button" className="close" onClick={ ()=>{resetForm(); onModalClose()} }>닫기</button>
                    </div>
                </form>
            </div>
        </ReviewModalBlock>
    );
};

export default ReviewModal;