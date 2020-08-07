(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('karas')) :
  typeof define === 'function' && define.amd ? define(['karas'], factory) :
  (global = global || self, global.Dragonbones = factory(global.karas));
}(this, (function (karas) { 'use strict';

  karas = karas && Object.prototype.hasOwnProperty.call(karas, 'default') ? karas['default'] : karas;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var inject = karas.inject,
      math = karas.math;

  function parseAndLoadTex(tex, cb) {
    var src = tex.imagePath;
    var img = document.createElement('img');
    var texHash = {};

    img.onload = function () {
      // 提前设置测量加载此图
      inject.IMG[src] = {
        width: tex.width,
        height: tex.height,
        state: karas.inject.LOADED,
        source: img,
        url: src
      };
      tex.SubTexture.forEach(function (item) {
        var name = item.name,
            x = item.x,
            y = item.y,
            width = item.width,
            height = item.height,
            _item$frameX = item.frameX,
            frameX = _item$frameX === void 0 ? 0 : _item$frameX,
            _item$frameY = item.frameY,
            frameY = _item$frameY === void 0 ? 0 : _item$frameY,
            _item$frameWidth = item.frameWidth,
            frameWidth = _item$frameWidth === void 0 ? width : _item$frameWidth,
            _item$frameHeight = item.frameHeight,
            frameHeight = _item$frameHeight === void 0 ? height : _item$frameHeight;
        texHash[name] = {
          x: x,
          y: y,
          width: width,
          height: height,
          frameX: frameX,
          frameY: frameY,
          frameWidth: frameWidth,
          frameHeight: frameHeight,
          source: img
        };
      });
      cb(texHash);
    };

    img.onerror = function () {
      throw new Error('Can not find tex: ' + src);
    };

    img.src = src;
  }

  function parseSke(ske, texHash) {
    var globalFrameRate = ske.frameRate,
        armature = ske.armature;
    var _armature$ = armature[0],
        bone = _armature$.bone,
        slot = _armature$.slot,
        skin = _armature$.skin,
        frameRate = _armature$.frameRate,
        animation = _armature$.animation,
        defaultActions = _armature$.defaultActions,
        canvas = _armature$.canvas;
    var boneHash = parseBone(bone);
    var slotHash = parseSlot(slot);
    var skinHash = parseSkin(skin, texHash);
    var animationHash = parseAnimation(animation, frameRate || globalFrameRate || 60, boneHash);
    return {
      bone: bone,
      boneHash: boneHash,
      slot: slot,
      slotHash: slotHash,
      skin: skin[0].slot,
      skinHash: skinHash,
      animationHash: animationHash,
      defaultActions: defaultActions,
      canvas: canvas
    };
  }

  function parseSlot(data) {
    var hash = {};
    data.forEach(function (item) {
      hash[item.name] = item;
    });
    return hash;
  }

  function parseBone(data) {
    var hash = {}; // bone数据形成tree结构，符合dom格式，第一个一定是root

    var root = data[0];
    root.children = [];
    hash[root.name] = root;
    data.forEach(function (item, i) {
      var name = item.name,
          parent = item.parent,
          _item$transform = item.transform,
          transform = _item$transform === void 0 ? {} : _item$transform;

      if (parent) {
        hash[parent].children.push(item);
      }

      hash[name] = item;
      item.children = [];
      item.index = i; // 静态变换样式，可能某个骨骼没动画

      var matrix = [1, 0, 0, 1, 0, 0];

      if (transform.x || transform.y) {
        var m = [1, 0, 0, 1, transform.x || 0, transform.y || 0];
        matrix = math.matrix.multiply(matrix, m);
      }

      if (transform.skX) {
        var d = math.geom.d2r(transform.skX);
        var sin = Math.sin(d);
        var cos = Math.cos(d);
        var _m = [cos, sin, -sin, cos, 0, 0];
        matrix = math.matrix.multiply(matrix, _m);
      }

      if (transform.scX !== undefined || transform.scY !== undefined) {
        var _m2 = [transform.scX === undefined ? 1 : transform.scX, 0, 0, transform.scY === undefined ? 1 : transform.scY, 0, 0];
        matrix = karas.math.matrix.multiply(matrix, _m2);
      }

      item.matrix = matrix;
    });
    return hash;
  }

  function parseSkin(data, texHash) {
    var hash = {};
    data[0].slot.forEach(function (item) {
      var name = item.name,
          display = item.display;
      hash[name] = item;
      display.forEach(function (item) {
        var type = item.type,
            name = item.name; // mesh网格分析三角形

        if (type === 'mesh') {
          (function () {
            var vertices = item.vertices,
                triangles = item.triangles,
                uvs = item.uvs,
                weights = item.weights,
                bonePose = item.bonePose;
            var weightHash;
            var bonePoseHash; // 有权重则绑定骨骼，坐标系为世界；
            // 没有权重时，完全属于父骨骼，类似普通贴图行为

            if (weights) {
              // 权重格式化hash
              weightHash = {};

              for (var i = 0, len = weights.length, verticesIndex = 0; i < len; i++) {
                var num = weights[i];
                var list = [];

                for (var j = i + 1; j < i + 1 + num * 2; j += 2) {
                  var index = weights[j];
                  var value = weights[j + 1];
                  list.push({
                    index: index,
                    value: value
                  });
                }

                weightHash[verticesIndex++] = list;
                i += num * 2;
              } // 骨骼初始pose格式化和世界坐标


              bonePoseHash = {};

              for (var _i = 0, _len = bonePose.length; _i < _len; _i += 7) {
                var _index = bonePose[_i];
                var matrix = bonePose.slice(_i + 1, _i + 7);
                var coords = math.matrix.calPoint([0, 0], matrix);
                bonePoseHash[_index] = {
                  coords: coords,
                  pose: matrix
                };
              }
            } // 顶点格式化，相对于骨骼点的x/y位移差值


            var verticesList = item.verticesList = [];

            var _loop = function _loop(_i2, _len2) {
              var index = _i2 >> 1;
              var x = vertices[_i2];
              var y = vertices[_i2 + 1];
              var res = {
                index: index,
                x: x,
                y: y
              };
              verticesList.push(res); // 有添加绑定骨骼才有权重

              if (weightHash) {
                res.weightList = [];
                var weight = weightHash[index];
                weight.forEach(function (item) {
                  var index = item.index,
                      value = item.value;
                  var _bonePoseHash$index = bonePoseHash[index],
                      coords = _bonePoseHash$index.coords,
                      pose = _bonePoseHash$index.pose; // 先求骨头的角度，逆向选择至水平后，平移x/y的差值

                  var _math$matrix$calPoint = math.matrix.calPoint([0, 0], pose),
                      _math$matrix$calPoint2 = _slicedToArray(_math$matrix$calPoint, 2),
                      x0 = _math$matrix$calPoint2[0],
                      y0 = _math$matrix$calPoint2[1];

                  var _math$matrix$calPoint3 = math.matrix.calPoint([1, 0], pose),
                      _math$matrix$calPoint4 = _slicedToArray(_math$matrix$calPoint3, 2),
                      x1 = _math$matrix$calPoint4[0],
                      y1 = _math$matrix$calPoint4[1];

                  var dx = x1 - x0;
                  var dy = y1 - y0;
                  var theta; // 4个象限分开判断

                  if (dx >= 0 && dy >= 0) {
                    theta = -Math.atan(Math.abs(dy / dx));
                  } else if (dx < 0 && dy >= 0) {
                    theta = -Math.PI + Math.atan(Math.abs(dy / dx));
                  } else if (dx < 0 && dy < 0) {
                    theta = Math.PI - Math.atan(Math.abs(dy / dx));
                  } else {
                    theta = Math.atan(Math.abs(dy / dx));
                  }

                  var rotate = [Math.cos(theta), Math.sin(theta), -Math.sin(theta), Math.cos(theta), 0, 0];
                  var translate = [1, 0, 0, 1, x - coords[0], y - coords[1]];
                  var matrix = math.matrix.multiply(rotate, translate);
                  res.weightList.push({
                    index: index,
                    value: value,
                    matrix: matrix
                  });
                });
              }
            };

            for (var _i2 = 0, _len2 = vertices.length; _i2 < _len2; _i2 += 2) {
              _loop(_i2);
            } // 三角形，切割图片坐标


            var tex = texHash[name];
            var width = tex.width,
                height = tex.height;
            var triangleList = item.triangleList = [];

            for (var _i3 = 0, _len3 = triangles.length; _i3 < _len3; _i3 += 3) {
              var i1 = triangles[_i3];
              var i2 = triangles[_i3 + 1];
              var i3 = triangles[_i3 + 2]; // uv坐标

              var p1x = uvs[i1 * 2];
              var p1y = uvs[i1 * 2 + 1];
              var p2x = uvs[i2 * 2];
              var p2y = uvs[i2 * 2 + 1];
              var p3x = uvs[i3 * 2];
              var p3y = uvs[i3 * 2 + 1]; // uv贴图坐标根据尺寸映射真实坐标

              var x1 = p1x * width;
              var y1 = p1y * height;
              var x2 = p2x * width;
              var y2 = p2y * height;
              var x3 = p3x * width;
              var y3 = p3y * height; // 从内心往外扩展约0.5px

              var _math$geom$triangleIn = math.geom.triangleIncentre(x1, y1, x2, y2, x3, y3),
                  _math$geom$triangleIn2 = _slicedToArray(_math$geom$triangleIn, 2),
                  x0 = _math$geom$triangleIn2[0],
                  y0 = _math$geom$triangleIn2[1];

              var scale = triangleScale(x0, y0, x1, y1, x2, y2, x3, y3, 0.25); // 以内心为transformOrigin

              var m = math.matrix.identity();
              m[4] = -x0;
              m[5] = -y0; // 缩放

              var t = math.matrix.identity();
              t[0] = t[3] = scale;
              m = math.matrix.multiply(t, m); // 移动回去

              t[4] = x0;
              t[5] = y0;
              m = math.matrix.multiply(t, m); // 获取扩展后的三角形顶点坐标

              var _math$geom$transformP = math.geom.transformPoint(m, x1, y1),
                  _math$geom$transformP2 = _slicedToArray(_math$geom$transformP, 2),
                  sx1 = _math$geom$transformP2[0],
                  sy1 = _math$geom$transformP2[1];

              var _math$geom$transformP3 = math.geom.transformPoint(m, x2, y2),
                  _math$geom$transformP4 = _slicedToArray(_math$geom$transformP3, 2),
                  sx2 = _math$geom$transformP4[0],
                  sy2 = _math$geom$transformP4[1];

              var _math$geom$transformP5 = math.geom.transformPoint(m, x3, y3),
                  _math$geom$transformP6 = _slicedToArray(_math$geom$transformP5, 2),
                  sx3 = _math$geom$transformP6[0],
                  sy3 = _math$geom$transformP6[1]; // 三角形所在矩形距离左上角原点的坐标，以此做img切割最小尺寸化，以及变换原点计算
              // let [ox, oy, ow, oh] = triangleOriginCoords(sx1, sy1, sx2, sy2, sx3, sy3);


              triangleList.push({
                index: Math.round(_i3 / 3),
                indexList: [i1, i2, i3],
                // ox,
                // oy,
                // ow,
                // oh,
                // points: [
                //   [p1x, p1y],
                //   [p2x, p2y],
                //   [p3x, p3y]
                // ],
                coords: [[x1, y1], [x2, y2], [x3, y3]],
                scale: scale,
                scaleCoords: [[sx1, sy1], [sx2, sy2], [sx3, sy3]],
                width: width,
                height: height
              });
            }
          })();
        }
      });
    });
    return hash;
  }
  /**
   * 将三角形从内心缩放指定像素
   * @param x0
   * @param y0
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   * @param x3
   * @param y3
   * @param px 缩放多少像素，可正负
   * @returns {number} 缩放倍数
   */


  function triangleScale(x0, y0, x1, y1, x2, y2, x3, y3) {
    var px = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
    // 内心到任意一边的距离
    var a = y2 - y1;
    var b = x1 - x2;
    var c = x2 * y1 - x1 * y2;
    var d = Math.abs(a * x0 + b * y0 + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    return (d + px) / d;
  }

  function parseAnimation(data, frameRate, boneHash) {
    var hash = {};
    data.forEach(function (item) {
      var duration = item.duration,
          playTimes = item.playTimes,
          name = item.name,
          _item$bone = item.bone,
          bone = _item$bone === void 0 ? [] : _item$bone,
          _item$slot = item.slot,
          slot = _item$slot === void 0 ? [] : _item$slot;
      hash[name] = item;
      item.options = {
        duration: 1000 * duration / frameRate,
        iterations: playTimes === 0 ? Infinity : playTimes,
        fps: frameRate,
        fill: 'forwards'
      };
      item.boneAnimationList = bone.map(function (item) {
        var name = item.name,
            translateFrame = item.translateFrame,
            rotateFrame = item.rotateFrame,
            scaleFrame = item.scaleFrame;
        var _boneHash$name$transf = boneHash[name].transform,
            originTransform = _boneHash$name$transf === void 0 ? {} : _boneHash$name$transf;
        var res = {
          name: name,
          list: []
        };

        if (translateFrame) {
          var offsetSum = 0;
          var last;
          var value = translateFrame.map(function (frame) {
            var _frame$duration = frame.duration,
                d = _frame$duration === void 0 ? 1 : _frame$duration;

            var _getEasing = getEasing(frame),
                _getEasing2 = _slicedToArray(_getEasing, 2),
                easing = _getEasing2[0],
                easingFn = _getEasing2[1];

            var offset = offsetSum / duration;
            offsetSum += d;
            var _originTransform$x = originTransform.x,
                x = _originTransform$x === void 0 ? 0 : _originTransform$x,
                _originTransform$y = originTransform.y,
                y = _originTransform$y === void 0 ? 0 : _originTransform$y;
            var res = {
              type: 0,
              translateX: (frame.x || 0) + x,
              translateY: (frame.y || 0) + y,
              offset: offset,
              easing: easing,
              easingFn: easingFn
            };

            if (last) {
              last.dx = res.translateX - last.translateX;
              last.dy = res.translateY - last.translateY;
            }

            last = res;
            return res;
          });
          res.list.push(value);
        }

        if (rotateFrame) {
          var _offsetSum = 0;

          var _last;

          var _value = rotateFrame.map(function (frame) {
            var _frame$duration2 = frame.duration,
                d = _frame$duration2 === void 0 ? 1 : _frame$duration2;

            var _getEasing3 = getEasing(frame),
                _getEasing4 = _slicedToArray(_getEasing3, 2),
                easing = _getEasing4[0],
                easingFn = _getEasing4[1];

            var offset = _offsetSum / duration;
            _offsetSum += d;
            var _originTransform$skX = originTransform.skX,
                skX = _originTransform$skX === void 0 ? 0 : _originTransform$skX;
            var res = {
              type: 1,
              rotateZ: (frame.rotate || 0) + skX,
              offset: offset,
              easing: easing,
              easingFn: easingFn
            };

            if (_last) {
              _last.dz = res.rotateZ - _last.rotateZ;
            }

            _last = res;
            return res;
          });

          res.list.push(_value);
        }

        if (scaleFrame) {
          var _offsetSum2 = 0;

          var _last2;

          var _value2 = scaleFrame.map(function (frame) {
            var _frame$duration3 = frame.duration,
                d = _frame$duration3 === void 0 ? 1 : _frame$duration3;

            var _getEasing5 = getEasing(frame),
                _getEasing6 = _slicedToArray(_getEasing5, 2),
                easing = _getEasing6[0],
                easingFn = _getEasing6[1];

            var offset = _offsetSum2 / duration;
            _offsetSum2 += d;
            var _originTransform$scX = originTransform.scX,
                scX = _originTransform$scX === void 0 ? 1 : _originTransform$scX,
                _originTransform$scY = originTransform.scY,
                scY = _originTransform$scY === void 0 ? 1 : _originTransform$scY;
            var res = {
              type: 2,
              scaleX: (frame.x === undefined ? 1 : frame.x) * scX,
              scaleY: (frame.y === undefined ? 1 : frame.y) * scY,
              offset: offset,
              easing: easing,
              easingFn: easingFn
            };

            if (_last2) {
              _last2.dx = res.scaleX - _last2.scaleX;
              _last2.dy = res.scaleY - _last2.scaleY;
            }

            _last2 = res;
            return res;
          });

          res.list.push(_value2);
        }

        return res;
      });
      item.slotAnimationList = slot.map(function (item) {
        var offsetSum = 0;
        item.displayFrame.forEach(function (frame) {
          var _frame$duration4 = frame.duration,
              d = _frame$duration4 === void 0 ? 1 : _frame$duration4;
          var offset = offsetSum / duration;
          offsetSum += d;
          frame.offset = offset;
        });
        return item;
      });
    });
    return hash;
  }

  function getEasing(frame) {
    var curve = frame.curve;

    if (curve) {
      return ["(".concat(curve.join(','), ")"), karas.easing.cubicBezier(curve[0], curve[1], curve[2], curve[3])];
    }

    return ['linear', karas.easing.linear];
  }

  var parser = {
    parseAndLoadTex: parseAndLoadTex,
    parseSke: parseSke
  };

  var math$1 = karas.math;
  /**
   * 根据动画时间状态修改骨骼当前matrix
   * @param animationList 动画列表
   * @param offset 当前时间偏移量
   * @param boneHash 骨骼hash
   */

  function animateBoneMatrix(animationList, offset, boneHash) {
    animationList.forEach(function (item) {
      var name = item.name,
          list = item.list;
      var bone = boneHash[name]; // 先以静态变换样式为基础

      var _bone$transform = bone.transform,
          transform = _bone$transform === void 0 ? {} : _bone$transform;
      var res = {};
      res.translateX = transform.x || 0;
      res.translateY = transform.y || 0;
      res.rotateZ = transform.skX || 0;
      res.scaleX = transform.scX === undefined ? 1 : transform.scX;
      res.scaleY = transform.scY === undefined ? 1 : transform.scY; // 再assign动画中的变换样式

      list.forEach(function (frames) {
        var len = frames.length;
        var type = frames[0].type;
        var i = binarySearch(0, len - 1, offset, frames);
        var current = frames[i]; // 是否最后一帧

        if (i === len - 1) {
          if (type === 0) {
            res.translateX = current.translateX;
            res.translateY = current.translateY;
          } else if (type === 1) {
            res.rotateZ = current.rotateZ;
          } else if (type === 2) {
            res.scaleX = current.scaleX;
            res.scaleY = current.scaleY;
          }
        } else {
          var next = frames[i + 1];
          var total = next.offset - current.offset;
          var percent = (offset - current.offset) / total;

          if (type === 0) {
            res.translateX = current.translateX + current.dx * percent;
            res.translateY = current.translateY + current.dy * percent;
          } else if (type === 1) {
            res.rotateZ = current.rotateZ + current.dz * percent;
          } else if (type === 2) {
            res.scaleX = current.scaleX + current.dx * percent;
            res.scaleY = current.scaleY + current.dy * percent;
          }
        }
      });
      var matrix = [1, 0, 0, 1, 0, 0];

      if (res.translateX || res.translateY) {
        var m = [1, 0, 0, 1, res.translateX || 0, res.translateY || 0];
        matrix = math$1.matrix.multiply(matrix, m);
      }

      if (res.rotateZ) {
        var d = math$1.geom.d2r(res.rotateZ);
        var sin = Math.sin(d);
        var cos = Math.cos(d);
        var _m = [cos, sin, -sin, cos, 0, 0];
        matrix = math$1.matrix.multiply(matrix, _m);
      }

      if (res.scaleX !== undefined || res.scaleY !== undefined) {
        var _m2 = [res.scaleX === undefined ? 1 : res.scaleX, 0, 0, res.scaleY === undefined ? 1 : res.scaleY, 0, 0];
        matrix = math$1.matrix.multiply(matrix, _m2);
      }

      bone.matrix = matrix;
    });
  }
  /**
   * 二分查找根据时间轴帧序列和当前百分比获得当前帧
   * @param i
   * @param j
   * @param offset
   * @param frames
   * @returns {frame}
   */


  function binarySearch(i, j, offset, frames) {
    if (i === j) {
      var frame = frames[i];

      if (frame.offset > offset) {
        return i - 1;
      }

      return i;
    } else {
      var middle = i + (j - i >> 1);
      var _frame = frames[middle];

      if (_frame.offset === offset) {
        return middle;
      } else if (_frame.offset > offset) {
        return binarySearch(i, Math.max(middle - 1, i), offset, frames);
      } else {
        return binarySearch(Math.min(middle + 1, j), j, offset, frames);
      }
    }
  }
  /**
   * 递归遍历骨骼，根据父子属性合并生成骨骼相对于舞台的最终currentMatrix
   * @param root 根骨骼
   */


  function mergeBoneMatrix(root) {
    root.currentMatrix = root.matrix;
    root.children.forEach(function (item) {
      mergeChildBoneMatrix(item, root.currentMatrix);
    });
  }

  function mergeChildBoneMatrix(bone, parentMatrix) {
    bone.currentMatrix = math$1.matrix.multiply(parentMatrix, bone.matrix);
    bone.children.forEach(function (item) {
      mergeChildBoneMatrix(item, bone.currentMatrix);
    });
  }
  /**
   * 根据当前动画时间执行slot的动画
   * @param animationList
   * @param offset
   * @param slotHash
   */


  function animateSlot(animationList, offset, slotHash) {
    animationList.forEach(function (item) {
      var name = item.name,
          displayFrame = item.displayFrame;
      var i = binarySearch(0, displayFrame.length - 1, offset, displayFrame);
      var _displayFrame$i$value = displayFrame[i].value,
          value = _displayFrame$i$value === void 0 ? 0 : _displayFrame$i$value;
      slotHash[name].displayIndex = value;
    });
  }
  /**
   * 根据当前骨骼状态计算slot中显示对象变换matrix
   * @param slot
   * @param skinHash
   * @param bone
   * @param boneHash
   * @param texHash
   */


  function calSlot(slot, skinHash, bone, boneHash, texHash) {
    slot.forEach(function (item) {
      var name = item.name,
          parent = item.parent,
          _item$displayIndex = item.displayIndex,
          displayIndex = _item$displayIndex === void 0 ? 0 : _item$displayIndex; // 插槽隐藏不显示

      if (displayIndex < 0) {
        return;
      }

      var skin = skinHash[name];
      var displayTarget = skin.display[displayIndex]; // 网格类型

      if (displayTarget.type === 'mesh') {
        var verticesList = displayTarget.verticesList,
            triangleList = displayTarget.triangleList;
        verticesList.forEach(function (item) {
          var weightList = item.weightList; // 有绑定骨骼的mesh，计算权重

          if (weightList) {
            var m = [0, 0, 0, 0, 0, 0];
            weightList.forEach(function (weight) {
              var index = weight.index,
                  value = weight.value,
                  matrix = weight.matrix;
              var boneMatrix = bone[index].currentMatrix;
              var offset = karas.math.matrix.multiply(boneMatrix, matrix);

              for (var i = 0; i < 6; i++) {
                m[i] += offset[i] * value;
              }
            });
            item.matrix = m;
            item.coords = math$1.geom.transformPoint(m, 0, 0);
          } // 没有绑定认为直属父骨骼
          else {
              var parentBoneMatrix = boneHash[parent].currentMatrix;
              var offsetMatrix = [1, 0, 0, 1, item.x, item.y];

              var _m3 = karas.math.matrix.multiply(parentBoneMatrix, offsetMatrix);

              item.matrix = _m3;
              item.coords = math$1.geom.transformPoint(_m3, 0, 0);
            }
        });
        triangleList.forEach(function (item) {
          var indexList = item.indexList,
              coords = item.coords;
          var source = coords[0].concat(coords[1]).concat(coords[2]);
          var target = [];
          indexList.forEach(function (i) {
            target = target.concat(verticesList[i].coords);
          }); // 先交换确保3个点顺序

          var _math$tar$exchangeOrd = math$1.tar.exchangeOrder(source, target),
              _math$tar$exchangeOrd2 = _slicedToArray(_math$tar$exchangeOrd, 2),
              source1 = _math$tar$exchangeOrd2[0],
              target1 = _math$tar$exchangeOrd2[1];

          var matrix; // 防止溢出，此时三角形不可见

          if (math$1.tar.isOverflow(source1, target1)) {
            matrix = [0, 0, 0, 0, 0, 0];
          } else {
            matrix = math$1.tar.transform(source1, target1);
          }

          item.matrix = matrix;
        });
      } // 默认图片类型
      else {
          var _displayTarget$transf = displayTarget.transform,
              transform = _displayTarget$transf === void 0 ? {} : _displayTarget$transf;
          var tex = texHash[displayTarget.name];
          var parentBoneMatrix = boneHash[parent].currentMatrix;
          var matrix = math$1.matrix.identity(); // 图片本身形变，因中心点在图片本身中心，所以无论是否有translate都要平移

          var t = [1, 0, 0, 1, (transform.x || 0) - tex.frameWidth * 0.5, (transform.y || 0) - tex.frameHeight * 0.5];
          matrix = math$1.matrix.multiply(matrix, t); // 可选旋转

          if (transform.skX) {
            var d = math$1.geom.d2r(transform.skX);
            var sin = Math.sin(d);
            var cos = Math.cos(d);
            var _t = [cos, sin, -sin, cos, 0, 0];
            matrix = math$1.matrix.multiply(matrix, _t);
          } // tfo为图片中心，可合并


          t = math$1.matrix.identity();
          t[4] = tex.frameWidth * 0.5;
          t[5] = tex.frameHeight * 0.5;
          matrix = math$1.matrix.multiply(t, matrix);
          t = math$1.matrix.identity();
          t[4] = -tex.frameWidth * 0.5;
          t[5] = -tex.frameHeight * 0.5;
          matrix = math$1.matrix.multiply(matrix, t);
          matrix = math$1.matrix.multiply(parentBoneMatrix, matrix);
          displayTarget.matrix = matrix;
        }
    });
  }

  var util = {
    animateBoneMatrix: animateBoneMatrix,
    mergeBoneMatrix: mergeBoneMatrix,
    animateSlot: animateSlot,
    calSlot: calSlot
  };

  var math$2 = karas.math;

  function canvasBone(ctx, sx, sy, matrixEvent, bone) {
    var length = bone.length,
        children = bone.children,
        currentMatrix = bone.currentMatrix;
    var m = math$2.matrix.multiply(matrixEvent, currentMatrix);
    ctx.setTransform.apply(ctx, _toConsumableArray(m));
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.arc(sx, sy, 5, 0, Math.PI * 2);
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + length || 5, sy);
    ctx.closePath();
    ctx.stroke();
    children.forEach(function (item) {
      canvasBone(ctx, sx, sy, matrixEvent, item);
    });
  }

  function canvasSlot(ctx, sx, sy, matrixEvent, slot, skinHash, texHash) {
    var opacity = ctx.globalAlpha;
    slot.forEach(function (item) {
      var name = item.name,
          _item$displayIndex = item.displayIndex,
          displayIndex = _item$displayIndex === void 0 ? 0 : _item$displayIndex,
          blendMode = item.blendMode,
          _item$color = item.color;
      _item$color = _item$color === void 0 ? {} : _item$color;
      var _item$color$aM = _item$color.aM,
          aM = _item$color$aM === void 0 ? 100 : _item$color$aM; // 插槽隐藏不显示

      if (displayIndex < 0) {
        return;
      } // 叠加模式


      if (blendMode === 'add') {
        ctx.globalCompositeOperation = 'lighter';
      } // 透明度


      if (aM < 100) {
        ctx.globalAlpha *= aM / 100;
      }

      var skin = skinHash[name];
      var displayTarget = skin.display[displayIndex];
      var tex = texHash[displayTarget.name]; // 网格类型

      if (displayTarget.type === 'mesh') {
        var triangleList = displayTarget.triangleList;
        triangleList.forEach(function (item) {
          var matrix = item.matrix,
              scaleCoords = item.scaleCoords; // 可能缩放至0或变形为一条线无宽度不可见

          if (matrix[0] === 0 || matrix[3] === 0) {
            return;
          }

          matrix = math$2.matrix.multiply(matrixEvent, matrix); // clip绘制

          ctx.save();
          ctx.setTransform.apply(ctx, _toConsumableArray(matrix));
          ctx.beginPath();
          ctx.closePath();
          ctx.moveTo(sx + scaleCoords[0][0], sy + scaleCoords[0][1]);
          ctx.lineTo(sx + scaleCoords[1][0], sy + scaleCoords[1][1]);
          ctx.lineTo(sx + scaleCoords[2][0], sy + scaleCoords[2][1]);
          ctx.clip();
          ctx.drawImage(tex.source, sx - tex.x, sy - tex.y);
          ctx.restore();
        });
      } // 默认图片类型
      else {
          var matrix = displayTarget.matrix;

          if (matrix[0] === 0 || matrix[3] === 0) {
            return;
          }

          matrix = math$2.matrix.multiply(matrixEvent, matrix); // clip绘制

          ctx.save();
          ctx.setTransform.apply(ctx, _toConsumableArray(matrix));
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + tex.frameWidth, sy);
          ctx.lineTo(sx + tex.frameWidth, sy + tex.frameHeight);
          ctx.lineTo(sx, sy + tex.frameHeight);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(tex.source, sx - tex.x, sy - tex.y);
          ctx.restore();
        } // 恢复模式


      if (blendMode) {
        ctx.globalCompositeOperation = 'source-over';
      } // 恢复透明度


      if (aM < 100) {
        ctx.globalAlpha = opacity;
      }
    });
  }

  function canvasTriangle(ctx, sx, sy, matrixEvent, slot, skinHash, texHash) {
    slot.forEach(function (item) {
      var name = item.name,
          _item$displayIndex2 = item.displayIndex,
          displayIndex = _item$displayIndex2 === void 0 ? 0 : _item$displayIndex2; // 插槽隐藏不显示

      if (displayIndex < 0) {
        return;
      }

      var skin = skinHash[name];
      var displayTarget = skin.display[displayIndex]; // 网格类型

      if (displayTarget.type === 'mesh') {
        var verticesList = displayTarget.verticesList,
            triangleList = displayTarget.triangleList;
        triangleList.forEach(function (item) {
          var matrix = item.matrix,
              scaleCoords = item.scaleCoords;
          matrix = math$2.matrix.multiply(matrixEvent, matrix);
          ctx.setTransform.apply(ctx, _toConsumableArray(matrix));
          ctx.strokeStyle = '#39F';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx + scaleCoords[0][0], sy + scaleCoords[0][1]);
          ctx.lineTo(sx + scaleCoords[1][0], sy + scaleCoords[1][1]);
          ctx.lineTo(sx + scaleCoords[2][0], sy + scaleCoords[2][1]);
          ctx.closePath();
          ctx.stroke();
        });
        verticesList.forEach(function (item) {
          var matrix = item.matrix;
          matrix = math$2.matrix.multiply(matrixEvent, matrix);
          ctx.setTransform.apply(ctx, _toConsumableArray(matrix));
          ctx.fillStyle = '#0D6';
          ctx.beginPath();
          ctx.arc(sx, sy, 4, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        });
      } // 默认图片类型
      else {
          var matrix = displayTarget.matrix;
          var tex = texHash[displayTarget.name];
          matrix = math$2.matrix.multiply(matrixEvent, matrix);
          ctx.save();
          ctx.setTransform.apply(ctx, _toConsumableArray(matrix));
          ctx.strokeStyle = '#F90';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + tex.frameWidth, sy);
          ctx.lineTo(sx + tex.frameWidth, sy + tex.frameHeight);
          ctx.lineTo(sx, sy + tex.frameHeight);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }
    });
  }

  var render = {
    canvasSlot: canvasSlot,
    canvasTriangle: canvasTriangle,
    canvasBone: canvasBone
  };

  var Dragonbones = /*#__PURE__*/function (_karas$Component) {
    _inherits(Dragonbones, _karas$Component);

    var _super = _createSuper(Dragonbones);

    function Dragonbones() {
      _classCallCheck(this, Dragonbones);

      return _super.apply(this, arguments);
    }

    _createClass(Dragonbones, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var self = this; // 劫持本隐藏节点的render()，在每次渲染时绘制骨骼动画

        var shadowRoot = this.shadowRoot;
        var fake = this.ref.fake;
        var _this$props = this.props,
            ske = _this$props.ske,
            tex = _this$props.tex;

        if (ske && tex && karas.util.isObject(ske) && karas.util.isObject(tex)) {
          parser.parseAndLoadTex(tex, function (texHash) {
            var _parser$parseSke = parser.parseSke(ske, texHash),
                bone = _parser$parseSke.bone,
                boneHash = _parser$parseSke.boneHash,
                slot = _parser$parseSke.slot,
                slotHash = _parser$parseSke.slotHash,
                skin = _parser$parseSke.skin,
                skinHash = _parser$parseSke.skinHash,
                animationHash = _parser$parseSke.animationHash,
                defaultActions = _parser$parseSke.defaultActions,
                canvas = _parser$parseSke.canvas;

            if (defaultActions && defaultActions.length) {
              var animation = animationHash[defaultActions[0].gotoAndPlay];
              var boneAnimationList = animation.boneAnimationList,
                  slotAnimationList = animation.slotAnimationList,
                  options = animation.options;

              if (!karas.util.isNil(self.props.playbackRate)) {
                options.playbackRate = self.props.playbackRate;
              } // 隐藏节点模拟一段不展示的动画，带动每次渲染


              var a = fake.animate([{
                opacity: 0
              }, {
                opacity: 1
              }], options); // 劫持隐藏节点渲染，因本身display:none可以不执行原本逻辑，计算并渲染骨骼动画

              fake.render = function (renderMode, ctx, defs) {
                var offset = Math.min(1, a.currentTime / a.duration);
                util.animateBoneMatrix(boneAnimationList, offset, boneHash);
                util.mergeBoneMatrix(bone[0]);
                util.animateSlot(slotAnimationList, offset, slotHash);
                util.calSlot(slot, skinHash, bone, boneHash, texHash);

                if (renderMode === karas.mode.CANVAS) {
                  var sx = shadowRoot.sx,
                      sy = shadowRoot.sy,
                      matrixEvent = shadowRoot.matrixEvent;
                  render.canvasSlot(ctx, sx, sy, matrixEvent, slot, skinHash, texHash);

                  if (self.props.debug) {
                    render.canvasTriangle(ctx, sx, sy, matrixEvent, slot, skinHash, texHash);
                    render.canvasBone(ctx, sx, sy, matrixEvent, bone[0]);
                  } else {
                    if (self.props.debugBone) {
                      render.canvasBone(ctx, sx, sy, matrixEvent, bone[0]);
                    }
                  } // a.pause();

                }
              };
            }
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        return karas.createVd("div", [], [karas.createGm("$line", [["ref", "fake"], ["style", {
          display: 'none'
        }]])]);
      }
    }]);

    return Dragonbones;
  }(karas.Component);

  return Dragonbones;

})));
//# sourceMappingURL=index.js.map
