import { getTheme } from '../Theme';

const theme = getTheme();
const componentTheme = theme.BottomNavigation || theme;

export const backgroundColor = componentTheme.background;
export const textColor = componentTheme.onBackground;
export const selectColor = componentTheme.brand;
