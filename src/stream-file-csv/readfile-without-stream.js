import fs from "node:fs"

const names = []

const file = fs.readFile('src/stream-file-csv/names.csv', { encondig: 'utf8' }, (err, data) => {
  if (err) {
    // throw new Error('Deu erro aqui', err)
    console.error('Deu erro aqui', err)
  }
  names.push(data)
  console.log(names.toString())
})