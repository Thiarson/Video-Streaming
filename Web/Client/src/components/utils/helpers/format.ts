import type { DynamicObject } from "../types/object"

const toString = (month: string) => {
  const match: DynamicObject<string, string> = {
    '01': 'Janvier',
    '02': 'Février',
    '03': 'Mars',
    '04': 'Avril',
    '05': 'Mais',
    '06': 'Juin',
    '07': 'Juillet',
    '08': 'Août',
    '09': 'Septembre',
    '10': 'Octobre',
    '11': 'Novembre',
    '12': 'Decembre',
  }

  return match[month]
}

const format = (datetime: string) => {
  const temp = datetime.split('T')
  
  const date = temp[0].split('-')
  const time = temp[1].split('.')[0].split(':')  

  const year = date[0]
  const month = toString(date[1])
  const day = date[2]

  const hour = time[0]
  const min = time[1]
  
  return `${day} ${month} ${year} à ${hour}h${min}`
}

export { format }
