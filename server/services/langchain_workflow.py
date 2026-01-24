"""
LangChain + LangGraph 기반 Multi-Agent 워크플로우
제품 설명 분석 → 키워드 추출 → 효과 매핑 → 조합 분석 → 트렌드 집계 → SNS 플랫폼 분석
"""

from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import BaseMessage
from typing import TypedDict, List, Dict, Any
from pymongo import MongoClient
from datetime import datetime, timedelta
import json
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB 연결
mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
mongodb_db = os.getenv("MONGODB_DATABASE", "amore")
client = MongoClient(mongodb_uri)
db = client[mongodb_db]

# Gemini API 키 (amore 폴더에서 가져온 값)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE")

# LLM 초기화 (Gemini 사용)
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.1,
    google_api_key=GEMINI_API_KEY
)

llm_advanced = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    temperature=0.2,
    google_api_key=GEMINI_API_KEY
)


# State 정의
class WorkflowState(TypedDict):
    product_descriptions: List[Dict[str, Any]]  # [{productId, description, salesRank, ...}]
    extracted_keywords: Dict[str, Dict[str, List[str]]]  # {productId: {ingredients: [], formulas: [], effects: [], mood: []}}
    mapped_effects: Dict[str, Dict[str, List[str]]]  # {productId: {keyword: [effects]}}
    combinations: List[Dict[str, Any]]  # [{combination, ingredients, formulas, effects, avgRank, ...}]
    trends: List[Dict[str, Any]]  # [{combination, score, category, signals, ...}]
    sns_stats: Dict[str, List[Dict[str, Any]]]  # {platform: [{keyword, value, change, type}]}


# Agent 1: 키워드 추출 Agent
def extract_keywords_node(state: WorkflowState) -> WorkflowState:
    """제품 설명에서 성분, 제형, 효과, Mood 키워드 추출"""
    print("🔍 Agent 1: 키워드 추출 시작...")
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an expert in cosmetic product analysis.
        Extract keywords from product descriptions and classify them into 4 categories:
        - ingredients: cosmetic ingredients (e.g., 레티놀, 히알루론산, 나이아신아마이드)
        - formulas: product forms/textures (e.g., 앰플, 크림, 세럼, 토너, 패드)
        - effects: effects/benefits (e.g., 모공 케어, 장벽 강화, 미백, 진정)
        - mood: visual/mood elements (e.g., 미니어처, 매트 텍스처, 럭셔리, 그립)
        
        Return JSON format:
        {{
            "ingredients": ["ingredient1", "ingredient2"],
            "formulas": ["formula1", "formula2"],
            "effects": ["effect1", "effect2"],
            "mood": ["mood1", "mood2"]
        }}
        
        If a category has no keywords, return empty array []."""),
        ("user", "Product description: {description}")
    ])
    
    extracted_keywords = {}
    
    for product in state["product_descriptions"]:
        product_id = product["productId"]
        description = product.get("description", "")
        
        if not description:
            extracted_keywords[product_id] = {
                "ingredients": [],
                "formulas": [],
                "effects": [],
                "mood": []
            }
            continue
        
        try:
            chain = prompt | llm
            response = chain.invoke({"description": description})
            
            # JSON 파싱
            content = response.content
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "").strip()
            elif content.startswith("```"):
                content = content.replace("```", "").strip()
            
            keywords = json.loads(content)
            extracted_keywords[product_id] = {
                "ingredients": keywords.get("ingredients", []),
                "formulas": keywords.get("formulas", []),
                "effects": keywords.get("effects", []),
                "mood": keywords.get("mood", [])
            }
            
            print(f"  ✓ {product_id}: {len(keywords.get('ingredients', []))} 성분, {len(keywords.get('formulas', []))} 제형, {len(keywords.get('effects', []))} 효과, {len(keywords.get('mood', []))} Mood")
            
        except Exception as e:
            print(f"  ✗ {product_id} 오류: {e}")
            extracted_keywords[product_id] = {
                "ingredients": [],
                "formulas": [],
                "effects": [],
                "mood": []
            }
    
    state["extracted_keywords"] = extracted_keywords
    print(f"✅ Agent 1 완료: {len(extracted_keywords)}개 제품 처리")
    return state


# Agent 2: 효과 매핑 Agent
def map_effects_node(state: WorkflowState) -> WorkflowState:
    """각 키워드별 관련 효과 추출"""
    print("🔍 Agent 2: 효과 매핑 시작...")
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an expert in cosmetic effects analysis.
        For each keyword, extract related effects mentioned in reviews or product descriptions.
        
        Return JSON format:
        {{
            "keyword1": ["effect1", "effect2"],
            "keyword2": ["effect3", "effect4"]
        }}
        
        Focus on cosmetic effects and benefits."""),
        ("user", "Keywords: {keywords}\n\nReviews: {reviews}")
    ])
    
    mapped_effects = {}
    
    for product_id, keywords_dict in state["extracted_keywords"].items():
        # 모든 키워드 수집
        all_keywords = (
            keywords_dict.get("ingredients", []) +
            keywords_dict.get("formulas", []) +
            keywords_dict.get("effects", []) +
            keywords_dict.get("mood", [])
        )
        
        if not all_keywords:
            mapped_effects[product_id] = {}
            continue
        
        # 해당 제품의 리뷰 조회
        product = next((p for p in state["product_descriptions"] if p["productId"] == product_id), None)
        if not product:
            mapped_effects[product_id] = {}
            continue
        
        reviews = db.raw_reviews.find({
            "productId": product_id
        }).limit(20)
        
        review_texts = "\n".join([r.get("content", "") for r in reviews])
        
        try:
            chain = prompt | llm_advanced
            response = chain.invoke({
                "keywords": ", ".join(all_keywords),
                "reviews": review_texts[:2000]  # 토큰 제한
            })
            
            content = response.content
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "").strip()
            elif content.startswith("```"):
                content = content.replace("```", "").strip()
            
            effects_map = json.loads(content)
            mapped_effects[product_id] = effects_map
            
            print(f"  ✓ {product_id}: {len(effects_map)}개 키워드 효과 매핑")
            
        except Exception as e:
            print(f"  ✗ {product_id} 오류: {e}")
            mapped_effects[product_id] = {}
    
    state["mapped_effects"] = mapped_effects
    print(f"✅ Agent 2 완료")
    return state


