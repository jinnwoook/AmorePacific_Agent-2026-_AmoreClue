/**
 * 배치 프로세서 - 하루에 한 번 LLM Agent 워크플로우 실행
 * 새로운 로우 데이터가 있을 때만 처리
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 마지막 처리 시간 확인
 */
async function getLastProcessedTime(db) {
  try {
    const lastRun = await db.collection('batch_job_logs').findOne(
      { jobType: 'llm_workflow' },
      { sort: { completedAt: -1 } }
    );
    return lastRun ? lastRun.completedAt : null;
  } catch (error) {
    console.error('마지막 처리 시간 조회 오류:', error);
    return null;
  }
}

/**
 * 새로운 데이터가 있는지 확인
 */
async function hasNewData(db, lastProcessedTime) {
  try {
    if (!lastProcessedTime) {
      // 처음 실행인 경우
      const count = await db.collection('raw_retail_sales').countDocuments();
      return count > 0;
    }

    // 마지막 처리 이후 새로운 데이터 확인
    const newSalesCount = await db.collection('raw_retail_sales').countDocuments({
      date: { $gt: lastProcessedTime }
    });

    const newReviewsCount = await db.collection('raw_reviews').countDocuments({
      postedAt: { $gt: lastProcessedTime }
    });

    const newSnsCount = await db.collection('raw_sns_posts').countDocuments({
      postedAt: { $gt: lastProcessedTime }
    });

    return newSalesCount > 0 || newReviewsCount > 0 || newSnsCount > 0;
  } catch (error) {
    console.error('새 데이터 확인 오류:', error);
    return false;
  }
}

/**
 * 배치 작업 실행
 */
async function runBatchJob(country = 'usa', category = 'Skincare', weeks = 8) {
  const startTime = new Date();
  console.log(`\n🔄 배치 작업 시작: ${startTime.toISOString()}`);
  console.log(`   국가: ${country}, 카테고리: ${category}, 기간: ${weeks}주`);

  try {
    // MongoDB 연결
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DATABASE
    });
    const db = conn.connection.db;

    // 마지막 처리 시간 확인
    const lastProcessedTime = await getLastProcessedTime(db);
    console.log(`   마지막 처리 시간: ${lastProcessedTime ? lastProcessedTime.toISOString() : '없음 (첫 실행)'}`);

    // 새로운 데이터 확인
    const hasNew = await hasNewData(db, lastProcessedTime);
    
    if (!hasNew && lastProcessedTime) {
      console.log('   ✅ 새로운 데이터 없음 - 처리 건너뜀');
      
      // 로그만 기록
      await db.collection('batch_job_logs').insertOne({
        jobType: 'llm_workflow',
        status: 'skipped',
        reason: 'no_new_data',
        startedAt: startTime,
        completedAt: new Date(),
        duration: Date.now() - startTime.getTime()
      });

      await conn.connection.close();
      return { success: true, skipped: true, reason: 'no_new_data' };
    }

    console.log('   📊 새로운 데이터 발견 - 워크플로우 실행');

    // Python 워크플로우 실행
    const pythonScript = path.join(__dirname, 'gemini_agents.py');
    const pythonProcess = spawn('python3', [
      pythonScript,
      country,
      category,
      weeks.toString()
    ], {
      cwd: path.join(__dirname, '..'),
      env: {
        ...process.env,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE',
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
        MONGODB_DATABASE: process.env.MONGODB_DATABASE || 'amore'
      }
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(text.trim());
    });

    pythonProcess.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      console.error(text.trim());
    });

    return new Promise((resolve, reject) => {
      pythonProcess.on('close', async (code) => {
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();

        if (code !== 0) {
          console.error(`❌ 배치 작업 실패 (코드: ${code})`);
          
          await db.collection('batch_job_logs').insertOne({
            jobType: 'llm_workflow',
            status: 'failed',
            error: errorOutput,
            startedAt: startTime,
            completedAt: endTime,
            duration
          });

        await conn.connection.close();
        reject(new Error(`워크플로우 실행 실패: ${errorOutput}`));
        return;
      }

      console.log(`✅ 배치 작업 완료: ${(duration / 1000).toFixed(2)}초`);

      // 성공 로그 기록
      await db.collection('batch_job_logs').insertOne({
        jobType: 'llm_workflow',
        status: 'completed',
        country,
        category,
        weeks,
        startedAt: startTime,
        completedAt: endTime,
        duration,
        output: output.substring(0, 1000) // 최대 1000자만 저장
      });

      await conn.connection.close();
        resolve({ success: true, duration, output });
      });
    });

  } catch (error) {
    console.error('❌ 배치 작업 오류:', error);
    throw error;
  }
}

/**
 * 스케줄러로 실행 (하루에 한 번)
 */
export async function scheduleDailyBatch() {
  try {
    const nodeCron = await import('node-cron');
    const cron = nodeCron.default || nodeCron;

    // 매일 새벽 2시에 실행
    cron.schedule('0 2 * * *', async () => {
      console.log('\n⏰ 스케줄된 배치 작업 시작');
      try {
        await runBatchJob('usa', 'Skincare', 8);
      } catch (error) {
        console.error('스케줄된 배치 작업 오류:', error);
      }
    }, {
      scheduled: true,
      timezone: 'Asia/Seoul'
    });

    console.log('✅ 일일 배치 스케줄러 등록 완료 (매일 새벽 2시)');
  } catch (error) {
    console.warn('⚠️ node-cron 로드 실패:', error.message);
  }
}

/**
 * 수동 실행 (테스트용)
 */
export async function runManualBatch(country, category, weeks) {
  return await runBatchJob(country, category, weeks);
}

// 직접 실행 시
if (import.meta.url === `file://${process.argv[1]}`) {
  const country = process.argv[2] || 'usa';
  const category = process.argv[3] || 'Skincare';
  const weeks = parseInt(process.argv[4]) || 8;

  runBatchJob(country, category, weeks)
    .then(result => {
      console.log('✅ 배치 작업 완료:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ 배치 작업 실패:', error);
      process.exit(1);
    });
}

export default { runBatchJob, scheduleDailyBatch, runManualBatch };

