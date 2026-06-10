export const badWords = [
  // Portugues
  'merda', 'porra', 'caralho', 'puta', 'filha da puta', 'filho da puta',
  'viado', 'bicha', 'buceta', 'pau', 'cuzao', 'corno', 'vadia', 'piranha',
  'idiota', 'imbecil', 'retardado', 'cretino', 'babaca', 'otario',
  // Ingles
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick',
  'pussy', 'nigger', 'faggot', 'whore', 'slut', 'retard', 'idiot',
  'moron', 'stupid', 'dumbass', 'jackass', 'wanker', 'twat'
]

export const containsBadWord = (text) => {
  const lower = text.toLowerCase()
  return badWords.some((word) => lower.includes(word))
}