# Agent 3: 조합 분석 Agent
def analyze_combinations_node(state: WorkflowState) -> WorkflowState:
    """가장 잘 팔리는 조합 분석 (성분 + 제형 + 효과)"""
    print("🔍 Agent 3: 조합 분석 시작...")
    
    # 조합별 제품 그룹화
    combination_map = {}
    
    for product in state["product_descriptions"]:
        product_id = product["productId"]
        keywords = state["extracted_keywords"].get(product_id, {})
        
        ingredients = keywords.get("ingredients", [])
        formulas = keywords.get("formulas", [])
        effects = keywords.get("effects", [])
        
        # 조합 생성 (최대 3개씩)
        if ingredients and formulas and effects:
            # 가장 많이 언급된 조합 선택
            top_ingredient = ingredients[0] if ingredients else ""
            top_formula = formulas[0] if formulas else ""
            top_effect = effects[0] if effects else ""
            
            combination_key = f"{top_ingredient} + {top_formula} + {top_effect}"
            
            if combination_key not in combination_map:
                combination_map[combination_key] = {
                    "combination": combination_key,
                    "ingredients": ingredients,
                    "formulas": formulas,
                    "effects": effects,
                    "products": [],
                    "ranks": []
                }
            
            combination_map[combination_key]["products"].append(product)
            if product.get("salesRank"):
                combination_map[combination_key]["ranks"].append(product["salesRank"])
    
    # 조합별 통계 계산
    combinations = []
    for combo_key, combo_data in combination_map.items():
        ranks = combo_data["ranks"]
        avg_rank = sum(ranks) / len(ranks) if ranks else 1000
        
        combinations.append({
            "combination": combo_key,
            "ingredients": list(set(combo_data["ingredients"])),
            "formulas": list(set(combo_data["formulas"])),
            "effects": list(set(combo_data["effects"])),
            "avgRank": avg_rank,
            "productCount": len(combo_data["products"]),
            "totalSales": sum(p.get("salesVolume", 0) for p in combo_data["products"]),
            "synergyScore": calculate_synergy_score(combo_data)
        })
    
    # 랭킹 순으로 정렬
    combinations.sort(key=lambda x: x["avgRank"])
    
    state["combinations"] = combinations
    print(f"✅ Agent 3 완료: {len(combinations)}개 조합 분석")
    return state


