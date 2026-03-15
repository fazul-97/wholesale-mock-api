// Metro Wholesale — Mock API for demo purposes
const http = require('http');

const PRODUCTS = [
  { id:'p1', name:'Unga Pembe 2kg', sku:'UNGA-2KG', unit:'bag', price:180, salePrice:165, stockStatus:'IN_STOCK', category:'Flour & Grains', imageUrl:null },
  { id:'p2', name:'Cooking Oil 5L', sku:'OIL-5L', unit:'bottle', price:920, salePrice:null, stockStatus:'IN_STOCK', category:'Oils & Fats', imageUrl:null },
  { id:'p3', name:'Maize Flour 2kg', sku:'MAIZE-2KG', unit:'bag', price:120, salePrice:null, stockStatus:'LIMITED', category:'Flour & Grains', imageUrl:null },
  { id:'p4', name:'Sugar 1kg', sku:'SUGAR-1KG', unit:'pack', price:160, salePrice:150, stockStatus:'IN_STOCK', category:'Household', imageUrl:null },
  { id:'p5', name:'Milk 500ml', sku:'MILK-500ML', unit:'packet', price:55, salePrice:null, stockStatus:'IN_STOCK', category:'Dairy', imageUrl:null },
  { id:'p6', name:'Omo 1kg', sku:'OMO-1KG', unit:'pack', price:340, salePrice:null, stockStatus:'IN_STOCK', category:'Cleaning', imageUrl:null },
  { id:'p7', name:'Soda Water 6pack', sku:'SODA-6PK', unit:'pack', price:420, salePrice:399, stockStatus:'IN_STOCK', category:'Beverages', imageUrl:null },
  { id:'p8', name:'Bread Sliced', sku:'BREAD-SL', unit:'loaf', price:65, salePrice:null, stockStatus:'OUT_OF_STOCK', category:'Household', imageUrl:null },
];

const ORDERS = [
  {
    id:'o1', orderNumber:'MW-00001', status:'DELIVERED', total:2340, subtotal:2340,
    discountAmount:0, loyaltyDiscount:0, loyaltyPointsEarned:234,
    createdAt:new Date(Date.now()-86400000*3).toISOString(),
    updatedAt:new Date().toISOString(), note:null, discountCode:null,
    customer:{name:'John Kamau',phone:'+254711000001',loyaltyPoints:450},
    address:{label:'Home',line1:'123 Ngong Road',city:'Nairobi'},
    items:[
      {id:'oi1',product:{id:'p1',name:'Unga Pembe 2kg',unit:'bag',price:180,salePrice:165,stockStatus:'IN_STOCK',imageUrl:null},requestedQty:5,confirmedQty:5,price:180},
      {id:'oi2',product:{id:'p2',name:'Cooking Oil 5L',unit:'bottle',price:920,salePrice:null,stockStatus:'IN_STOCK',imageUrl:null},requestedQty:2,confirmedQty:2,price:920}
    ]
  },
  {
    id:'o2', orderNumber:'MW-00002', status:'PENDING', total:1580, subtotal:1580,
    discountAmount:0, loyaltyDiscount:0, loyaltyPointsEarned:0,
    createdAt:new Date(Date.now()-3600000).toISOString(),
    updatedAt:new Date().toISOString(), note:'Please deliver in the morning', discountCode:null,
    customer:{name:'Mary Wanjiru',phone:'+254722000002',loyaltyPoints:0},
    address:{label:'Office',line1:'Westlands Business Park',city:'Nairobi'},
    items:[
      {id:'oi3',product:{id:'p4',name:'Sugar 1kg',unit:'pack',price:150,salePrice:150,stockStatus:'IN_STOCK',imageUrl:null},requestedQty:4,confirmedQty:null,price:150},
      {id:'oi4',product:{id:'p5',name:'Milk 500ml',unit:'packet',price:55,salePrice:null,stockStatus:'IN_STOCK',imageUrl:null},requestedQty:12,confirmedQty:null,price:55}
    ]
  },
  {
    id:'o3', orderNumber:'MW-00003', status:'MODIFIED', total:940, subtotal:1000,
    discountAmount:0, loyaltyDiscount:0, loyaltyPointsEarned:0,
    createdAt:new Date(Date.now()-7200000).toISOString(),
    updatedAt:new Date().toISOString(), note:null, discountCode:null,
    customer:{name:'Peter Omondi',phone:'+254733000003',loyaltyPoints:120},
    address:{label:'Home',line1:'45 Kiambu Road',city:'Kiambu'},
    items:[
      {id:'oi5',product:{id:'p6',name:'Omo 1kg',unit:'pack',price:340,salePrice:null,stockStatus:'IN_STOCK',imageUrl:null},requestedQty:3,confirmedQty:2,price:340},
      {id:'oi6',product:{id:'p7',name:'Soda Water 6pack',unit:'pack',price:399,salePrice:399,stockStatus:'IN_STOCK',imageUrl:null},requestedQty:1,confirmedQty:1,price:399}
    ]
  },
];

