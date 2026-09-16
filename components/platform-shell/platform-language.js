export const platformLanguages = [
  { value: 'en', short: 'EN', label: 'English' },
  { value: 'th', short: 'TH', label: 'ไทย' },
  { value: 'zh-CN', short: '中', label: '简体中文' },
  { value: 'zh-TW', short: '繁', label: '繁體中文' },
  { value: 'ru', short: 'RU', label: 'Русский' },
];
export function platformLanguageMarkup(locale) {
 return platformLanguages.map(o => '<button type="button" role="menuitemradio" data-locale="'+o.value+'" aria-checked="'+(o.value===locale)+'" class="'+(o.value===locale?'active':'')+'"><b>'+o.short+'</b><span data-no-translate>'+o.label+'</span></button>').join('');
}
