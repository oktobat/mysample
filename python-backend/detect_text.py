from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, ImageEnhance, ImageFilter
import pytesseract
import os
import cv2
import numpy as np
import re
import requests

app = Flask(__name__)       # Flask는 파이썬 기반의 백엔드 웹 프레임워크
CORS(app, resources={r"/*": {"origins": "*"}})  # React와 Flask 간의 CORS 문제 해결
UPLOAD_FOLDER = 'uploads'   # 업로드 폴더 설정
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    print("요청 받음")
    try:
        filepath = validate_and_save_file(request.files)
        extracted_text = perform_ocr(filepath)
        print(extracted_text)
        receipt_id, sales_total, g_nos = buy_product_info(extracted_text)
        print(receipt_id, sales_total, g_nos)
        if receipt_id is None or sales_total is None or g_nos is None:
            return jsonify({"message": "등록할 수 없는 영수증입니다."})

        response = save_to_java(receipt_id, request.form.get("m_no"), sales_total, g_nos)
        if response is not None:
            return jsonify({"message": response})
        return jsonify({"message": "Java API 오류"}), 500
    
    except ValueError as ve:
        print(f"클라이언트 오류: {ve}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        print(f"서버 내부 오류: {e}")
        return jsonify({"error": "서버 내부 오류"}), 500

def validate_and_save_file(files):
    if 'file' not in files:
        raise ValueError("No file uploaded")
    
    file = request.files['file']
    if file.filename == '':
        raise ValueError("No selected file")
    
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    print(f"File saved to {filepath}")
    return filepath

def perform_ocr(image_path):
    preprocessed_image = preprocess_image(image_path)

    # OCR 수행 : --oem 3(최적의 OCR 엔진을 자동으로 선택하겠다), --psm 6(페이지를 단일 텍스트 블록으로 처리)
    custom_config = r'--oem 3 --psm 6'

    try:
        # 한국어 OCR 수행
        text = pytesseract.image_to_string(preprocessed_image, config=custom_config, lang="kor+eng")
    except pytesseract.TesseractError as e:
        print(f"Tesseract OCR failed: {e}")
        raise

    return text

def preprocess_image(image_path):
    image = Image.open(image_path)

    # 해상도 향상
    image = image.resize((image.width * 2, image.height * 2), Image.Resampling.LANCZOS)

    # 흑백 변환
    image = image.convert("L")

    # 대비 조정
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2.0)

    # 필터 적용 (노이즈 제거)
    image = image.filter(ImageFilter.MedianFilter(size=3))

    # 임계값 처리 (선택 사항)
    image = np.array(image)  # OpenCV 처리를 위해 배열로 변환
    _, thresholded = cv2.threshold(image, 127, 255, cv2.THRESH_BINARY)
    image = Image.fromarray(thresholded)  # Pillow 이미지로 변환

    return image


def buy_product_info(parse_text):
    receipt_store = re.search(r"\아성다이소", parse_text)
    if receipt_store:
        receipt_day = re.search(r'(\d{4})[-.](\d{2})[-.](\d{2}) (\d{2}):(\d{2})', parse_text)
        year, month, day, hour, minute = receipt_day.groups()
        receipt_id = f"{year}{month}{day}{hour}{minute}"
        product_nos = re.findall(r'\[\d+\]', parse_text)
        g_nos = [match.strip('[]') for match in product_nos]
        sales_total_comma = re.search(r'판매합계\s*([\d,\s]+)', parse_text).group(1)
        sales_total = sales_total_comma.replace(",", "").replace(" ", "")
        return receipt_id, sales_total, g_nos
    else:
        return None, None, None


def save_to_java(receipt_id, m_no, total_amount, g_nos):
    java_api_url = "http://localhost:8080/receipt/registerReceipt"
    payload = {
        "receipt_id": receipt_id,
        "m_no": m_no,
        "total_amount":total_amount,
        "g_nos": g_nos
    }
    try:
        response = requests.post(java_api_url, json=payload)
        return response.text
    except requests.RequestException as e:
        print("요청 실패:", e)
        return None

if __name__ == '__main__':
    print("파이썬 서버 시작")
    app.run(port=5000, debug=True)    