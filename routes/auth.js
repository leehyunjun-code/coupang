const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// 회원가입
router.post('/register', async (req, res) => {
  const { username, password, name, vendor_id, access_key, secret_key } = req.body;

  // 비밀번호 해시
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  const { data, error } = await supabase
    .from('users')
    .insert([{ 
      username, 
      password: hashedPassword, 
      name, 
      vendor_id, 
      access_key, 
      secret_key 
    }])
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ success: true, message: '회원가입 완료!' });
});

// 아이디 중복 체크
router.post('/check-username', async (req, res) => {
  const { username } = req.body;

  const { data } = await supabase
    .from('users')
    .select('username')
    .eq('username', username)
    .single();

  res.json({ available: !data });
});

// 로그인
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', hashedPassword)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: '아이디 또는 비밀번호가 틀립니다.' });
  }

  res.json({ 
    success: true, 
    user: { 
      id: data.id, 
      username: data.username, 
      name: data.name 
    } 
  });
});

module.exports = router;