# Agent 4: 트렌드 집계 Agent
def aggregate_trends_node(state: WorkflowState) -> WorkflowState:
    """트렌드 점수 계산 및 분류"""
    print("🔍 Agent 4: 트렌드 집계 시작...")
    
    trends = []
    
    for combo in state["combinations"]:
        # 신호 데이터 계산
        signals = calculate_signals(combo, state)
        
        # 트렌드 점수 계산
        score = calculate_trend_score(combo, signals)
        
        # 카테고리 분류
        category = classify_trend_category(score, combo, signals)
        
        trends.append({
            "combination": combo["combination"],
            "ingredients": combo["ingredients"],
            "formulas": combo["formulas"],
            "effects": combo["effects"],
            "avgRank": combo["avgRank"],
            "productCount": combo["productCount"],
            "score": score,
            "category": category,  # Early, Growing, Actionable
            "signals": signals
        })
    
    # 점수 순으로 정렬
    trends.sort(key=lambda x: x["score"], reverse=True)
    
    state["trends"] = trends
    print(f"✅ Agent 4 완료: {len(trends)}개 트렌드 생성")
    return state


# Agent 5: SNS 플랫폼 분석 Agent
def analyze_sns_platforms_node(state: WorkflowState) -> WorkflowState:
    """SNS 플랫폼별 키워드 순위 분석"""
    print("🔍 Agent 5: SNS 플랫폼 분석 시작...")
    
    platforms = ["Instagram", "TikTok", "YouTube", "Amazon", "Shopee", "Cosme"]
    sns_stats = {}
    
    # 모든 키워드 수집
    all_keywords = {}
    for product_id, keywords_dict in state["extracted_keywords"].items():
        for category, keywords in keywords_dict.items():
            for keyword in keywords:
                if keyword not in all_keywords:
                    all_keywords[keyword] = {
                        "keyword": keyword,
                        "type": category,
                        "counts": {}
                    }
    
    # 플랫폼별 키워드 언급 수 집계
    end_date = datetime.now()
    start_date = end_date - timedelta(weeks=8)
    
    for platform in platforms:
        platform_keywords = []
        
        for keyword, keyword_data in all_keywords.items():
            # SNS 게시물에서 키워드 언급 수 조회
            count = db.raw_sns_posts.count_documents({
                "platform": platform,
                "postedAt": {"$gte": start_date, "$lte": end_date},
                "$or": [
                    {"content": {"$regex": keyword, "$options": "i"}},
                    {"hashtags": keyword}
                ]
            })
            
            if count > 0:
                platform_keywords.append({
                    "keyword": keyword,
                    "value": min(100, count / 10),  # 1000개 = 100점
                    "change": 0,  # 전주 대비 (추후 계산)
                    "type": keyword_data["type"]
                })
        
        # 값 순으로 정렬
        platform_keywords.sort(key=lambda x: x["value"], reverse=True)
        sns_stats[platform] = platform_keywords[:10]  # 상위 10개
    
    state["sns_stats"] = sns_stats
    print(f"✅ Agent 5 완료: {len(platforms)}개 플랫폼 분석")
    return state


# Helper 함수들

def calculate_synergy_score(combo_data: Dict) -> float:
    """조합 시너지 점수 계산"""
    # 제품 수가 많을수록, 랭킹이 좋을수록 높은 점수
    product_count = len(combo_data["products"])
    avg_rank = sum(combo_data["ranks"]) / len(combo_data["ranks"]) if combo_data["ranks"] else 1000
    
    rank_score = max(0, 1 - (avg_rank - 1) / 1000)  # 1위 = 1.0, 1000위 = 0.0
    count_score = min(1, product_count / 20)  # 20개 이상 = 1.0
    
    return (rank_score * 0.7 + count_score * 0.3)


def calculate_signals(combo: Dict, state: WorkflowState) -> Dict[str, float]:
    """SNS, Retail, Review 신호 계산"""
    # 간단화: 실제로는 DB에서 집계
    return {
        "SNS": 85.0,
        "Retail": 90.0,
        "Review": 88.0
    }


def calculate_trend_score(combo: Dict, signals: Dict[str, float]) -> float:
    """트렌드 점수 계산"""
    rank_score = max(0, 100 - (combo["avgRank"] - 1) * 0.2)
    signal_score = (signals["SNS"] + signals["Retail"] + signals["Review"]) / 3
    synergy_score = combo.get("synergyScore", 0.5) * 100
    
    return rank_score * 0.4 + signal_score * 0.4 + synergy_score * 0.2


def classify_trend_category(score: float, combo: Dict, signals: Dict[str, float]) -> str:
    """트렌드 카테고리 분류"""
    if score >= 80 and combo["avgRank"] <= 20:
        return "Actionable"
    elif score >= 60 and combo["avgRank"] <= 50:
        return "Growing"
    else:
        return "Early"


