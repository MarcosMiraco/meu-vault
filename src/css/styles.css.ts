import { style, styleVariants } from '@vanilla-extract/css';

const statusConfigs = {
    apodrecido: { bg: '#1e1e1a', text: '#8f997b', accent: '#4a5d23' },
    incubacao: { bg: '#1a1e1e', text: '#7b8f99', accent: '#234a5d' },
    permanente: { bg: '#1e1a1e', text: '#997b8f', accent: '#5d234a' },
};

export const testeVisual = style({
    backgroundColor: 'purple',
    color: 'white',
    padding: '20px',
    borderRadius: '10px',
    border: '5px solid yellow', // Algo bem "cheguei" pra não ter dúvida
    fontWeight: 'bold'
});

// Iterando sobre as cores para criar as classes automaticamente
export const statusStyles = styleVariants(statusConfigs, (color) => ({
    backgroundColor: color.bg,
    color: color.text,
    borderLeft: `4px solid ${color.accent}`,
    padding: '10px',
    borderRadius: '4px',
    transition: 'transform 0.2s ease',
    ':hover': {
        transform: 'scale(1.01)'
    }
}));

export const baseCallout = style({
    fontFamily: 'Inter, sans-serif',
    marginBottom: '1rem'
});