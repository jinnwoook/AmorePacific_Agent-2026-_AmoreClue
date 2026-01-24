/**
 * LangChain + LangGraph 워크플로우 실행 API
 */

import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/**
 * 워크플로우 실행 (리더보드 재구성)
 * POST /api/workflow/run
 */
router.post('/run', async (req, res) => {
  try {
    const { country = 'usa', category = 'Skincare', weeks = 8 } = req.body;
    
    console.log(`🔄 워크플로우 실행 시작: ${country}/${category} (${weeks}주)`);
    
    // Python 워크플로우 실행 (Gemini 버전)
    const pythonScript = path.join(__dirname, '../services/gemini_agents.py');
    const pythonProcess = spawn('python3', [pythonScript, country, category, weeks.toString()], {
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
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          error: '워크플로우 실행 실패',
          code,
          details: errorOutput,
          output: output
        });
      }
      
      res.json({
        success: true,
        country,
        category,
        weeks,
        message: '워크플로우 실행 완료',
        output: output
      });
    });
    
  } catch (error) {
    console.error('워크플로우 실행 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

