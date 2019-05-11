import moment from 'moment'

export function getDateWithoutOffset(
  date?: Date | string
): moment.Moment | undefined {
  if (!date) return
  const momentdate = moment(date)
  const offset = momentdate.toDate().getTimezoneOffset()
  return moment(date).add(-offset, 'minutes')
}

export function toSimpleDateFormat(date?: Date | string) {
  if (!date) return
  return getDateWithoutOffset(date)!.format('DD/MM/YYYY')
}

export function toCompleteDateFormat(date?: Date | string) {
  if (!date) return
  return getDateWithoutOffset(date)!.format('DD/MM/YYYY hh:mm:ssa')
}
