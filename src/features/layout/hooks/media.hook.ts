import { useWindowSize } from 'react-use'
import { MOBILE_BREAKPOINT } from '../constants'

export const useMedia = () => {
  const { width } = useWindowSize()

  return { isMobile: width < MOBILE_BREAKPOINT }
}
