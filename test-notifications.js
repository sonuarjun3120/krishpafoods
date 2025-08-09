// Test script to trigger notification processing
const response = await fetch('https://pppfbldpxqndjlgfghos.supabase.co/functions/v1/process-notifications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwcGZibGRweHFuZGpsZ2ZnaG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NDQ5NDUsImV4cCI6MjA2MTQyMDk0NX0.KBGT_6v4JhcvfEe4fqV7ScWeJHjEZEVuQw5-otrDXbk'
  }
});

const result = await response.json();
console.log('Notification processing result:', result);