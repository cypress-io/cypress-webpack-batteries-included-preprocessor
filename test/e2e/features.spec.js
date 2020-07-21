const EventEmitter = require('events').EventEmitter
const { expect } = require('chai')
const fs = require('fs-extra')
const path = require('path')

const preprocessor = require('../../index')

const fixturesDir = path.join(__dirname, '..', 'fixtures')
const outputDir = path.join(__dirname, '..', '_test-output')

const run = (fileName, options) => {
  const file = Object.assign(new EventEmitter(), {
    filePath: path.join(outputDir, fileName),
    outputPath: path.join(outputDir, fileName.replace('.', '_output.')),
  })

  return preprocessor(options)(file)
}

const runAndEval = async (fileName, options) => {
  const outputPath = await run(fileName, options)
  const contents = await fs.readFile(outputPath)

  eval(contents.toString())
}

describe('features', () => {
  beforeEach(async () => {
    preprocessor.__reset()

    await fs.remove(outputDir)
    await fs.copy(fixturesDir, outputDir)
  })

  it('handles module interop, object spread, class properties, and async/await', async () => {
    await runAndEval('es_features_spec.js')
  })

  it('handles jsx', async () => {
    await runAndEval('jsx_spec.jsx')
  })

  it('handles coffeescript', async () => {
    await runAndEval('coffee_spec.coffee')
  })

  it('handles import default export in coffeescript', async () => {
    await runAndEval('coffee_imports_spec.coffee')
  })

  it('handles importing .js, .json, .jsx, and .coffee', async () => {
    await runAndEval('various_imports_spec.js')
  })

  it('shims node globals', async () => {
    await runAndEval('node_shim_spec.js')
  })

  it('outputs inline source map', async () => {
    const outputPath = await run('es_features_spec.js')
    const contents = await fs.readFile(outputPath)

    expect(contents.toString()).to.include('//# sourceMappingURL=data:application/json;charset=utf-8;base64')
  })

  describe('with typescript option set', () => {
    const options = { typescript: require.resolve('typescript') }

    it('handles typescript', async () => {
      await runAndEval('typescript-project/ts_spec.ts', options)
    })

    it('handles tsx', async () => {
      await runAndEval('typescript-project/tsx_spec.tsx', options)
    })

    it('handles importing .ts and .tsx', async () => {
      await runAndEval('typescript_imports_spec.js', options)
    })
  })
})
