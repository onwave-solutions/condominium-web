import React from 'react'

import { MENU_HIDDEN_BREAKPOINT } from '../constants/default-values'

export function preventDefault(event: React.MouseEvent<any, any>) {
  event.preventDefault()
}

export function isMobileView() {
  return window.innerWidth < MENU_HIDDEN_BREAKPOINT
}
