export const Colors = {
  primary: '#835CFF',
  secondary: '#28E2FF', 
  accent: '#FF6B9D',
  
  gradients: {
    main: ['#E8D5FF', '#B8E6FF', '#FFE4D6'] as const,
    card: ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)'] as const,
    button: ['#835CFF', '#28E2FF'] as const,
  },
  
  glass: {
    background: 'rgba(255, 255, 255, 0.15)',
    border: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(131, 92, 255, 0.1)',
  },
  
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    light: '#FFFFFF',
    muted: '#999999',
  },
  
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
  }
};

export default Colors;