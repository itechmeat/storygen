export enum ClogColor {
  SUCCESS = '#bada55',
  WARNING = '#da7f55',
  DANGER = '#c41818',
}

export const clog = (name: string, text?: string | null, color: ClogColor = ClogColor.SUCCESS) => {
  console.log(`%c ${name} `, `background: #222; color: ${color}`)
  console.log(text ? text : '- nothing in the answer -')
}
