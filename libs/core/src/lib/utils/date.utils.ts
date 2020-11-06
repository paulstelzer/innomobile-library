export const getDate = (input): Date => {
  if (input) {
    if (input instanceof Date) {
      return input
    } else if (input.toDate instanceof Function) {
      return input.toDate()
    } else if (typeof input === 'string') {
      return new Date(input)
    }
  }

  return new Date()
}

export const getDifferenceDateSeconds = (date1: number | Date, date2: number | Date): number | undefined => {
  if (!date1 || !date2) {
    return undefined
  }
  const time1 = (date1 instanceof Date) ? date1.getTime() : date1
  const time2 = (date2 instanceof Date) ? date2.getTime() : date2

  const diff = Math.abs(time1 - time2)
  return Math.ceil(diff / 1000)
}

/**
 * Get the difference between two dates in Minutes
 * @param date1 Date
 * @param date2 Date
 * @returns Difference in Minutes
 */
export const getDifferenceDateMinutes = (date1: Date, date2: Date): number => {
  const seconds = getDifferenceDateSeconds(date1, date2)

  if (seconds) {
    return Math.ceil(seconds / 60)
  }
  return undefined
}

/**
 * Get the difference between two dates in hours
 * @param date1 Date
 * @param date2 Date
 * @returns Difference in hours
 */
export const getDifferenceDateHours = (date1: Date, date2: Date): number => {
  const seconds = getDifferenceDateSeconds(date1, date2)

  if (seconds) {
    return Math.ceil(seconds / 60 / 60)
  }
  return undefined
}

export const getDifferenceDateDays = (date1: number | Date, date2: number | Date): number | undefined => {
  const seconds = getDifferenceDateSeconds(date1, date2)

  if (seconds) {
    return Math.ceil(seconds / 60 / 60 / 24)
  }
  return undefined
}

export const getDateOneYearInFuture = (): number => {
  const oneYearFromNow = new Date()
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
  return oneYearFromNow.getTime()
}

export const isSameDay = (date1, date2) => {
  if (date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth()) {
    return true;
  }
  return false;
}

/**
 * Checks if two dates are the some
 * @param date1 Date
 * @param date2 Date
 * @returns True if exact time
 */
export const isSameDate = (date1: Date, date2: Date) => {
  if (date1 instanceof Date && date2 instanceof Date) {
    if (date1.getTime() === date2.getTime()) {
      return true;
    }
  }
  return false;
}
