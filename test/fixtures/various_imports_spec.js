import { fromJs } from './file-types/js-file'
import { fromJsx } from './file-types/jsx-file'
import { fromCoffee } from './file-types/coffee-file'
import { fromMjs } from './file-types/mjs-file'

import json from './json_file'

expect(fromJs).equal('from js')
expect(fromJsx).to.be.an('object')
expect(fromCoffee).equal('from coffee')
expect(fromMjs).equal('from mjs')
expect(json).to.eql({ json: 'contents' })
