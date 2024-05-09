import { Readable, Writable } from "node:stream"
import { open } from 'node:fs/promises';

class ReadableNamesStream extends Readable {

  constructor(options) {
    super(options)
    this.names = []
  }

  async _read() {
    const file = await open('src/stream-file-csv/names.csv')
    const fileStream = file.createReadStream()

      if (this.names.length === 0) {
  
        fileStream.on('data', (chunck) => {
          this.names.push(chunck)
  
          this.push(Buffer.from(String(this.names)))
        })
  
      } else {
        fileStream.on('end', () => {
          this.push(null)
        })
      }
  }
}

class WritableNamesStream extends Writable {
  _write(chunck, encondig, callback) {
    console.log(chunck.toString().trim())

    // setTimeout(callback, 1000)
    callback()
  }
}

new ReadableNamesStream()
  .pipe(new WritableNamesStream())