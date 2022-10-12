function _curry(fn) {
  return function (a, b) {
    //인자2개가 바로 들어오면 바로 함수본체 실행
    return arguments.length == 2
      ? fn(a, b)
      : function (b) {
          return fn(a, b); //함수 실행: 실행문 실행
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

//_curry함수는 하나의 인자만 적용할 경우에는 함수를 리턴하고 해당 함수를 변수로 받을 수 있음
//_curryr은 하나의 인자를 받으면 오른쪽부터 실행하는 함수 반환
var _get = _curryr(function (obj, key) {
  return obj == null ? undefined : obj[key]; //해당 object{}의 key값 반환
});

function _filter(list, predi) {
  var new_list = [];
  _each(list, function (val) {
    //실행함수
    if (predi(val)) new_list.push(val); //실행문
  });
  return new_list;
}

function _map(list, mapper) {
  var new_list = [];
  _each(list, function (val, key) {
    new_list.push(mapper(val, key));
  });
  return new_list;
}

function _is_object(obj) {
  //[{}] => ['0','1']
  return typeof obj == "object" && !!obj; //obj이면 true반환
}

function _keys(obj) {
  return _is_object(obj) ? Object.keys(obj) : [];
}
//Object.keys(obj)["key1", "key2", "key3"]

// obj.length = obj["length"];
var _length = _get("length");

function _each(list, iter) {
  var keys = _keys(list);
  for (var i = 0, len = keys.length; i < len; i++) {
    iter(list[keys[i]], keys[i]); //(val, key)
  }
  return list;
}

var _map = _curryr(_map),
  _each = _curryr(_each),
  _filter = _curryr(_filter);

var _pairs = _map(function (val, key) {
  return [key, val];
});

//원래 slice는 Array만 사용
var slice = Array.prototype.slice;
function _rest(list, num) {
  //변수에 prototype저장후 call함수를 주면
  //likeArray에도 사용 가능
  //num이 아니면 1 (= num 또는 1)
  return slice.call(list, num || 1);
}
// .constructor : 리턴되는 객체 볼 수 있음
//object가 array는 아니지만 array처럼 동작하게 됨
//obj[key] = obj값

function _reduce(list, iter, memo) {
  if (arguments.length == 2) {
    memo = list[0]; //memo를 첫번 째 값으로 세팅
    list = _rest(list);
  }
  //list를 순회하며너
  _each(list, function (val) {
    //이전값 memo와 새로받은 val을 더하고 있음
    memo = iter(memo, val);
  });
  return memo;
}

//들어온 함수들을 연속 실행
function _pipe() {
  var fns = arguments;
  return function (arg) {
    //나중에 실행될 함수를 return
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
  //첫번쨰 인자를 제외한 값이 fns이므로 잘라줌
  var fns = _rest(arguments);
  //func.apply(thisArg, [argsArray])
  return _pipe.apply(null, fns)(arg);
}

var _values = _map(_identity);

function _identity(val) {
  return val;
}

var _pluck = _curryr(function (data, key) {
  return _map(data, _get(key));
});

function _negate(func) {
  return function (val) {
    return !func(val);
  };
}

var _reject = _curryr(function (data, predi) {
  return _filter(data, _negate(predi));
});

var _compact = _filter(_identity);

var _find = _curryr(function (list, predi) {
  var keys = _keys(list);
  for (var i = 0, len = keys.length; i < len; i++) {
    var val = list[keys[i]];
    if (predi(val)) return val;
  }
});

var _find_index = _curryr(function (list, predi) {
  var keys = _keys(list);
  for (var i = 0, len = keys.length; i < len; i++) {
    if (predi(list[keys[i]])) return i;
  }
  return -1;
});

function _some(data, predi) {
  return _find_index(data, predi || _identity) != -1;
}

function _every(data, predi) {
  return _find_index(data, _negate(predi || _identity)) == -1;
}

function _push(obj, key, val) {
  (obj[key] = obj[key] || []).push(val);
  return obj;
}

var _group_by = _curryr(function (data, iter) {
  return _reduce(
    data,
    function (grouped, val) {
      return _push(grouped, iter(val), val);
    },
    {}
  );
});

var _inc = function (count, key) {
  count[key] ? count[key]++ : (count[key] = 1);
  return count;
};

var _count_by = _curryr(function (data, iter) {
  return _reduce(
    data,
    function (count, val) {
      return _inc(count, iter(val));
    },
    {}
  );
});

var _head = function (list) {
  return list[0];
};
