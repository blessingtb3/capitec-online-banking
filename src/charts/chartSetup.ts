import { ArcElement, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } from 'chart.js';
import { colors, fonts } from '../theme/tokens';

/**
 * Registers only the Chart.js pieces this app uses (keeps the bundle small)
 * and applies the design tokens as chart defaults. Imported by chart components.
 */
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

Chart.defaults.font.family = fonts.body;
Chart.defaults.color = colors.textMuted;
Chart.defaults.borderColor = colors.border;
Chart.defaults.plugins.tooltip.backgroundColor = colors.text;
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
