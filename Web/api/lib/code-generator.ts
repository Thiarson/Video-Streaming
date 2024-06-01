const generateVerifCode = () => {
  return Math.floor(Math.random() * 9000) + 1000
}

export { generateVerifCode }
