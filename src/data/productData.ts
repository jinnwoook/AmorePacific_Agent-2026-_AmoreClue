import { OverseasProduct } from '../components/OverseasProductList';
import { DomesticProduct } from '../components/DomesticProductList';

export const overseasProducts: Record<string, OverseasProduct[]> = {
  'Skincare': [
    { id: 'ov-sk-1', name: 'CeraVe Hydrating Cleanser', brand: 'CeraVe', category: '클렌저', image: '/images/products/cerave-1.jpg' },
    { id: 'ov-sk-2', name: 'La Roche-Posay Toleriane Double Repair', brand: 'La Roche-Posay', category: '모이스처라이저', image: '/images/products/la-roche-posa-3.jpg' },
    { id: 'ov-sk-3', name: 'The Ordinary Niacinamide 10% + Zinc', brand: 'The Ordinary', category: '세럼', image: '/images/products/the-ordinary.jpg' },
    { id: 'ov-sk-4', name: 'Neutrogena Ultra Gentle Daily Cleanser', brand: 'Neutrogena', category: '클렌저' },
    { id: 'ov-sk-5', name: 'Cetaphil Daily Facial Cleanser', brand: 'Cetaphil', category: '클렌저' },
  ],
  'Cleansing': [
    { id: 'ov-cl-1', name: 'CeraVe Foaming Facial Cleanser', brand: 'CeraVe', category: '클렌저' },
    { id: 'ov-cl-2', name: 'La Roche-Posay Effaclar Purifying Foaming Gel', brand: 'La Roche-Posay', category: '클렌저' },
    { id: 'ov-cl-3', name: 'Neutrogena Oil-Free Acne Wash', brand: 'Neutrogena', category: '클렌저' },
    { id: 'ov-cl-4', name: 'The Ordinary Squalane Cleanser', brand: 'The Ordinary', category: '클렌저' },
    { id: 'ov-cl-5', name: 'Cetaphil Gentle Skin Cleanser', brand: 'Cetaphil', category: '클렌저' },
  ],
  'Sun Care': [
    { id: 'ov-sc-1', name: 'La Roche-Posay Anthelios Ultra Light', brand: 'La Roche-Posay', category: '선크림' },
    { id: 'ov-sc-2', name: 'Neutrogena Ultra Sheer Dry-Touch', brand: 'Neutrogena', category: '선크림' },
    { id: 'ov-sc-3', name: 'CeraVe Hydrating Mineral Sunscreen', brand: 'CeraVe', category: '선크림' },
    { id: 'ov-sc-4', name: 'The Ordinary Mineral UV Filters', brand: 'The Ordinary', category: '선크림' },
    { id: 'ov-sc-5', name: 'Cetaphil Daily Facial Moisturizer SPF', brand: 'Cetaphil', category: '선크림' },
  ],
  'Makeup': [
    { id: 'ov-mk-1', name: 'Fenty Beauty Pro Filt\'r Foundation', brand: 'Fenty Beauty', category: '파운데이션' },
    { id: 'ov-mk-2', name: 'Glossier Cloud Paint', brand: 'Glossier', category: '블러셔' },
    { id: 'ov-mk-3', name: 'Rare Beauty Liquid Blush', brand: 'Rare Beauty', category: '블러셔' },
    { id: 'ov-mk-4', name: 'Charlotte Tilbury Pillow Talk', brand: 'Charlotte Tilbury', category: '립스틱' },
    { id: 'ov-mk-5', name: 'Milk Makeup Hydro Grip Primer', brand: 'Milk Makeup', category: '프라이머' },
  ],
  'Hair Care': [
    { id: 'ov-hc-1', name: 'Olaplex No.3 Hair Perfector', brand: 'Olaplex', category: '트리트먼트' },
    { id: 'ov-hc-2', name: 'Moroccanoil Treatment', brand: 'Moroccanoil', category: '오일' },
    { id: 'ov-hc-3', name: 'Living Proof Perfect Hair Day', brand: 'Living Proof', category: '샴푸' },
    { id: 'ov-hc-4', name: 'Briogeo Don\'t Despair, Repair!', brand: 'Briogeo', category: '마스크' },
    { id: 'ov-hc-5', name: 'Kérastase Elixir Ultime', brand: 'Kérastase', category: '오일' },
  ],
  'Body Care': [
    { id: 'ov-bc-1', name: 'CeraVe Moisturizing Cream', brand: 'CeraVe', category: '바디크림' },
    { id: 'ov-bc-2', name: 'Neutrogena Body Oil', brand: 'Neutrogena', category: '바디오일' },
    { id: 'ov-bc-3', name: 'The Body Shop Body Butter', brand: 'The Body Shop', category: '바디크림' },
    { id: 'ov-bc-4', name: 'Sol de Janeiro Brazilian Bum Bum Cream', brand: 'Sol de Janeiro', category: '바디크림' },
    { id: 'ov-bc-5', name: 'L\'Occitane Shea Butter Hand Cream', brand: 'L\'Occitane', category: '핸드크림' },
  ],
  'Mens Care': [
    { id: 'ov-mc-1', name: 'Kiehl\'s Facial Fuel Energizing Scrub', brand: 'Kiehl\'s', category: '스크럽' },
    { id: 'ov-mc-2', name: 'Lab Series Multi-Action Face Wash', brand: 'Lab Series', category: '클렌저' },
    { id: 'ov-mc-3', name: 'Bulldog Original Moisturizer', brand: 'Bulldog', category: '모이스처라이저' },
    { id: 'ov-mc-4', name: 'Jack Black Double-Duty Face Moisturizer', brand: 'Jack Black', category: '모이스처라이저' },
    { id: 'ov-mc-5', name: 'Aesop Parsley Seed Facial Cleanser', brand: 'Aesop', category: '클렌저' },
  ],
};

