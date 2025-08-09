// Test direct email sending
fetch('https://pppfbldpxqndjlgfghos.supabase.co/functions/v1/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwcGZibGRweHFuZGpsZ2ZnaG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NDQ5NDUsImV4cCI6MjA2MTQyMDk0NX0.KBGT_6v4JhcvfEe4fqV7ScWeJHjEZEVuQw5-otrDXbk'
  },
  body: JSON.stringify({
    to: 'krishpafoods@gmail.com',
    subject: 'Test Email - Krishpa Foods Order System',
    html: `
      <h2>Test Email from Krishpa Foods</h2>
      <p>This is a test to verify that email notifications are working correctly.</p>
      <p>If you receive this email, the notification system is working!</p>
      <p>Order notifications will be sent to this email address.</p>
    `
  })
})
.then(response => response.json())
.then(data => console.log('Test email result:', data))
.catch(error => console.error('Test email error:', error));