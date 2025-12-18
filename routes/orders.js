const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { getOrders } = require('../utils/coupang');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

router.get('/recent', async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId 필요' });
    }
    
    const { data: user, error: dbError } = await supabase
      .from('users')
      .select('vendor_id, access_key, secret_key')
      .eq('id', userId)
      .single();
    
    if (dbError) {
      console.error('DB 에러:', dbError);
      return res.status(500).json({ error: dbError.message });
    }
    
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
    }
    
    const orders = await getOrders(user.vendor_id, user.access_key, user.secret_key);
    res.json({ orders });
    
  } catch (error) {
    console.error('주문 조회 에러:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;