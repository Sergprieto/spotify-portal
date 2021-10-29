export interface SongContract {
  address: string
  timestamp: Date
  url: string
  submittedby: string
}

export const formatURL = (url: string): string => {
  if (url.indexOf('embed') === -1) {
    const embed = '/embed/'
    const comIndex = url.indexOf('.com')
    
    const insertIndex = url.indexOf('/', comIndex)
    url = url.slice(0, insertIndex) + embed + url.slice(insertIndex+1)
  }

  const queryIndex = url.indexOf('?')
  if (queryIndex < 0) return url

  return url.slice(0, queryIndex)
}