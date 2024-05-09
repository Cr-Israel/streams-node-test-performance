import fs from "node:fs"
import Benchmark from "benchmark";
import { Readable, Writable } from "node:stream"
import { open } from 'node:fs/promises';

const suite = new Benchmark.Suite

suite
  .add('Codigo 1', function () {

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
  })
  .add('Código 2', function () {

    const names = []

    const file = fs.readFile('src/stream-file-csv/names.csv', { encondig: 'utf8' }, (err, data) => {
      if (err) {
        // throw new Error('Deu erro aqui', err)
        console.error('Deu erro aqui', err)
      }
      names.push(data)
      console.log(names.toString())
    })
  })

  .on('complete', function () {
    console.log('Melhor teste:', this.filter('fastest').map('name'));
    console.log('Resultados:');
    this.forEach(result => console.log(`${result.name}: ${result.times.elapsed.toFixed(2)}ms ± ${result.stats.rme.toFixed(2)}%`));
  })
    .run();