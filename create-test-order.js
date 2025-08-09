// Create a test order to verify notifications
const testOrderData = {
  user_name: "Test Customer",
  user_phone: "9999999999", 
  user_email: "test@example.com",
  total_amount: 299,
  payment_method: "upi",
  shipping_address: {
    name: "Test Customer",
    streetAddress: "123 Test Street",
    city: "Test City", 
    state: "Test State",
    pincode: "123456",
    mobileNumber: "9999999999"
  },
  items: [{
    id: 1,
    name: "Test Pickle",
    price: 299,
    weight: "250g",
    quantity: 1,
    image: "test-image.jpg"
  }]
};

const response = await fetch('https://pppfbldpxqndjlgfghos.supabase.co/functions/v1/process-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ orderData: testOrderData })
});

const result = await response.json();
console.log('Test order result:', result);