# 워크플로우 구성
def create_workflow():
    workflow = StateGraph(WorkflowState)
    
    # Node 추가
    workflow.add_node("extract_keywords", extract_keywords_node)
    workflow.add_node("map_effects", map_effects_node)
    workflow.add_node("analyze_combinations", analyze_combinations_node)
    workflow.add_node("aggregate_trends", aggregate_trends_node)
    workflow.add_node("analyze_sns_platforms", analyze_sns_platforms_node)
    
    # Edge 정의
    workflow.set_entry_point("extract_keywords")
    workflow.add_edge("extract_keywords", "map_effects")
    workflow.add_edge("map_effects", "analyze_combinations")
    workflow.add_edge("analyze_combinations", "aggregate_trends")
    workflow.add_edge("aggregate_trends", "analyze_sns_platforms")
    workflow.add_edge("analyze_sns_platforms", END)
    
    return workflow.compile()


# DB 저장 함수
def save_to_db(state: WorkflowState):
    """워크플로우 결과를 DB에 저장"""
    print("💾 DB 저장 시작...")
    
    # 1. processed_keywords 저장
    for product_id, keywords_dict in state["extracted_keywords"].items():
        for category, keywords in keywords_dict.items():
            for keyword in keywords:
                effects = state["mapped_effects"].get(product_id, {}).get(keyword, [])
                
                db.processed_keywords.insert_one({
                    "keyword": keyword,
                    "keywordType": category,
                    "sourceType": "product_description",
                    "sourceId": product_id,
                    "effects": effects,
                    "extractedAt": datetime.now(),
                    "processedAt": datetime.now()
                })
    
    # 2. trends 저장
    for trend in state["trends"]:
        db.trends.replace_one(
            {"combination": trend["combination"]},
            {
                **trend,
                "calculatedAt": datetime.now(),
                "updatedAt": datetime.now()
            },
            upsert=True
        )
    
    # 3. sns_platform_stats 저장
    for platform, keywords in state["sns_stats"].items():
        db.sns_platform_stats.insert_one({
            "platform": platform,
            "country": "usa",  # 동적으로 설정 가능
            "keywords": keywords,
            "date": datetime.now(),
            "calculatedAt": datetime.now()
        })
    
    print("✅ DB 저장 완료")


# 메인 실행 함수
def run_workflow(country="usa", category="Skincare", weeks=8):
    """워크플로우 실행"""
    print(f"🚀 워크플로우 시작: {country}/{category} ({weeks}주)")
    
    # 최근 8주 데이터 조회
    end_date = datetime.now()
    start_date = end_date - timedelta(weeks=weeks)
    
    products = list(db.raw_retail_sales.find({
        "country": country,
        "category": category,
        "date": {"$gte": start_date, "$lte": end_date}
    }))
    
    print(f"📦 {len(products)}개 제품 발견")
    
    # 초기 State 생성
    initial_state: WorkflowState = {
        "product_descriptions": [
            {
                "productId": p["productId"],
                "description": p.get("description", ""),
                "salesRank": p.get("salesRank", 1000),
                "salesVolume": p.get("salesVolume", 0),
                "brand": p.get("brand", ""),
                "productName": p.get("productName", "")
            }
            for p in products
        ],
        "extracted_keywords": {},
        "mapped_effects": {},
        "combinations": [],
        "trends": [],
        "sns_stats": {}
    }
    
    # 워크플로우 실행
    app = create_workflow()
    final_state = app.invoke(initial_state)
    
    # DB 저장
    save_to_db(final_state)
    
    print("🎉 워크플로우 완료!")
    return final_state


if __name__ == "__main__":
    import sys
    
    # 명령줄 인자 파싱
    country = sys.argv[1] if len(sys.argv) > 1 else "usa"
    category = sys.argv[2] if len(sys.argv) > 2 else "Skincare"
    weeks = int(sys.argv[3]) if len(sys.argv) > 3 else 8
    
    # 워크플로우 실행
    result = run_workflow(country=country, category=category, weeks=weeks)
    print(f"\n📊 결과 요약:")
    print(f"  - 추출된 키워드: {len(result['extracted_keywords'])}개 제품")
    print(f"  - 분석된 조합: {len(result['combinations'])}개")
    print(f"  - 트렌드: {len(result['trends'])}개")
    print(f"  - SNS 플랫폼: {len(result['sns_stats'])}개")

