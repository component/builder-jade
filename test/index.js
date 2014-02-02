var vm = require('vm')
var co = require('co')
var mkdirp = require('mkdirp')
var assert = require('assert')
var Resolver = require('component-resolver')
var Builder = require('component-builder2')
var Remotes = require('remotes')
var join = require('path').join
var options = {
  install: true
}

var output = '<html><head></head><body></body></html>'

function fixture(name) {
  return join(__dirname, 'fixtures', name)
}

function build(nodes, options) {
  return new Builder.scripts(nodes, options)
    .use('scripts', Builder.plugins.js())
    .use('jade', require('..')(options))
}

describe('jade', function () {
  var tree
  var nodes
  var js

  it('should install', co(function* () {
    var resolver = new Resolver(fixture('jade'), options)
    tree = yield* resolver.tree()
    nodes = resolver.flatten(tree)
  }))

  it('should build', co(function* () {
    var builder = build(nodes)
    js = yield builder.toStr()
  }))

  it('should execute', function () {
    var ctx = vm.createContext()
    vm.runInContext(js, ctx)
    vm.runInContext('if (require("jade")() !== "'
      + output + '") throw new Error()', ctx)
  })
})

describe('jade-runtime', function () {
  var tree
  var nodes
  var js

  it('should install', co(function* () {
    var resolver = new Resolver(fixture('jade-runtime'), options)
    tree = yield* resolver.tree()
    nodes = resolver.flatten(tree)
  }))

  it('should build', co(function* () {
    var builder = build(nodes, {
      runtime: true
    })
    js = yield builder.toStr()
    js = require('..').runtime + js
  }))

  it('should execute', function () {
    var ctx = vm.createContext()
    vm.runInContext(js, ctx)
    vm.runInContext('if (require("jade-runtime")() !== "'
      + output + '") throw new Error()', ctx)
  })
})