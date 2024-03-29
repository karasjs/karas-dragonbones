(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('karas')) :
  typeof define === 'function' && define.amd ? define(['karas'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Dragonbones = factory(global.karas));
})(this, (function (karas) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var karas__default = /*#__PURE__*/_interopDefaultLegacy(karas);

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
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
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
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
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

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var inject = karas__default["default"].inject,
      math$2 = karas__default["default"].math;

  function parseAndLoadTex(tex, cb) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var src = props.imagePath || tex.imagePath;
    var texHash = {};
    inject.measureImg(src, function () {
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
          name: name,
          x: x,
          y: y,
          width: width,
          height: height,
          frameX: frameX,
          frameY: frameY,
          frameWidth: frameWidth,
          frameHeight: frameHeight,
          source: inject.IMG[src].source
        };
      });
      cb(texHash);
    });
  }

  function parseSke(ske, texHash) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var globalFrameRate = ske.frameRate,
        armature = ske.armature;
    var currentArmature = armature[0];

    if (props.armature) {
      for (var i = 0, len = armature.length; i < len; i++) {
        var item = armature[i];

        if (item.name === props.armature) {
          currentArmature = item;
          break;
        }
      }

      if (!currentArmature) {
        throw new Error('Can not find armature: ' + props.armature);
      }
    }

    if (!currentArmature) {
      console.warn('No armature data');
      return;
    }

    var _currentArmature = currentArmature,
        name = _currentArmature.name,
        bone = _currentArmature.bone,
        slot = _currentArmature.slot,
        skin = _currentArmature.skin,
        frameRate = _currentArmature.frameRate,
        animation = _currentArmature.animation,
        defaultActions = _currentArmature.defaultActions,
        canvas = _currentArmature.canvas;
    var boneHash = parseBone(bone);
    var slotHash = parseSlot(slot);
    var skinHash = parseSkin(skin, texHash, props);
    var animationHash = parseAnimation(animation, frameRate || globalFrameRate || 60, boneHash);
    return {
      name: name,
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

      var matrix = math$2.matrix.identity();

      if (transform.x || transform.y) {
        var m = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, transform.x || 0, transform.y || 0, 0, 1];
        matrix = math$2.matrix.multiply(matrix, m);
      }

      if (transform.skX) {
        var d = math$2.geom.d2r(transform.skX);
        var sin = Math.sin(d);
        var cos = Math.cos(d);
        var _m = [cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        matrix = math$2.matrix.multiply(matrix, _m);
      }

      if (transform.scX !== undefined || transform.scY !== undefined) {
        var _m2 = [transform.scX === undefined ? 1 : transform.scX, 0, 0, 0, 0, transform.scY === undefined ? 1 : transform.scY, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        matrix = karas__default["default"].math.matrix.multiply(matrix, _m2);
      }

      item.matrix = matrix;
    });
    return hash;
  }

  function parseSkin(data, texHash, props) {
    var hash = {};
    data[0].slot.forEach(function (item) {
      var slotName = item.name,
          display = item.display;
      hash[slotName] = item;
      display.forEach(function (item) {
        var type = item.type,
            name = item.name,
            path = item.path; // mesh网格分析三角形

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
                var m = bonePose.slice(_i + 1, _i + 7);
                var matrix = [m[0], m[1], 0, 0, m[2], m[3], 0, 0, 0, 0, 1, 0, m[4], m[5], 0, 1];
                var coords = math$2.matrix.calPoint([0, 0], matrix);
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

                  var _math$matrix$calPoint7 = math$2.matrix.calPoint([0, 0], pose),
                      _math$matrix$calPoint8 = _slicedToArray(_math$matrix$calPoint7, 2),
                      x0 = _math$matrix$calPoint8[0],
                      y0 = _math$matrix$calPoint8[1];

                  var _math$matrix$calPoint9 = math$2.matrix.calPoint([1, 0], pose),
                      _math$matrix$calPoint10 = _slicedToArray(_math$matrix$calPoint9, 2),
                      x1 = _math$matrix$calPoint10[0],
                      y1 = _math$matrix$calPoint10[1];

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

                  var rotate = [Math.cos(theta), Math.sin(theta), 0, 0, -Math.sin(theta), Math.cos(theta), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
                  var translate = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x - coords[0], y - coords[1], 0, 1];
                  var matrix = math$2.matrix.multiply(rotate, translate);
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


            var tex = texHash[path || name];
            var width = tex.width,
                height = tex.height;
            var triangleList = item.triangleList = [];

            for (var i = 0, len = triangles.length; i < len; i += 3) {
              var i1 = triangles[i];
              var i2 = triangles[i + 1];
              var i3 = triangles[i + 2]; // uv坐标

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
              var y3 = p3y * height; // 从内心往外扩展约0.25px，可参数指定

              var _math$geom$triangleIn = math$2.geom.triangleIncentre(x1, y1, x2, y2, x3, y3),
                  _math$geom$triangleIn2 = _slicedToArray(_math$geom$triangleIn, 2),
                  x0 = _math$geom$triangleIn2[0],
                  y0 = _math$geom$triangleIn2[1];

              var px = parseFloat(props.enlarge);

              if (isNaN(px)) {
                px = 0.25;
              } // 单独为slot配置的扩展参数


              if (props.enlargeSlot && props.enlargeSlot.hasOwnProperty(slotName)) {
                var n = parseFloat(props.enlargeSlot[slotName]);

                if (isNaN(n)) {
                  n = 0.25;
                }

                px = n;
              }

              var scale = px ? triangleScale(x0, y0, x1, y1, x2, y2, x3, y3, px) : 1; // 以内心为transformOrigin

              var m = math$2.matrix.identity();
              m[12] = -x0;
              m[13] = -y0; // 缩放

              var t = math$2.matrix.identity();
              t[0] = t[5] = scale;
              m = math$2.matrix.multiply(t, m); // 移动回去

              t[12] = x0;
              t[13] = y0;
              m = math$2.matrix.multiply(t, m); // 获取扩展后的三角形顶点坐标

              var _math$matrix$calPoint = math$2.matrix.calPoint([x1, y1], m),
                  _math$matrix$calPoint2 = _slicedToArray(_math$matrix$calPoint, 2),
                  sx1 = _math$matrix$calPoint2[0],
                  sy1 = _math$matrix$calPoint2[1];

              var _math$matrix$calPoint3 = math$2.matrix.calPoint([x2, y2], m),
                  _math$matrix$calPoint4 = _slicedToArray(_math$matrix$calPoint3, 2),
                  sx2 = _math$matrix$calPoint4[0],
                  sy2 = _math$matrix$calPoint4[1];

              var _math$matrix$calPoint5 = math$2.matrix.calPoint([x3, y3], m),
                  _math$matrix$calPoint6 = _slicedToArray(_math$matrix$calPoint5, 2),
                  sx3 = _math$matrix$calPoint6[0],
                  sy3 = _math$matrix$calPoint6[1]; // 三角形所在矩形距离左上角原点的坐标，以此做img切割最小尺寸化，以及变换原点计算
              // let [ox, oy, ow, oh] = triangleOriginCoords(sx1, sy1, sx2, sy2, sx3, sy3);


              triangleList.push({
                index: Math.round(i / 3),
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
          slot = _item$slot === void 0 ? [] : _item$slot,
          _item$ffd = item.ffd,
          ffd = _item$ffd === void 0 ? [] : _item$ffd;
      hash[name] = item;
      item.options = {
        duration: 1000 * duration / frameRate,
        iterations: playTimes === 0 ? Infinity : playTimes,
        fill: 'forwards'
      }; // 骨骼动画列表

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
            var easingFn = getEasing(frame);
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
            var easingFn = getEasing(frame);
            var offset = _offsetSum / duration;
            _offsetSum += d;
            var _originTransform$skX = originTransform.skX,
                skX = _originTransform$skX === void 0 ? 0 : _originTransform$skX;
            var res = {
              type: 1,
              rotateZ: (frame.rotate || 0) + skX,
              offset: offset,
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
            var easingFn = getEasing(frame);
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
      }); // 插槽动画列表

      item.slotAnimationList = slot.map(function (item) {
        var displayFrame = item.displayFrame,
            colorFrame = item.colorFrame;

        if (displayFrame) {
          var offsetSum = 0;
          displayFrame.forEach(function (frame) {
            var _frame$duration4 = frame.duration,
                d = _frame$duration4 === void 0 ? 1 : _frame$duration4;
            var offset = offsetSum / duration;
            offsetSum += d;
            frame.offset = offset;
          });
        }

        if (colorFrame) {
          var _offsetSum3 = 0;
          var last;
          colorFrame.forEach(function (frame) {
            var _frame$duration5 = frame.duration,
                d = _frame$duration5 === void 0 ? 1 : _frame$duration5;
            frame.easingFn = getEasing(frame);
            var offset = _offsetSum3 / duration;
            _offsetSum3 += d;
            frame.offset = offset; // 没有value就用默认值

            if (!frame.value) {
              frame.value = {
                aM: 100
              };
            }

            if (frame.value.aM === undefined) {
              frame.value.aM = 100;
            }

            if (last) {
              last.da = frame.value.aM - last.value.aM;
            }

            last = frame;
          });
        }

        return item;
      }); // 自由变形列表

      var ffdAnimationHash = item.ffdAnimationHash = {};
      item.ffdAnimationList = ffd.map(function (item) {
        var name = item.name,
            slot = item.slot,
            frame = item.frame; // db限制了不能出现在名字里

        ffdAnimationHash[slot + '>' + name] = item;

        if (frame) {
          var offsetSum = 0;
          var last;
          frame.forEach(function (frame) {
            var vertices = frame.vertices,
                _frame$duration6 = frame.duration,
                d = _frame$duration6 === void 0 ? 1 : _frame$duration6,
                os = frame.offset;
            frame.easingFn = getEasing(frame);

            if (vertices) {
              for (var i = 0; i < os; i++) {
                vertices.unshift(0);
              }
            }

            var offset = offsetSum / duration;
            offsetSum += d;
            frame.offset = offset; // 顶点变形数据vertices都是偏移量，无偏移为空

            if (last) {
              var verticesLast = last.vertices;

              if (verticesLast && vertices) {
                last.dv = [];

                for (var _i3 = 0, len = Math.max(verticesLast.length, vertices.length); _i3 < len; _i3++) {
                  last.dv.push((vertices[_i3] || 0) - (verticesLast[_i3] || 0));
                }
              } else if (verticesLast) {
                last.dv = last.vertices.map(function (n) {
                  return -n;
                });
              } else if (vertices) {
                last.dv = vertices;
              }
            }

            last = frame;
          });
        }

        return item;
      });
    });
    return hash;
  }

  function getEasing(frame) {
    var curve = frame.curve;

    if (curve && curve[0] !== 1 && curve[1] !== 1 && curve[2] !== 0 && curve[3] !== 0) {
      return karas__default["default"].animate.easing.cubicBezier(curve[0], curve[1], curve[2], curve[3]);
    }
  }

  var parser = {
    parseAndLoadTex: parseAndLoadTex,
    parseSke: parseSke
  };

  var math$1 = karas__default["default"].math;
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

        if (!len) {
          return;
        }

        var type = frames[0].type;
        var i = binarySearch(0, len - 1, offset, frames);
        var current = frames[i];
        var easingFn = current.easingFn; // 是否最后一帧

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

          if (easingFn) {
            percent = easingFn(percent);
          }

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
      var matrix = math$1.matrix.identity();

      if (res.translateX || res.translateY) {
        var m = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, res.translateX || 0, res.translateY || 0, 0, 1];
        matrix = math$1.matrix.multiply(matrix, m);
      }

      if (res.rotateZ) {
        var d = math$1.geom.d2r(res.rotateZ);
        var sin = Math.sin(d);
        var cos = Math.cos(d);
        var _m = [cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        matrix = math$1.matrix.multiply(matrix, _m);
      }

      if (res.scaleX !== undefined || res.scaleY !== undefined) {
        var _m2 = [res.scaleX === undefined ? 1 : res.scaleX, 0, 0, 0, 0, res.scaleY === undefined ? 1 : res.scaleY, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        matrix = math$1.matrix.multiply(matrix, _m2);
      }

      bone.matrixA = matrix;
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
    root.currentMatrix = root.matrixA || root.matrix;
    root.children.forEach(function (item) {
      mergeChildBoneMatrix(item, root.currentMatrix);
    });
  }

  function mergeChildBoneMatrix(bone, parentMatrix) {
    bone.currentMatrix = math$1.matrix.multiply(parentMatrix, bone.matrixA || bone.matrix);
    bone.children.forEach(function (item) {
      mergeChildBoneMatrix(item, bone.currentMatrix);
    });
  }
  /**
   * 根据当前动画时间执行slot的动画，确定显示slot下的皮肤索引和透明度
   * @param slotAnimationList
   * @param offset
   * @param slotHash
   */


  function animateSlot(slotAnimationList, offset, slotHash) {
    slotAnimationList.forEach(function (item) {
      var name = item.name,
          displayFrame = item.displayFrame,
          colorFrame = item.colorFrame;
      var slot = slotHash[name];

      if (displayFrame) {
        if (displayFrame.length) {
          var i = binarySearch(0, displayFrame.length - 1, offset, displayFrame);
          var _displayFrame$i$value = displayFrame[i].value,
              value = _displayFrame$i$value === void 0 ? 0 : _displayFrame$i$value;
          slot.displayIndexA = value;
        }
      }

      if (colorFrame) {
        var len = colorFrame.length;

        if (len) {
          var _i = binarySearch(0, len - 1, offset, colorFrame);

          var current = colorFrame[_i];
          var easingFn = current.easing; // 是否最后一帧

          if (_i === len - 1) {
            slot.colorA = current.value;
          } else {
            var next = colorFrame[_i + 1];
            var total = next.offset - current.offset;
            var percent = (offset - current.offset) / total;

            if (easingFn) {
              percent = easingFn(percent);
            }

            slot.colorA = {
              aM: current.value.aM + current.da * percent
            };
          }
        }
      }
    });
  }
  /**
   * 根据当前骨骼状态计算slot中显示对象变换matrix
   * @param offset
   * @param slot
   * @param skinHash
   * @param bone
   * @param boneHash
   * @param texHash
   * @param ffdAnimationHash
   */


  function calSlot(offset, slot, skinHash, bone, boneHash, texHash, ffdAnimationHash) {
    slot.forEach(function (item) {
      var name = item.name,
          parent = item.parent,
          _item$displayIndex = item.displayIndex,
          displayIndex = _item$displayIndex === void 0 ? 0 : _item$displayIndex,
          _item$displayIndexA = item.displayIndexA,
          displayIndexA = _item$displayIndexA === void 0 ? displayIndex : _item$displayIndexA; // 插槽隐藏不显示

      if (displayIndexA < 0) {
        return;
      }

      var skin = skinHash[name];
      var displayTarget = skin.display[displayIndexA]; // 网格类型

      if (displayTarget.type === 'mesh') {
        var verticesList = displayTarget.verticesList,
            triangleList = displayTarget.triangleList; // 先进行顶点变换

        verticesList.forEach(function (item) {
          var weightList = item.weightList; // 有绑定骨骼的mesh，计算权重

          if (weightList) {
            var m = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            weightList.forEach(function (weight) {
              var index = weight.index,
                  value = weight.value,
                  matrix = weight.matrix;
              var boneMatrix = bone[index].currentMatrix;
              var offset = karas__default["default"].math.matrix.multiply(boneMatrix, matrix);

              for (var i = 0; i < 16; i++) {
                m[i] += offset[i] * value;
              }
            });
            item.matrix = m;
          } // 没有绑定认为直属父骨骼
          else {
            var parentBoneMatrix = boneHash[parent].currentMatrix;
            var offsetMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, item.x, item.y, 0, 1];

            var _m3 = karas__default["default"].math.matrix.multiply(parentBoneMatrix, offsetMatrix);

            item.matrix = _m3;
          } // 每次先清空ffd自由变换的数据


          item.matrixF = null;
        }); // 如果有ffd自定义顶点变换，计算偏移量matrix

        var ffd = ffdAnimationHash[name + '>' + (displayTarget.path || displayTarget.name)];

        if (ffd) {
          var frame = ffd.frame;

          if (frame) {
            var len = frame.length;
            var i = binarySearch(0, len - 1, offset, frame);
            var current = frame[i];
            var easingFn = current.easingFn; // 是否最后一帧

            if (i === len - 1) {
              var vertices = current.vertices;

              if (vertices) {
                for (var _i2 = 0, _len = vertices.length; _i2 < _len - 1; _i2 += 2) {
                  var x = vertices[_i2];
                  var y = vertices[_i2 + 1];

                  if (x === 0 && y === 0) {
                    continue;
                  }

                  var index = _i2 >> 1;
                  var target = verticesList[index];
                  var m = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, 0, 1];
                  target.matrixF = math$1.matrix.multiply(target.matrix, m);
                }
              }
            } else {
              var next = frame[i + 1];
              var total = next.offset - current.offset;
              var percent = (offset - current.offset) / total;

              if (easingFn) {
                percent = easingFn(percent);
              }

              var _vertices = current.vertices,
                  dv = current.dv;

              if (_vertices || dv) {
                var _len2 = 0;

                if (_vertices) {
                  _len2 = _vertices.length;
                }

                if (dv) {
                  _len2 = Math.max(_len2, dv.length);
                }

                for (var _i3 = 0; _i3 < _len2 - 1; _i3 += 2) {
                  var _x = void 0,
                      _y = void 0;

                  if (_vertices) {
                    _x = _vertices[_i3] || 0;
                    _y = _vertices[_i3 + 1] || 0;
                  } else {
                    _x = _y = 0;
                  }

                  if (dv) {
                    _x += (dv[_i3] || 0) * percent;
                    _y += (dv[_i3 + 1] || 0) * percent;
                  }

                  if (_x === 0 && _y === 0) {
                    continue;
                  }

                  var _index = _i3 >> 1;

                  var _target = verticesList[_index];
                  var _m4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, _x, _y, 0, 1];
                  _target.matrixF = math$1.matrix.multiply(_target.matrix, _m4);
                }
              }
            }
          }
        } // 三角形根据顶点坐标变化计算仿射变换matrix


        triangleList.forEach(function (item) {
          var indexList = item.indexList,
              coords = item.coords;
          var source = coords[0].concat(coords[1]).concat(coords[2]);
          var target = [];
          indexList.forEach(function (i) {
            var vertices = verticesList[i];
            var coords = math$1.matrix.calPoint([0, 0], vertices.matrixF || vertices.matrix);
            target = target.concat(coords.slice(0, 2));
          }); // 先交换确保3个点顺序

          var _math$tar$exchangeOrd = math$1.tar.exchangeOrder(source, target),
              _math$tar$exchangeOrd2 = _slicedToArray(_math$tar$exchangeOrd, 2),
              source1 = _math$tar$exchangeOrd2[0],
              target1 = _math$tar$exchangeOrd2[1];

          var matrix = math$1.tar.transform(source1, target1);
          item.matrix = matrix;
        });
      } // 默认图片类型
      else {
        var _displayTarget$transf = displayTarget.transform,
            transform = _displayTarget$transf === void 0 ? {} : _displayTarget$transf;
        var tex = texHash[displayTarget.path || displayTarget.name];
        var parentBoneMatrix = boneHash[parent].currentMatrix;
        var matrix = math$1.matrix.identity(); // 图片本身形变，因中心点在图片本身中心，所以无论是否有translate都要平移

        var t = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, (transform.x || 0) - tex.frameWidth * 0.5, (transform.y || 0) - tex.frameHeight * 0.5, 0, 1];
        matrix = math$1.matrix.multiply(matrix, t); // 可选旋转

        if (transform.skX) {
          var d = math$1.geom.d2r(transform.skX);
          var sin = Math.sin(d);
          var cos = Math.cos(d);
          var _t = [cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
          matrix = math$1.matrix.multiply(matrix, _t);
        } // 可选缩放


        if (transform.scX !== undefined || transform.scY !== undefined) {
          var _t2 = [transform.scX === undefined ? 1 : transform.scX, 0, 0, 0, 0, transform.scY === undefined ? 1 : transform.scY, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
          matrix = math$1.matrix.multiply(matrix, _t2);
        } // tfo为图片中心，可合并


        t = math$1.matrix.identity();
        t[12] = tex.frameWidth * 0.5;
        t[13] = tex.frameHeight * 0.5;
        matrix = math$1.matrix.multiply(t, matrix);
        t = math$1.matrix.identity();
        t[12] = -tex.frameWidth * 0.5;
        t[13] = -tex.frameHeight * 0.5;
        matrix = math$1.matrix.multiply(matrix, t);
        matrix = math$1.matrix.multiply(parentBoneMatrix, matrix);
        displayTarget.matrix = matrix;
      }
    });
  }

  function clearAnimation(bone, slot) {
    bone.forEach(function (item) {
      delete item.matrixA;
    });
    slot.forEach(function (item) {
      delete item.displayIndexA;
      delete item.colorA;
    });
  }

  var util = {
    animateBoneMatrix: animateBoneMatrix,
    mergeBoneMatrix: mergeBoneMatrix,
    animateSlot: animateSlot,
    calSlot: calSlot,
    clearAnimation: clearAnimation
  };

  var math = karas__default["default"].math;

  function canvasBone(ctx, matrixEvent, bone, dx, dy) {
    var length = bone.length,
        children = bone.children,
        currentMatrix = bone.currentMatrix;
    var m = math.matrix.multiply(matrixEvent, currentMatrix);
    ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.arc(dx, dy, 5, 0, Math.PI * 2);
    ctx.moveTo(dx, dy);
    ctx.lineTo((length || 5) + dx, dy);
    ctx.closePath();
    ctx.stroke();
    children.forEach(function (item) {
      canvasBone(ctx, matrixEvent, item, dx, dy);
    });
  }

  function canvasSlot(ctx, matrixEvent, slot, skinHash, texHash, dx, dy) {
    slot.forEach(function (item) {
      var name = item.name,
          _item$displayIndex = item.displayIndex,
          displayIndex = _item$displayIndex === void 0 ? 0 : _item$displayIndex,
          _item$displayIndexA = item.displayIndexA,
          displayIndexA = _item$displayIndexA === void 0 ? displayIndex : _item$displayIndexA,
          blendMode = item.blendMode,
          _item$color = item.color,
          color = _item$color === void 0 ? {} : _item$color,
          _item$colorA = item.colorA,
          colorA = _item$colorA === void 0 ? color : _item$colorA; // 插槽隐藏不显示

      if (displayIndexA < 0) {
        return;
      } // 叠加模式


      if (blendMode === 'add') {
        ctx.globalCompositeOperation = 'lighter';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      var _colorA$aM = colorA.aM,
          aM = _colorA$aM === void 0 ? 100 : _colorA$aM;
      var opacity = ctx.globalAlpha; // 透明度

      ctx.globalAlpha *= aM / 100;
      var skin = skinHash[name];
      var displayTarget = skin.display[displayIndexA];
      var tex = texHash[displayTarget.path || displayTarget.name]; // 网格类型

      if (displayTarget.type === 'mesh') {
        var triangleList = displayTarget.triangleList;
        triangleList.forEach(function (item) {
          var matrix = item.matrix,
              scaleCoords = item.scaleCoords;
          matrix = math.matrix.multiply(matrixEvent, matrix); // clip绘制

          ctx.save();
          ctx.setTransform(matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]);
          ctx.beginPath();
          ctx.moveTo(scaleCoords[0][0] + dx, scaleCoords[0][1] + dy);
          ctx.lineTo(scaleCoords[1][0] + dx, scaleCoords[1][1] + dy);
          ctx.lineTo(scaleCoords[2][0] + dx, scaleCoords[2][1] + dy);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(tex.source, -tex.x - tex.frameX + dx, -tex.y - tex.frameY + dy);
          ctx.restore();
        });
      } // 默认图片类型
      else {
        var matrix = displayTarget.matrix;

        if (matrix[0] === 0 || matrix[5] === 0) {
          return;
        }

        matrix = math.matrix.multiply(matrixEvent, matrix); // clip绘制

        ctx.save();
        ctx.setTransform(matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]);
        ctx.beginPath();
        ctx.moveTo(-tex.frameX + dx, -tex.frameY + dy);
        ctx.lineTo(-tex.frameX + tex.width + dx, -tex.frameY + dy);
        ctx.lineTo(-tex.frameX + tex.width + dx, -tex.frameY + tex.height + dy);
        ctx.lineTo(-tex.frameX + dx, -tex.frameY + tex.height + dy);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(tex.source, -tex.x - tex.frameX + dx, -tex.y - tex.frameY + dy);
        ctx.restore();
      } // 恢复模式


      if (blendMode) {
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.globalAlpha = opacity;
    });
  }

  function canvasTriangle(ctx, matrixEvent, slot, skinHash, texHash, dx, dy) {
    slot.forEach(function (item) {
      var name = item.name,
          _item$displayIndex2 = item.displayIndex,
          displayIndex = _item$displayIndex2 === void 0 ? 0 : _item$displayIndex2,
          _item$displayIndexA2 = item.displayIndexA,
          displayIndexA = _item$displayIndexA2 === void 0 ? displayIndex : _item$displayIndexA2; // 插槽隐藏不显示

      if (displayIndexA < 0) {
        return;
      }

      var skin = skinHash[name];
      var displayTarget = skin.display[displayIndexA];
      var tex = texHash[displayTarget.path || displayTarget.name]; // 网格类型

      if (displayTarget.type === 'mesh') {
        var verticesList = displayTarget.verticesList,
            triangleList = displayTarget.triangleList;
        triangleList.forEach(function (item) {
          var matrix = item.matrix,
              scaleCoords = item.scaleCoords;
          matrix = math.matrix.multiply(matrixEvent, matrix);
          ctx.setTransform(matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]);
          ctx.strokeStyle = '#39F';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(scaleCoords[0][0] + dx, scaleCoords[0][1] + dy);
          ctx.lineTo(scaleCoords[1][0] + dx, scaleCoords[1][1] + dy);
          ctx.lineTo(scaleCoords[2][0] + dx, scaleCoords[2][1] + dy);
          ctx.closePath();
          ctx.stroke();
        });
        verticesList.forEach(function (item) {
          var matrix = item.matrix,
              matrixF = item.matrixF;
          matrix = math.matrix.multiply(matrixEvent, matrixF || matrix);
          ctx.setTransform(matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]);
          ctx.fillStyle = '#0D6';
          ctx.beginPath();
          ctx.arc(dx, dy, 4, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        });
      } // 默认图片类型
      else {
        var matrix = displayTarget.matrix;
        matrix = math.matrix.multiply(matrixEvent, matrix);
        ctx.save();
        ctx.setTransform(matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]);
        ctx.strokeStyle = '#F90';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dx, dy);
        ctx.lineTo(tex.frameWidth + dx, dy);
        ctx.lineTo(tex.frameWidth + dx, tex.frameHeight + dy);
        ctx.lineTo(dx, tex.frameHeight + dy);
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = 'rgba(172, 0, 172, 0.5)';
        ctx.beginPath();
        ctx.moveTo(-tex.frameX + dx, -tex.frameY + dy);
        ctx.lineTo(-tex.frameX + tex.width + dx, -tex.frameY + dy);
        ctx.lineTo(-tex.frameX + tex.width + dx, -tex.frameY + tex.height + dy);
        ctx.lineTo(-tex.frameX + dx, -tex.frameY + tex.height + dy);
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

  var version = "0.7.0";

  var uuid = 0;
  var SHARE_CACHE = {};
  var _karas$enums$STYLE_KE = karas__default["default"].enums.STYLE_KEY,
      DISPLAY = _karas$enums$STYLE_KE.DISPLAY,
      VISIBILITY = _karas$enums$STYLE_KE.VISIBILITY,
      OPACITY = _karas$enums$STYLE_KE.OPACITY,
      MARGIN_LEFT = _karas$enums$STYLE_KE.MARGIN_LEFT,
      PADDING_LEFT = _karas$enums$STYLE_KE.PADDING_LEFT,
      BORDER_LEFT_WIDTH = _karas$enums$STYLE_KE.BORDER_LEFT_WIDTH,
      MARGIN_TOP = _karas$enums$STYLE_KE.MARGIN_TOP,
      PADDING_TOP = _karas$enums$STYLE_KE.PADDING_TOP,
      BORDER_TOP_WIDTH = _karas$enums$STYLE_KE.BORDER_TOP_WIDTH,
      WIDTH = _karas$enums$STYLE_KE.WIDTH,
      HEIGHT = _karas$enums$STYLE_KE.HEIGHT;

  var Dragonbones = /*#__PURE__*/function (_karas$Component) {
    _inherits(Dragonbones, _karas$Component);

    function Dragonbones() {
      return _karas$Component.apply(this, arguments) || this;
    }

    _createClass(Dragonbones, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.init();
      }
    }, {
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate(nextProps) {
        var props = this.props;

        if (nextProps !== props) {
          if (nextProps.ske !== props.ske || nextProps.tex !== props.tex || nextProps.enlarge !== props.enlarge || nextProps.enlargeSlot !== props.enlargeSlot && !karas__default["default"].util.equal(nextProps.enlargeSlot, props.enlargeSlot)) {
            this.init();
          } else {
            if (nextProps.armature !== props.armature) {
              this.armature(nextProps.armature, props);
            } else {
              if (nextProps.action !== props.action) {
                this.action(nextProps.action);
              }

              if (nextProps.imagePath !== props.imagePath) {
                this.changeImage(nextProps.imagePath);
              }

              if (nextProps.playbackRate !== props.playbackRate && this.animation) {
                this.animation.playbackRate = nextProps.playbackRate;
              }

              if (nextProps.fps !== props.fps && this.animation) {
                this.animation.fps = nextProps.fps;
              }
            }
          }
        }

        return false;
      }
    }, {
      key: "init",
      value: function init() {
        var _this = this;

        var props = this.props;
        var ske = props.ske,
            tex = props.tex;
        var total = 0;

        if (karas__default["default"].util.isString(ske)) {
          total++;
          props.loadJson(ske, function (res) {
            total--;
            ske = res;

            _this.build(total, ske, tex);
          });
        }

        if (karas__default["default"].util.isString(tex)) {
          total++;
          props.loadJson(tex, function (res) {
            total--;
            tex = res;

            _this.build(total, ske, tex);
          });
        }

        this.build(total, ske, tex);
      }
    }, {
      key: "build",
      value: function build(count, ske, tex) {
        var _this2 = this;

        if (count !== 0) {
          return;
        }

        var props = this.props;
        this.staticCacheFlag = !!props.staticCache;
        this.staticCacheHash = {};
        ske.uuid = ske.uuid || ++uuid;

        if (ske.version !== '5.5') {
          throw new Error('The version' + ske.version + ' does not match 5.5');
        }

        this.ske = karas__default["default"].util.clone(ske);
        this.tex = karas__default["default"].util.clone(tex);
        parser.parseAndLoadTex(this.tex, function (texHash) {
          _this2.texHash = texHash;

          _this2.armature(props.armature, props);
        }, props);
      }
    }, {
      key: "armature",
      value: function armature(name) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var op = karas__default["default"].util.extend({}, options);
        op.armature = name;

        var _parser$parseSke = parser.parseSke(this.ske, this.texHash, op),
            n = _parser$parseSke.name,
            bone = _parser$parseSke.bone,
            boneHash = _parser$parseSke.boneHash,
            slot = _parser$parseSke.slot,
            slotHash = _parser$parseSke.slotHash,
            skin = _parser$parseSke.skin,
            skinHash = _parser$parseSke.skinHash,
            animationHash = _parser$parseSke.animationHash,
            defaultActions = _parser$parseSke.defaultActions,
            canvas = _parser$parseSke.canvas;

        this.armatureName = n;
        this.bone = bone;
        this.boneHash = boneHash;
        this.slot = slot;
        this.slotHash = slotHash;
        this.skin = skin;
        this.skinHash = skinHash;
        this.animationHash = animationHash;
        this.canvas = canvas;
        var defaultAction;

        if (options.action && animationHash[options.action]) {
          var key = options.pause ? 'gotoAndStop' : 'gotoAndPlay';
          defaultAction = _defineProperty({}, key, options.action);
        } // 不存在或没有指定使用ske文件的第一个
        else if (defaultActions && defaultActions.length) {
          defaultAction = defaultActions[0];
        }

        if (defaultAction) {
          var a = this.action(defaultAction.gotoAndPlay || defaultAction.gotoAndStop);

          if (options.pause || defaultAction.gotoAndStop) {
            a.gotoAndStop(0);
          }

          return a;
        } else {
          console.warn('No action data');
        }
      }
    }, {
      key: "action",
      value: function action(name) {
        this.actionName = name;
        var animation = this.animationHash[name];

        if (!animation) {
          throw new Error('Can not find animation: ' + name);
        } // 清除上次动画的影响


        if (this.animation) {
          util.clearAnimation(this.bone, this.slot);
        }

        var boneAnimationList = animation.boneAnimationList,
            slotAnimationList = animation.slotAnimationList,
            ffdAnimationHash = animation.ffdAnimationHash,
            options = animation.options;

        if (!karas__default["default"].util.isNil(this.props.playbackRate)) {
          options.playbackRate = this.props.playbackRate;
        }

        if (!karas__default["default"].util.isNil(this.props.fps)) {
          options.fps = this.props.fps;
        } // 隐藏节点模拟一段不展示的动画，带动每次渲染


        var fake = this.ref.fake;
        fake.clearAnimate();
        var a = this.animation = fake.animate([{
          backgroundColor: '#000'
        }, {
          backgroundColor: '#FFF'
        }], options); // 劫持隐藏节点渲染，因本身display:none可以不执行原本逻辑，计算并渲染骨骼动画

        var self = this;
        var computedStyle = self.shadowRoot.computedStyle;
        var root = self.root;
        var width = root.width;
        var height = root.height;

        fake.render = function (renderMode, ctx) {
          var dx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
          var dy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

          if (computedStyle[DISPLAY] === 'none' || computedStyle[VISIBILITY] === 'hidden' || computedStyle[OPACITY] === 0) {
            return;
          } // 开启了静态帧优化优先使用缓存


          var offScreen;
          var sourceCtx;
          var staticKey;

          if (self.staticCacheFlag) {
            offScreen = karas__default["default"].inject.getCacheCanvas(width, height);
            sourceCtx = ctx;
            ctx = offScreen.ctx;
            var frame = Math.floor(a.currentTime * (self.fps || 60) / 1000); // ske文件uuid + 骨架名 + 动画名 + 帧数

            staticKey = self.ske.uuid + '>' + self.armatureName + '>' + self.actionName + '>' + frame;
            var ca = self.staticCacheHash[staticKey];

            if (ca) {
              ctx.putImageData(ca, 0, 0);
              offScreen.draw(ctx);
              sourceCtx.drawImage(offScreen.canvas, 0, 0);
              ctx.clearRect(0, 0, width, height);
              return;
            }
          }

          var bone = self.bone,
              slot = self.slot,
              boneHash = self.boneHash,
              slotHash = self.slotHash,
              skinHash = self.skinHash,
              texHash = self.texHash; // 动态情况缓存当前帧，为多个实例节省计算

          var dynamicKey = self.ske.uuid + '>' + self.armatureName + '>' + self.actionName;
          var dynamicCache = SHARE_CACHE[dynamicKey];

          if (self.props.share && dynamicCache && dynamicCache.currentTime === a.currentTime) {
            bone = dynamicCache.bone;
            slot = dynamicCache.slot;
            skinHash = dynamicCache.skinHash;
          } else {
            var offset = Math.min(1, a.currentTime / a.duration);
            util.animateBoneMatrix(boneAnimationList, offset, boneHash);
            util.mergeBoneMatrix(bone[0]);
            util.animateSlot(slotAnimationList, offset, slotHash);
            util.calSlot(offset, slot, skinHash, bone, boneHash, texHash, ffdAnimationHash);
            SHARE_CACHE[dynamicKey] = {
              bone: bone,
              slot: slot,
              skinHash: skinHash,
              currentTime: a.currentTime
            };
          }

          if (renderMode === karas__default["default"].mode.CANVAS) {
            var matrixEvent = self.shadowRoot.matrixEvent; // 先在dom中居中

            var left = computedStyle[MARGIN_LEFT] + computedStyle[BORDER_LEFT_WIDTH] + computedStyle[PADDING_LEFT] + computedStyle[WIDTH] * 0.5;
            var top = computedStyle[MARGIN_TOP] + computedStyle[BORDER_TOP_WIDTH] + computedStyle[PADDING_TOP] + computedStyle[HEIGHT] * 0.5;
            var t = karas__default["default"].math.matrix.identity();
            t[12] = left;
            t[13] = top; // 画布居中

            if (self.canvas) {
              var _dx = self.canvas.x || 0;

              var _dy = self.canvas.y || 0;

              t[12] -= _dx * 0.5;
              t[13] -= _dy * 0.5; // 适配尺寸

              if (self.props.fitSize) {
                var sx = computedStyle.width / self.canvas.width;
                var sy = computedStyle.height / self.canvas.height;
                t[0] = sx;
                t[5] = sy;
              }
            }

            matrixEvent = karas__default["default"].math.matrix.multiply(matrixEvent, t);
            render.canvasSlot(ctx, matrixEvent, slot, skinHash, texHash, dx, dy); // debug模式

            if (self.props.debug) {
              render.canvasTriangle(ctx, matrixEvent, slot, skinHash, texHash, dx, dy);
              render.canvasBone(ctx, matrixEvent, bone[0], dx, dy);
            } else {
              if (self.props.debugBone) {
                render.canvasBone(ctx, matrixEvent, bone[0], dx, dy);
              }

              if (self.props.debugSlot) {
                render.canvasTriangle(ctx, matrixEvent, slot, skinHash, texHash, dx, dy);
              }
            } // 静态帧优化将离屏内容绘入


            if (self.staticCacheFlag) {
              offScreen.draw(ctx);
              sourceCtx.drawImage(offScreen.canvas, 0, 0);
              self.staticCacheHash[staticKey] = ctx.getImageData(0, 0, width, height);
              ctx.clearRect(0, 0, width, height);
            }
          }
        };

        return a;
      }
    }, {
      key: "changeImage",
      value: function changeImage(src) {
        if (src) {
          var tex = this.tex;
          tex.imagePath = src;
          var texHash = this.texHash;
          karas__default["default"].inject.measureImg(src, function () {
            tex.SubTexture.forEach(function (item) {
              var name = item.name;
              texHash[name].source = karas__default["default"].inject.IMG[src].source;
            });
          });
        }
      }
    }, {
      key: "setStaticCache",
      value: function setStaticCache(flag) {
        this.staticCacheFlag = !!flag;
      }
    }, {
      key: "cleanStaticCache",
      value: function cleanStaticCache() {
        this.staticCacheHash = {};
      }
    }, {
      key: "render",
      value: function render() {
        return karas__default["default"].createElement("div", null, karas__default["default"].createElement("$polyline", {
          ref: "fake"
        }));
      }
    }]);

    return Dragonbones;
  }(karas__default["default"].Component);

  Dragonbones.version = version;

  return Dragonbones;

}));
//# sourceMappingURL=index.js.map
