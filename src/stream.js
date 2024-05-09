import { Readable, Transform, Writable } from "node:stream"

class OneToHundredNumber extends Readable {
  index = 1

  _read() {
    const i = this.index++

    setTimeout(() => {
      if (i > 100) {
        this.push()
      } else {
        const buf = Buffer.from(String(i))
        this.push(buf)
      }
    }, 1000)
  }
}

class TransformStream extends Transform {
  _transform(chunck, encondin, callback) {
    const transformed = Number(chunck.toString()) * -1
    callback(null, Buffer.from(String(transformed)))
  }
}

class MultiplyByHundred extends Writable {
  _write(chunck, encondig, callback) {
    console.log(Number(chunck.toString()) * 100)
    callback()
  }
}

new OneToHundredNumber()
  .pipe(new TransformStream())
  .pipe(new MultiplyByHundred())