const concatRows = require('ndarray-concat-rows')
const cops = require('ndarray-complex')
const fft = require('ndarray-fft')
const ndarray = require('ndarray')
const ops = require('ndarray-ops')

function padding (array, length) {
  const output = new Float64Array(length)

  for (let i = 0; i < array.length; i++) {
    output[i] = array[i]
  }

  return ndarray(output)
}

function zeros (length) {
  return ndarray(new Float64Array(length))
}

function gccPhat (signal, reference, sampleRate, maxTau, interp) {
  const n = signal.length + reference.length

  signal = {r: padding(signal, n), i: zeros(n)}

  fft(1, signal.r, signal.i)

  reference = {r: padding(reference, n), i: zeros(n)}

  fft(1, reference.r, reference.i)

  cops.conj(reference.r, reference.i, reference.r, reference.i)

  const r = {r: zeros(n), i: zeros(n)}

  cops.mul(r.r, r.i, signal.r, signal.i, reference.r, reference.i)

  const rAbs = {r: zeros(n), i: zeros(n)}
  const cc = {r: zeros(n), i: zeros(n)}

  cops.abs(rAbs.r, r.r, r.i)
  cops.div(cc.r, cc.i, r.r, r.i, rAbs.r, rAbs.i)

  fft(-1, cc.r, cc.i)

  let maxShift = Math.floor(interp * n / 2)

  if (maxTau) {
    maxShift = Math.min(Math.floor(interp * sampleRate * maxTau), maxShift)
  }

  const ccc = {
    r: concatRows([
      cc.r.lo(cc.r.shape[0] - maxShift),
      cc.r.hi(maxShift + 1)
    ]),
    i: concatRows([
      cc.i.lo(cc.i.shape[0] - maxShift),
      cc.i.hi(maxShift + 1)
    ])
  }

  cops.abs(ccc.r, ccc.r, ccc.i)

  const shift = ops.argmax(ccc.r) - maxShift

  return shift / interp / sampleRate
}

module.exports = gccPhat
