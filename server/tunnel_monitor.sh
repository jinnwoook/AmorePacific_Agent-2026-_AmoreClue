#!/bin/bash
# 터널 모니터링 - 1분마다 둘 다 체크, 끊긴 것만 복구

LOG="/srv2/jinwook/amore_clue/server/tunnel_monitor.log"
TUNNEL_LOG="/srv2/jinwook/amore_clue/tunnel_log.txt"

while true; do
    URL_5000=$(grep -o "[a-z0-9]*\.lhr\.life" /tmp/tunnel_5000.log 2>/dev/null | tail -1)
    URL_5002=$(grep -o "[a-z0-9]*\.lhr\.life" /tmp/tunnel_5002.log 2>/dev/null | tail -1)
    CHECK_TIME=$(date "+%Y-%m-%d %H:%M:%S")
    
    HEALTH_5000=0
    HEALTH_5002=0
    NEED_DEPLOY=0
    
    if [ -n "$URL_5000" ]; then
        HEALTH_5000=$(curl -s --max-time 5 "https://$URL_5000/api/health" 2>/dev/null | grep -c "ok")
    fi
    if [ -n "$URL_5002" ]; then
        HEALTH_5002=$(curl -s --max-time 5 "https://$URL_5002/api/health" 2>/dev/null | grep -c "ok")
    fi
    
    # 상태 출력
    STATUS_5000="✅"
    STATUS_5002="✅"
    [ "$HEALTH_5000" -eq 0 ] && STATUS_5000="❌"
    [ "$HEALTH_5002" -eq 0 ] && STATUS_5002="❌"
    
    echo "[$CHECK_TIME] 5000:$STATUS_5000 ($URL_5000) / 5002:$STATUS_5002 ($URL_5002)" >> $TUNNEL_LOG
    
    # 5000 끊김 - 5000만 복구
    if [ "$HEALTH_5000" -eq 0 ]; then
        echo "[$CHECK_TIME] 5000 복구 중..." >> $TUNNEL_LOG
        pkill -f "localhost:5000" 2>/dev/null
        sleep 1
        nohup ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R 80:localhost:5000 localhost.run > /tmp/tunnel_5000.log 2>&1 &
        sleep 10
        URL_5000=$(grep -o "[a-z0-9]*\.lhr\.life" /tmp/tunnel_5000.log | tail -1)
        echo "[$(date "+%Y-%m-%d %H:%M:%S")] 5000 복구 완료: $URL_5000" >> $TUNNEL_LOG
        NEED_DEPLOY=1
    fi
    
    # 5002 끊김 - 5002만 복구
    if [ "$HEALTH_5002" -eq 0 ]; then
        echo "[$CHECK_TIME] 5002 복구 중..." >> $TUNNEL_LOG
        pkill -f "localhost:5002" 2>/dev/null
        sleep 1
        nohup ssh -o StrictHostKeyChecking=no -o IdentitiesOnly=yes -R 80:localhost:5002 nokey@localhost.run > /tmp/tunnel_5002.log 2>&1 &
        sleep 10
        URL_5002=$(grep -o "[a-z0-9]*\.lhr\.life" /tmp/tunnel_5002.log | tail -1)
        echo "[$(date "+%Y-%m-%d %H:%M:%S")] 5002 복구 완료: $URL_5002" >> $TUNNEL_LOG
        NEED_DEPLOY=1
    fi
    
    # 재배포 (하나라도 복구했으면)
    if [ "$NEED_DEPLOY" -eq 1 ] && [ -n "$URL_5000" ] && [ -n "$URL_5002" ]; then
        cat > /srv2/jinwook/amore_clue/.env.production << ENVEOF
# Production environment variables for Vite build
VITE_API_BASE_URL=https://${URL_5000}/api
VITE_KBEAUTY_API_BASE_URL=https://${URL_5002}/api
ENVEOF
        cd /srv2/jinwook/amore_clue
        npm run build > /dev/null 2>&1
        firebase deploy --only hosting --project amore-fc103 > /dev/null 2>&1
        echo "[$(date "+%Y-%m-%d %H:%M:%S")] 🚀 재배포 완료" >> $TUNNEL_LOG
        echo "===" >> $TUNNEL_LOG
    fi
    
    sleep 60
done
