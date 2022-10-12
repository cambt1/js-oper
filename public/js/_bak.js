// 2. _filter, _map으로 리팩토링
function _filter(list, predi) {
  //predication : 주어설명 술부
  var new_list = []; //값을 직접 필터링 하는 것이 아니라 새로운 값을 만들어 return 함
  _each(list, function (val) {
    if (predi(val)) {
      new_list.push(val);
    }
  });

  // for (var i = 0; i < list.length; i++) {
  //   if (predi(list[i])) {
  //     //응용형 함수 : 함수에서 알고 있는 인자를 특정한 시점에 함수에 적용시켜 실행
  //     new_list.push(list[i]);
  //   }
  // }
  return new_list;
}

function _map(list, mapper) {
  var new_list = [];
  _each(list, function (val, key) {
    new_list.push(mapper(val, key));
  });
  // for (var i = 0; i < list.length; i++) {
  //   new_list.push(mapper(list[i]));
  // }
  return new_list;
}

function _is_object(obj) {
  // return typeof obj == "object" && !!obj;
  Object.prototype.toString.call(obj);
  return Object.prototype.toString.call(obj) == "[object Array]" && !!obj;
}
/**object object arrya구분 */
// console.log(Object.prototype.toString.call({}))//;"[object Object]"
// console.log(Object.prototype.toString.call([]));//"[object Array]"

function _keys(obj) {
  return _is_object(obj) ? Object.keys(obj) : [];
}

var _get = _curryr(function (obj, key) {
  return obj == null ? undefined : obj[key];
});

var _length = _get("length");

function _each(list, iter) {
  var keys = _keys(list);
  for (var i = 0, len = keys.length; i < len; i++) {
    iter(list[keys[i]], keys[i]);
  }
  return list;
}
// function _curry(fn) {
//   return function (a) {
//     return function (b) {
//       return fn(a, b);
//     };
//   };
// }

// function _curry(fn) {
//   return function (a, b) {
//     if (arguments.length == 2) return fn(a, b);
//     return function (b) {
//       return fn(a, b);
//     };
//   };
// }
function _curry(fn) {
  return function (a, b) {
    return arguments.length == 2
      ? fn(a, b)
      : function (b) {
          return fn(a, b);
        };
  };
}

function _curryr(fn) {
  return function (a, b) {
    return arguments.length == 2
      ? fn(a, b)
      : function (b) {
          return fn(b, a);
        };
  };
}

var slice = Array.prototype.slice;
function _rest(list, num) {
  return slice.call(list, num || 1);
}
function _reduce(list, iter, memo) {
  // return iter(iter(iter(0, 1), 2), 3);
  if (arguments.length == 2) {
    memo = list[0];
    // list = list.slice(1);
    list = _rest(list);
  }
  _each(list, function (val) {
    memo = iter(memo, val);
  });
  return memo;
}
// memo = add(0, 1);
// memo = add(memo, 2);
// memon = add(memo, 3);
// return memo;

// add(add(add(0, 1), 2), 3);

// 5. 파이프라인 만들기 : 2개의 함수 실행
// 1. _pipe
function _pipe() {
  var fns = arguments;
  return function (arg) {
    return _reduce(
      fns,
      function (arg, fn) {
        return fn(arg);
      },
      arg
    );
  };
}

function _go(arg) {
  var fns = _rest(arguments);
  return _pipe.apply(null, fns)(arg);
}
