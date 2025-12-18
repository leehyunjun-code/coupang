const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { getRecentOrders } = require('../utils/coupang');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.get('/recent', async (req, res) => {
  try {
    const { userId } = req.query;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
    }

    // 오늘 날짜만 조회
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}${month}${day}`; // 예: 20241219

    const orders = await getRecentOrders(
      user.vendor_id,
      user.access_key,
      user.secret_key,
      todayDate,  // 오늘만
      todayDate   // 오늘만
    );

    res.json({ orders });
  } catch (error) {
    console.error('주문 조회 오류:', error);
    res.status(500).json({ error: '주문 조회 실패', details: error.message });
  }
});

module.exports = router;