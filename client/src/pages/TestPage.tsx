
import React from 'react';

const TestPage = () => {
  console.log("TestPage está sendo renderizada");
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: 'black', fontSize: '32px', marginBottom: '16px' }}>
        Blog CriativeIA - Teste
      </h1>
      <p style={{ color: '#666', fontSize: '18px' }}>
        Se você vê esta mensagem, o preview está funcionando!
      </p>
      <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '24px', color: '#1976d2' }}>
          ✅ Preview funcionando corretamente
        </h2>
        <p style={{ marginTop: '8px', color: '#555' }}>
          Data: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default TestPage;
