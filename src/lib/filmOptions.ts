export const FILM_OPTIONS = {
  premium: {
    value: 'Black Armor',
    label: 'Black Armor',
    details: ['Premium option', 'Better heat rejection', 'Higher price'],
  },
  budget: {
    value: 'CC Extreme Nanocarbon',
    label: 'CC Extreme Nanocarbon',
    details: ['Budget-friendly option', 'Lower price'],
  },
} as const;

export const FILM_DROPDOWN_OPTIONS = [FILM_OPTIONS.premium, FILM_OPTIONS.budget] as const;

export const FILM_LOOKUP = {
  [FILM_OPTIONS.budget.value]: FILM_OPTIONS.budget,
  [FILM_OPTIONS.premium.value]: FILM_OPTIONS.premium,
} as const;

export type FilmSelection = {
  tintType: string;
  tintDetail: string;
};

export function isFilmSelectionComplete(selection: FilmSelection): boolean {
  return Boolean(selection.tintType && selection.tintDetail);
}

export function formatFilmSelection(selection: FilmSelection): string {
  if (!isFilmSelectionComplete(selection)) return '';
  return `${selection.tintType} — ${selection.tintDetail}`;
}
