# Trend Insight Agent Dashboard

화장품 산업 도메인 트렌드 분석 대시보드 MVP

## 기술 스택

- **Framework**: React + Vite
- **Styling**: Tailwind CSS (Dark Theme)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animation**: Framer Motion

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 주요 기능

1. **Insight Leaderboard (왼쪽 패널)**
   - 트렌드 랭킹 리스트
   - 아코디언 UI로 상세 차트 확장/축소
   - 3-Signal Verified (SNS, Retail, Review) 차트 시각화

2. **Agent Action (오른쪽 패널)**
   - 선택된 트렌드의 Dynamic Insight 표시
   - 마케팅 소구 포인트 제안서 생성 버튼
   - 신제품 기획(NPD) 초안 생성 버튼

## Mock Data

기획서 기반 7개 트렌드 데이터가 하드코딩되어 있습니다:
- Skincare: Retinol + Ampoule + Pore Care
- Suncare: Zinc Oxide + Sun Stick + Non-greasy
- Cleansing: AHA/BHA + Cleansing Oil + Blackhead
- Makeup: Hyaluronic acid + Cushion + Glow
- Skincare: Panthenol + Cream + Barrier Repair
- Menscare: Cica + All-in-one + Soothing
- Haircare: Biotin + Shampoo + Anti-hair loss