export const domesticProducts: Record<string, DomesticProduct[]> = {
  'Skincare': [
    { id: 'dom-sk-1', name: '라네즈 워터뱅크 하이드로 크림', brand: '라네즈', category: '모이스처라이저' },
    { id: 'dom-sk-2', name: '설화수 자음생 에센스', brand: '설화수', category: '에센스' },
    { id: 'dom-sk-3', name: '에스티로더 어드밴스드 나이트 리페어', brand: '에스티로더', category: '세럼' },
    { id: 'dom-sk-4', name: '이니스프리 그린티 씨드 세럼', brand: '이니스프리', category: '세럼' },
    { id: 'dom-sk-5', name: '미샤 시그니처 컴플렉스 케어 크림', brand: '미샤', category: '크림' },
  ],
  'Cleansing': [
    { id: 'dom-cl-1', name: '코스알엑스 저분자 히알루론산 클렌징 워터', brand: '코스알엑스', category: '클렌저' },
    { id: 'dom-cl-2', name: '라네즈 퍼펙트 클렌징 오일', brand: '라네즈', category: '클렌저' },
    { id: 'dom-cl-3', name: '헤라 센슈얼 파우더 나이트', brand: '헤라', category: '클렌저' },
    { id: 'dom-cl-4', name: '설화수 순행 클렌징 폼', brand: '설화수', category: '클렌저' },
    { id: 'dom-cl-5', name: '더페이스샵 라이스 워터 브라이트 클렌징 워터', brand: '더페이스샵', category: '클렌저' },
  ],
  'Sun Care': [
    { id: 'dom-sc-1', name: '라네즈 퍼펙트 리뉴 선크림', brand: '라네즈', category: '선크림' },
    { id: 'dom-sc-2', name: '설화수 자음생 선크림', brand: '설화수', category: '선크림' },
    { id: 'dom-sc-3', name: '헤라 선 메이트 레포츠', brand: '헤라', category: '선크림' },
    { id: 'dom-sc-4', name: '이니스프리 퍼펙트 UV 프로텍션', brand: '이니스프리', category: '선크림' },
    { id: 'dom-sc-5', name: '미샤 에어리핏 선크림', brand: '미샤', category: '선크림' },
  ],
  'Makeup': [
    { id: 'dom-mk-1', name: '헤라 블랙 쿠션', brand: '헤라', category: '쿠션' },
    { id: 'dom-mk-2', name: '설화수 퍼펙트 커버 쿠션', brand: '설화수', category: '쿠션' },
    { id: 'dom-mk-3', name: '라네즈 뉴 베이스 쿠션', brand: '라네즈', category: '쿠션' },
    { id: 'dom-mk-4', name: '에스티로더 더블웨어 파운데이션', brand: '에스티로더', category: '파운데이션' },
    { id: 'dom-mk-5', name: '이니스프리 마이 팔레트', brand: '이니스프리', category: '팔레트' },
  ],
  'Hair Care': [
    { id: 'dom-hc-1', name: '라네즈 샴푸', brand: '라네즈', category: '샴푸' },
    { id: 'dom-hc-2', name: '미샤 아로마 샴푸', brand: '미샤', category: '샴푸' },
    { id: 'dom-hc-3', name: '더페이스샵 아로마 트리트먼트', brand: '더페이스샵', category: '트리트먼트' },
    { id: 'dom-hc-4', name: '이니스프리 헤어 세럼', brand: '이니스프리', category: '세럼' },
    { id: 'dom-hc-5', name: '코스알엑스 헤어 마스크', brand: '코스알엑스', category: '마스크' },
  ],
  'Body Care': [
    { id: 'dom-bc-1', name: '라네즈 바디 크림', brand: '라네즈', category: '바디크림' },
    { id: 'dom-bc-2', name: '설화수 바디 로션', brand: '설화수', category: '바디로션' },
    { id: 'dom-bc-3', name: '미샤 바디 오일', brand: '미샤', category: '바디오일' },
    { id: 'dom-bc-4', name: '이니스프리 바디 스크럽', brand: '이니스프리', category: '스크럽' },
    { id: 'dom-bc-5', name: '더페이스샵 바디 버터', brand: '더페이스샵', category: '바디크림' },
  ],
  'Mens Care': [
    { id: 'dom-mc-1', name: '라네즈 포맨 올인원', brand: '라네즈', category: '올인원' },
    { id: 'dom-mc-2', name: '미샤 포맨 클렌저', brand: '미샤', category: '클렌저' },
    { id: 'dom-mc-3', name: '이니스프리 포맨 모이스처라이저', brand: '이니스프리', category: '모이스처라이저' },
    { id: 'dom-mc-4', name: '더페이스샵 포맨 스킨케어', brand: '더페이스샵', category: '스킨케어' },
    { id: 'dom-mc-5', name: '코스알엑스 포맨 세럼', brand: '코스알엑스', category: '세럼' },
  ],
};