const DISCOUNTS = [
  { id:'d1', code:'WELCOME10', description:'10% off your first order', discountType:'PERCENTAGE', discountValue:10, minOrderAmount:1000, maxUsage:100, usageCount:23, isActive:true, expiresAt:null },
  { id:'d2', code:'SAVE200', description:'KES 200 off orders above 2000', discountType:'FIXED', discountValue:200, minOrderAmount:2000, maxUsage:50, usageCount:8, isActive:true, expiresAt:'2026-12-31' },
  { id:'d3', code:'SUMMER15', description:'Summer special 15% off', discountType:'PERCENTAGE', discountValue:15, minOrderAmount:500, maxUsage:30, usageCount:30, isActive:false, expiresAt:'2026-03-31' },
];

const MOCK_TOKEN = 'mock_access_token_store_owner';
const MOCK_CUSTOMER_TOKEN = 'mock_access_token_customer';

function json(res, data, status) {
  status = status || 200;
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

const routes = {
  'POST /api/auth/store/login': function(req, res, body) {
    if (body.email === 'owner@metrowholesale.co.ke' && body.password === 'store1234') {
      json(res, { success:true, data:{ user:{id:'owner1',role:'STORE_OWNER',email:body.email}, accessToken:MOCK_TOKEN, refreshToken:'refresh_mock' }});
    } else {
      json(res, { success:false, message:'Invalid credentials' }, 401);
    }
  },
  'POST /api/auth/request-otp': function(req, res) {
    json(res, { success:true, message:'OTP sent! Use code: 123456 for demo' });
  },
  'POST /api/auth/verify-otp': function(req, res, body) {
    json(res, { success:true, data:{ user:{id:'cust1',role:'CUSTOMER',phone:body.phone||'+254711000001',name:'Demo Customer'}, accessToken:MOCK_CUSTOMER_TOKEN, refreshToken:'refresh_mock' }});
  },
  'POST /api/auth/refresh': function(req, res) {
    json(res, { success:true, data:{ accessToken:MOCK_TOKEN, refreshToken:'refresh_mock' }});
  },
  'POST /api/auth/logout': function(req, res) { json(res, { success:true }); },
  'GET /api/products': function(req, res) { json(res, { success:true, data:PRODUCTS, total:PRODUCTS.length }); },
  'POST /api/products': function(req, res, body) { const p={id:'p_new',...body}; PRODUCTS.push(p); json(res,{success:true,data:p}); },
  'GET /api/products/store/all': function(req, res) { json(res, { success:true, data:PRODUCTS, total:PRODUCTS.length }); },
  'GET /api/customers/me': function(req, res) { json(res, { success:true, data:{ id:'cust1', name:'Demo Customer', phone:'+254711000001', loyaltyPoints:450 }}); },
  'GET /api/customers/me/addresses': function(req, res) { json(res, { success:true, data:[{ id:'addr1', label:'Home', line1:'123 Ngong Road', city:'Nairobi', isDefault:true }]}); },
  'PUT /api/customers/me': function(req, res, body) { json(res, { success:true, data:{ id:'cust1', name:body.name||'Customer', phone:'+254711000001', loyaltyPoints:450 }}); },
  'POST /api/customers/me/addresses': function(req, res, body) { json(res, { success:true, data:{ id:'addr_new', ...body, isDefault:false }}); },
  'GET /api/customers/me/frequent': function(req, res) { json(res, { success:true, data:PRODUCTS.slice(0,4) }); },
  'GET /api/customers/me/recommended': function(req, res) { json(res, { success:true, data:PRODUCTS.slice(0,3) }); },
  'GET /api/orders': function(req, res) { json(res, { success:true, data:ORDERS, total:ORDERS.length }); },
  'GET /api/orders/last': function(req, res) { json(res, { success:true, data:ORDERS[0] }); },
  'POST /api/orders': function(req, res) { json(res, { success:true, data:{ id:'o_new', orderNumber:'MW-00099', status:'PENDING', total:999, createdAt:new Date().toISOString() }}); },
  'POST /api/orders/validate-discount': function(req, res, body) {
    var d = DISCOUNTS.find(function(x) { return x.code === body.code && x.isActive; });
    if (d) {
      var amt = d.discountType === 'PERCENTAGE' ? Math.floor(body.orderTotal * d.discountValue / 100) : d.discountValue;
      json(res, { success:true, data:{ valid:true, discountAmount:amt, message:d.code+' applied!' }});
    } else {
      json(res, { success:true, data:{ valid:false, discountAmount:0, message:'Invalid or expired code' }});
    }
  },
  'GET /api/orders/store/all': function(req, res) { json(res, { success:true, data:ORDERS, total:ORDERS.length, pages:1, totals:{ PENDING:1, CONFIRMED:0, MODIFIED:1, DISPATCHED:0, DELIVERED:1 }}); },
  'GET /api/store/discounts': function(req, res) { json(res, { success:true, data:DISCOUNTS }); },
  'POST /api/store/discounts': function(req, res, body) { var d={id:'d_new',...body,usageCount:0,isActive:true}; DISCOUNTS.push(d); json(res, { success:true, data:d }); },
  'PUT /api/store/loyalty/config': function(req, res, body) { json(res, { success:true, data:body }); },
  'GET /api/store/loyalty/config': function(req, res) { json(res, { success:true, data:{ loyaltyEarnRate:1, loyaltyRedeemValue:0.01 }}); },
};

function matchDynamic(method, path) {
  var m;

  m = path.match(/^\/api\/orders\/store\/([^/]+)\/confirm$/);
  if (m && method === 'PUT') return function(req, res) { json(res, { success:true, data:{...ORDERS[1], status:'CONFIRMED'} }); };

  m = path.match(/^\/api\/orders\/store\/([^/]+)\/status$/);
  if (m && method === 'PUT') return function(req, res, body) { json(res, { success:true, data:{ status:body.status }}); };

  m = path.match(/^\/api\/orders\/store\/([^/]+)\/notes$/);
  if (m && method === 'POST') return function(req, res) { json(res, { success:true }); };

  m = path.match(/^\/api\/orders\/store\/([^/]+)$/);
  if (m && method === 'GET') {
    var id = m[1];
    return function(req, res) {
      var o = ORDERS.find(function(x) { return x.id === id; }) || ORDERS[1];
      json(res, { success:true, data:o });
    };
  }

  m = path.match(/^\/api\/orders\/([^/]+)$/);
  if (m && method === 'GET') {
    var oid = m[1];
    return function(req, res) {
      var o = ORDERS.find(function(x) { return x.id === oid; }) || ORDERS[0];
      json(res, { success:true, data:o });
    };
  }

  m = path.match(/^\/api\/products\/([^/]+)\/stock$/);
  if (m && method === 'PATCH') return function(req, res, body) { json(res, { success:true, data:{ stockStatus:body.stockStatus }}); };

  m = path.match(/^\/api\/products\/([^/]+)\/image$/);
  if (m && method === 'POST') return function(req, res) { json(res, { success:true, data:{ imageUrl:'https://placehold.co/150' }}); };

  m = path.match(/^\/api\/products\/([^/]+)$/);
  if (m && (method === 'PUT' || method === 'PATCH')) return function(req, res, body) { json(res, { success:true, data:body }); };
  if (m && method === 'GET') {
    var pid = m[1];
    return function(req, res) {
      var p = PRODUCTS.find(function(x) { return x.id === pid; }) || PRODUCTS[0];
      json(res, { success:true, data:p });
    };
  }

  m = path.match(/^\/api\/store\/discounts\/([^/]+)$/);
  if (m && method === 'PATCH') return function(req, res, body) { json(res, { success:true, data:body }); };

  m = path.match(/^\/api\/customers\/me\/addresses\/([^/]+)$/);
  if (m && method === 'PATCH') return function(req, res) { json(res, { success:true }); };
  if (m && method === 'DELETE') return function(req, res) { json(res, { success:true }); };

  return null;
}

var server = http.createServer(function(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    });
    return res.end();
  }

  var url = req.url.split('?')[0];
  var body = '';
  req.on('data', function(d) { body += d; });
  req.on('end', function() {
    var parsed = {};
    try { if (body) parsed = JSON.parse(body); } catch(e) {}
    var key = req.method + ' ' + url;
    var handler = routes[key] || matchDynamic(req.method, url);
    if (handler) {
      console.log('[MOCK] ' + req.method + ' ' + url);
      handler(req, res, parsed);
    } else {
      console.log('[MOCK 404] ' + req.method + ' ' + url);
      json(res, { success:false, message:'Not found: ' + key }, 404);
    }
  });
});

var PORT = process.env.PORT || 4000;
server.listen(PORT, function() {
  console.log('[Mock API] Running on port ' + PORT + ' — Ready for demo!');
  console.log('[Mock API] Store login: owner@metrowholesale.co.ke / store1234');
  console.log('[Mock API] Customer OTP: any 6-digit code works');
});
