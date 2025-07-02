import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Paper } from '@mui/material';
import { appTheme } from './themes/theme';
import MainLayout from './components/layouts/MainLayout';
import GenerateForm from './components/GenerateForm';
import ValidateForm from './components/ValidateForm';

function App() {
  const [productKey, setProductKey] = useState('');

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <MainLayout>
        <Paper sx={{ width: '50%', flex: 1 }}>
          <GenerateForm onKeyGenerated={setProductKey} />
        </Paper>
        <Paper sx={{ width: '50%', flex: 1 }}>
          <ValidateForm productKey={productKey} />
        </Paper>
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;
