/** Theme change event detail from shell */
export interface ThemeChangeDetail {
  isDark: boolean;
}

export interface ThemeChangeEvent extends Event {
  detail: ThemeChangeDetail;
}
