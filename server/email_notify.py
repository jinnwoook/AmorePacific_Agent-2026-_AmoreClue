"""
이메일 알림 모듈 - LLM 서버 요청 시 알림 전송
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import threading
import sys

# Gmail 설정
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "royaljin831@gmail.com"
SENDER_PASSWORD = "dxurneswemhigozd"
RECIPIENT_EMAIL = "royaljin831@gmail.com"
LOG_FILE = "/srv2/jinwook/amore_clue/server/email_notify.log"

def log(msg):
    """로그 파일에 기록"""
    try:
        with open(LOG_FILE, "a") as f:
            f.write(f"[{datetime.now()}] {msg}\n")
        print(msg, flush=True)
        sys.stdout.flush()
    except:
        pass

def send_notification(endpoint: str, gpu_id: str, details: str = ""):
    """비동기로 이메일 알림 전송"""
    def _send():
        try:
            now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            log(f"알림 시작: {endpoint} / {gpu_id}")

            msg = MIMEMultipart()
            msg['From'] = SENDER_EMAIL
            msg['To'] = RECIPIENT_EMAIL
            msg['Subject'] = f"🖥️ AMORE CLUE AI 분석 요청 - {endpoint}"

            body = f"""
AMORE CLUE AI 분석 요청 알림

⏰ 시간: {now}
🎯 엔드포인트: {endpoint}
🖥️ GPU: {gpu_id}
📝 상세: {details if details else 'N/A'}

---
이 알림은 대시보드에서 AI 분석 기능이 사용될 때 자동 전송됩니다.
            """

            msg.attach(MIMEText(body, 'plain', 'utf-8'))

            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, msg.as_string())
            server.quit()
            log(f"📧 이메일 알림 전송 완료: {endpoint}")
        except Exception as e:
            log(f"⚠️ 이메일 알림 실패: {e}")

    # 비동기로 전송 (API 응답 지연 방지)
    thread = threading.Thread(target=_send)
    thread.daemon = True
    thread.start()

if __name__ == "__main__":
    # 테스트
    send_notification("test-endpoint", "cuda:0", "테스트 알림입니다")
    import time
    time.sleep(5)
    print("테스트 완료")
