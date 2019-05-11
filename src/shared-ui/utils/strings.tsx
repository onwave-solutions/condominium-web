export function truncate(maxLength: number) {
  return (value: string): string => {
    if (!value) return ''
    return value.length > maxLength ? `${value.substr(0, maxLength)}...` : value
  }
}

export function validateEmail(email: string): boolean {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
