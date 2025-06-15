import React from 'react';

function AppDebug() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1a1a1a', 
      color: 'white', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#4CAF50' }}>🔧 Vehicle Tracker - Debug Mode</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>✅ Basic Rendering Test</h2>
        <p>If you can see this text, React is working correctly.</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>🔍 Environment Check</h2>
        <div style={{ backgroundColor: '#2a2a2a', padding: '10px', borderRadius: '5px' }}>
          <p><strong>Google Maps API Key:</strong> {import.meta.env.VITE_GMAPS_API_KEY ? '✅ Set' : '❌ Missing'}</p>
          <p><strong>GAS Endpoint:</strong> {import.meta.env.VITE_GAS_ENDPOINT ? '✅ Set' : '❌ Missing'}</p>
          <p><strong>Node Environment:</strong> {import.meta.env.MODE}</p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>📝 Debug Information</h2>
        <div style={{ backgroundColor: '#2a2a2a', padding: '10px', borderRadius: '5px', fontSize: '12px' }}>
          <p>Time: {new Date().toLocaleString()}</p>
          <p>User Agent: {navigator.userAgent}</p>
          <p>Window Size: {window.innerWidth} x {window.innerHeight}</p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>🧪 Component Test</h2>
        <button 
          onClick={() => console.log('Button clicked - check browser console')}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Console Log
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>⚠️ Next Steps</h2>
        <ol>
          <li>Open browser console (F12) and check for errors</li>
          <li>Verify environment variables are properly set</li>
          <li>Test API connectivity</li>
          <li>Enable full app components gradually</li>
        </ol>
      </div>
    </div>
  );
}

export default AppDebug;