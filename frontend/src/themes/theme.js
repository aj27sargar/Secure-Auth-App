import { createTheme } from '@mui/material';

export const appTheme = createTheme({
  palette: {
    primary: { main: '#673ab7' },
    secondary: { main: '#f50057' },
    background: { default: '#f4f5f7', paper: '#ffffff' },
    text: { primary: '#333333', secondary: '#555555' }
  },
  typography: { 
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', 
    h4: { fontWeight: 700 }, 
    h5: { fontWeight: 600 } 
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }
        }
      }
    },
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 'bold', padding: '12px 24px' } }
    }
  }
});
