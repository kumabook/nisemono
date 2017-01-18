# nisemono

[![Build Status](https://travis-ci.org/kumabook/nisemono.svg?branch=master)](https://travis-ci.org/kumabook/nisemono) [![Coverage Status](https://coveralls.io/repos/github/kumabook/nisemono/badge.svg?branch=master)](https://coveralls.io/github/kumabook/nisemono?branch=master) [![Code Climate](https://codeclimate.com/github/kumabook/nisemono/badges/gpa.svg)](https://codeclimate.com/github/kumabook/nisemono)

Simple and thin test double library.

## How to use

### `nisemono.func()`

`nisemono.func()` create a fake function.
You can add expectation of the method behavior.

#### returns

```js

var nisemono = require('nisemono');
var sum      = nisemono.func();

nisemono.expects(sum)
        .withArgs(1, 2, 3)
        .returns(6);

var v = sum(1, 2, 3);
assert(v === 6);

```

#### throws

```js

var nisemono = require('nisemono');
var sum      = nisemono.func();

nisemono.expects(sum)
        .withArgs('one')
        .throws(new Error('bad argument'));

sum('one'); // throw error

```

#### callback


```js

var nisemono = require('nisemono');
var fetch    = nisemono.func();

nisemono.expects(fetch).calls(function() {
  fetch.callArgFuncAt(2, ['entry1', 'entry2', 'entry3']);
  // or
  fetch.callArgFuncAt(3, new Error('network error'));
});

fetch('GET', 'http://www.example.com/entries', function(entries) {
  assert(entries.length === 3);
  assert(entries[0] === 'entry1');
}, function(e) {
  assert(e.message === 'network error');
});

```

#### Promise

```
var nisemono = require('nisemono');
var fetch    = nisemono.func();

nisemono.expects(fetch).resolves(new Error('network error'));

fetch('GET', 'http://www.example.com/entries').then(function(entries) {
  assert(entries.length === 3);
  assert(entries[0] === 'entry1');
});

```

```
var nisemono = require('nisemono');
var fetch    = nisemono.func();

nisemono.expects(fetch).rejects(['entry1', 'entry2', 'entry3']);

fetch('GET', 'http://www.example.com/entries').then(function(e) {
  assert(e.message === 'network error');
});

```

If you want to use non-standard promise implementation,
register Promise contructor with `nisemono.promise.use(Promise)`:

```js

nisemono.promise.use(require('yakusoku'));

```

### `nisemono.obj()`

`nisemono.obj()` creates a clone object that has fake methods
instead of original methods.

```
var nisemono = require('nisemono');

var obj = {
  method1:  function() { return 1; },
  method2:  function() { return 2; },
  property: 'property'
};
obj.__proto__ = {
  method3:       function() { return 3; },
  protoProperty: 'protoProperty'
};

var niseObj1 = nisemono.obj(obj, { only: ['method1', 'method2']);
nisemono.expects(niseObj1.method1).returns('nise1');
nisemono.expects(niseObj1.method1).returns('nise2');

assert.equal(niseObj1.method1(), 'nise1');
assert.equal(niseObj1.method1(), 'nise2');

var niseObj2 = nisemono.obj(obj, { except: ['method1']);
nisemono.expects(niseObj2.method2).returns('nise2');
nisemono.expects(niseObj2.method3).returns('nise3');

assert.equal(niseObj2.method1(), 'nise1');
assert.equal(niseObj2.method1(), 'nise2');

```

## LICENSE

MIT License

Copyright (c) 2017 Hiroki Kumamoto

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
