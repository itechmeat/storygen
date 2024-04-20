export enum Language {
  EN = 'en',
  RU = 'ru',
}

export type Translation = (
  trans: string,
  params?: { [key: string]: string | number | undefined },
) => string
