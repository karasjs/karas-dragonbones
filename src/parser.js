import karas from 'karas';

const { inject, math } = karas;

function parseAndLoadTex(tex, cb, path) {
  let src = path || tex.imagePath;
  let img = document.createElement('img');
  let texHash = {};
  img.onload = function() {
    // 提前设置测量加载此图
    inject.IMG[src] = {
      width: tex.width,
      height: tex.height,
      state: karas.inject.LOADED,
      source: img,
      url: src,
    };
    tex.SubTexture.forEach(item => {
      let { name, x, y, width, height, frameX = 0, frameY = 0, frameWidth = width, frameHeight = height } = item;
      texHash[name] = {
        name,
        x,
        y,
        width,
        height,
        frameX,
        frameY,
        frameWidth,
        frameHeight,
        source: img,
      };
    });
    cb(texHash);
  };
  img.onerror = function() {
    throw new Error('Can not find tex: ' + src);
  };
  img.src = src;
}

function parseSke(ske, texHash) {
  let {
    frameRate: globalFrameRate,
    armature,
  } = ske;
  let {
    bone,
    slot,
    skin,
    frameRate,
    animation,
    defaultActions,
    canvas,
  } = armature[0];
  let boneHash = parseBone(bone);
  let slotHash = parseSlot(slot);
  let skinHash = parseSkin(skin, texHash);
  let animationHash = parseAnimation(animation, frameRate || globalFrameRate || 60, boneHash, slotHash, skinHash);
  return {
    bone,
    boneHash,
    slot,
    slotHash,
    skin: skin[0].slot,
    skinHash,
    animationHash,
    defaultActions,
    canvas,
  };
}

function parseSlot(data) {
  let hash = {};
  data.forEach(item => {
    hash[item.name] = item;
  });
  return hash;
}

function parseBone(data) {
  let hash = {};
  // bone数据形成tree结构，符合dom格式，第一个一定是root
  let root = data[0];
  root.children = [];
  hash[root.name] = root;
  data.forEach((item, i) => {
    let { name, parent, transform = {} } = item;
    if(parent) {
      hash[parent].children.push(item);
    }
    hash[name] = item;
    item.children = [];
    item.index = i;
    // 静态变换样式，可能某个骨骼没动画
    let matrix = [1, 0, 0, 1, 0, 0];
    if(transform.x || transform.y) {
      let m = [1, 0, 0, 1, transform.x || 0, transform.y || 0];
      matrix = math.matrix.multiply(matrix, m);
    }
    if(transform.skX) {
      let d = math.geom.d2r(transform.skX);
      let sin = Math.sin(d);
      let cos = Math.cos(d);
      let m = [cos, sin, -sin, cos, 0, 0];
      matrix = math.matrix.multiply(matrix, m);
    }
    if(transform.scX !== undefined || transform.scY !== undefined) {
      let m = [transform.scX === undefined ? 1 : transform.scX, 0, 0, transform.scY === undefined ? 1 : transform.scY, 0, 0];
      matrix = karas.math.matrix.multiply(matrix, m);
    }
    item.matrix = matrix;
  });
  return hash;
}

function parseSkin(data, texHash) {
  let hash = {};
  data[0].slot.forEach(item => {
    let { name, display } = item;
    hash[name] = item;
    display.forEach(item => {
      let { type, name, path } = item;
      // mesh网格分析三角形
      if(type === 'mesh') {
        let { vertices, triangles, uvs, weights, bonePose } = item;
        let weightHash;
        let bonePoseHash;
        // 有权重则绑定骨骼，坐标系为世界；
        // 没有权重时，完全属于父骨骼，类似普通贴图行为
        if(weights) {
          // 权重格式化hash
          weightHash = {};
          for(let i = 0, len = weights.length, verticesIndex = 0; i < len; i++) {
            let num = weights[i];
            let list = [];
            for(let j = i + 1; j < i + 1 + num * 2; j += 2) {
              let index = weights[j];
              let value = weights[j + 1];
              list.push({
                index,
                value,
              });
            }
            weightHash[verticesIndex++] = list;
            i += num * 2;
          }
          // 骨骼初始pose格式化和世界坐标
          bonePoseHash = {};
          for(let i = 0, len = bonePose.length; i < len; i += 7) {
            let index = bonePose[i];
            let matrix = bonePose.slice(i + 1, i + 7);
            let coords = math.matrix.calPoint([0, 0], matrix);
            bonePoseHash[index] = {
              coords,
              pose: matrix,
            };
          }
        }
        // 顶点格式化，相对于骨骼点的x/y位移差值
        let verticesList = item.verticesList = [];
        for(let i = 0, len = vertices.length; i < len; i += 2) {
          let index = i >> 1;
          let x = vertices[i];
          let y = vertices[i + 1];
          let res = {
            index,
            x,
            y,
          };
          verticesList.push(res);
          // 有添加绑定骨骼才有权重
          if(weightHash) {
            res.weightList = [];
            let weight = weightHash[index];
            weight.forEach(item => {
              let { index, value } = item;
              let { coords, pose } = bonePoseHash[index];
              // 先求骨头的角度，逆向选择至水平后，平移x/y的差值
              let [x0, y0] = math.matrix.calPoint([0, 0], pose);
              let [x1, y1] = math.matrix.calPoint([1, 0], pose);
              let dx = x1 - x0;
              let dy = y1 - y0;
              let theta;
              // 4个象限分开判断
              if(dx >= 0 && dy >= 0) {
                theta = -Math.atan(Math.abs(dy / dx));
              }
              else if(dx < 0 && dy >= 0) {
                theta = -Math.PI + Math.atan(Math.abs(dy / dx));
              }
              else if(dx < 0 && dy < 0) {
                theta = Math.PI - Math.atan(Math.abs(dy / dx));
              }
              else {
                theta = Math.atan(Math.abs(dy / dx));
              }
              let rotate = [Math.cos(theta), Math.sin(theta), -Math.sin(theta), Math.cos(theta), 0, 0];
              let translate = [1, 0, 0, 1, x - coords[0], y - coords[1]];
              let matrix = math.matrix.multiply(rotate, translate);
              res.weightList.push({
                index,
                value,
                matrix,
              });
            });
          }
        }
        // 三角形，切割图片坐标
        let tex = texHash[path || name];
        let { width, height } = tex;
        let triangleList = item.triangleList = [];
        for(let i = 0, len = triangles.length; i < len; i += 3) {
          let i1 = triangles[i];
          let i2 = triangles[i + 1];
          let i3 = triangles[i + 2];
          // uv坐标
          let p1x = uvs[i1 * 2];
          let p1y = uvs[i1 * 2 + 1];
          let p2x = uvs[i2 * 2];
          let p2y = uvs[i2 * 2 + 1];
          let p3x = uvs[i3 * 2];
          let p3y = uvs[i3 * 2 + 1];
          // uv贴图坐标根据尺寸映射真实坐标
          let x1 = p1x * width;
          let y1 = p1y * height;
          let x2 = p2x * width;
          let y2 = p2y * height;
          let x3 = p3x * width;
          let y3 = p3y * height;
          // 从内心往外扩展约0.5px
          let [x0, y0] = math.geom.triangleIncentre(x1, y1, x2, y2, x3, y3);
          let scale = triangleScale(x0, y0, x1, y1, x2, y2, x3, y3, 0.25);
          // 以内心为transformOrigin
          let m = math.matrix.identity();
          m[4] = -x0;
          m[5] = -y0;
          // 缩放
          let t = math.matrix.identity();
          t[0] = t[3] = scale;
          m = math.matrix.multiply(t, m);
          // 移动回去
          t[4] = x0;
          t[5] = y0;
          m = math.matrix.multiply(t, m);
          // 获取扩展后的三角形顶点坐标
          let [sx1, sy1] = math.geom.transformPoint(m, x1, y1);
          let [sx2, sy2] = math.geom.transformPoint(m, x2, y2);
          let [sx3, sy3] = math.geom.transformPoint(m, x3, y3);
          // 三角形所在矩形距离左上角原点的坐标，以此做img切割最小尺寸化，以及变换原点计算
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
            coords: [
              [x1, y1],
              [x2, y2],
              [x3, y3]
            ],
            scale,
            scaleCoords: [
              [sx1, sy1],
              [sx2, sy2],
              [sx3, sy3]
            ],
            width,
            height,
          });
        }
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
function triangleScale(x0, y0, x1, y1, x2, y2, x3, y3, px = 0) {
  // 内心到任意一边的距离
  let a = y2 - y1;
  let b = x1 - x2;
  let c = x2 * y1 - x1 * y2;
  let d = Math.abs(a * x0 + b * y0 + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  return (d + px) / d;
}

/**
 * 获取三角形所在最小矩形的原点坐标、尺寸
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param x3
 * @param y3
 */
function triangleOriginCoords(x1, y1, x2, y2, x3, y3) {
  let xMin = x1;
  let yMin = y1;
  let xMax = x1;
  let yMax = y1;
  xMin = Math.min(xMin, x2);
  xMin = Math.min(xMin, x3);
  yMin = Math.min(yMin, y2);
  yMin = Math.min(yMin, y3);
  xMax = Math.max(xMax, x2);
  xMax = Math.max(xMax, x3);
  yMax = Math.max(yMax, y2);
  yMax = Math.max(yMax, y3);
  return [xMin, yMin, xMax - xMin, yMax - yMin];
}

function parseAnimation(data, frameRate, boneHash, slotHash, skinHash) {
  let hash = {};
  data.forEach(item => {
    let { duration, playTimes, name, bone = [], slot = [], ffd = [] } = item;
    hash[name] = item;
    item.options = {
      duration: 1000 * duration / frameRate,
      iterations: playTimes === 0 ? Infinity : playTimes,
      fill: 'forwards',
    };
    // 骨骼动画列表
    item.boneAnimationList = bone.map(item => {
      let { name, translateFrame, rotateFrame, scaleFrame } = item;
      let { transform: originTransform = {} } = boneHash[name];
      let res = {
        name,
        list: [],
      };
      if(translateFrame) {
        let offsetSum = 0;
        let last;
        let value = translateFrame.map(frame => {
          let { duration: d = 1 } = frame;
          let [easing, easingFn] = getEasing(frame);
          let offset = offsetSum / duration;
          offsetSum += d;
          let { x = 0, y = 0 } = originTransform;
          let res = {
            type: 0,
            translateX: (frame.x || 0) + x,
            translateY: (frame.y || 0) + y,
            offset,
            easing,
            easingFn,
          };
          if(last) {
            last.dx = res.translateX - last.translateX;
            last.dy = res.translateY - last.translateY;
          }
          last = res;
          return res;
        });
        res.list.push(value);
      }
      if(rotateFrame) {
        let offsetSum = 0;
        let last;
        let value = rotateFrame.map(frame => {
          let { duration: d = 1 } = frame;
          let [easing, easingFn] = getEasing(frame);
          let offset = offsetSum / duration;
          offsetSum += d;
          let { skX = 0 } = originTransform;
          let res = {
            type: 1,
            rotateZ: (frame.rotate || 0) + skX,
            offset,
            easing,
            easingFn,
          };
          if(last) {
            last.dz = res.rotateZ - last.rotateZ;
          }
          last = res;
          return res;
        });
        res.list.push(value);
      }
      if(scaleFrame) {
        let offsetSum = 0;
        let last;
        let value = scaleFrame.map(frame => {
          let { duration: d = 1 } = frame;
          let [easing, easingFn] = getEasing(frame);
          let offset = offsetSum / duration;
          offsetSum += d;
          let { scX = 1, scY = 1 } = originTransform;
          let res = {
            type: 2,
            scaleX: (frame.x === undefined ? 1 : frame.x) * scX,
            scaleY: (frame.y === undefined ? 1 : frame.y) * scY,
            offset,
            easing,
            easingFn,
          };
          if(last) {
            last.dx = res.scaleX - last.scaleX;
            last.dy = res.scaleY - last.scaleY;
          }
          last = res;
          return res;
        });
        res.list.push(value);
      }
      return res;
    });
    // 插槽动画列表
    item.slotAnimationList = slot.map(item => {
      let { displayFrame, colorFrame } = item;
      if(displayFrame) {
        let offsetSum = 0;
        displayFrame.forEach(frame => {
          let { duration: d = 1 } = frame;
          let offset = offsetSum / duration;
          offsetSum += d;
          frame.offset = offset;
        });
      }
      if(colorFrame) {
        let offsetSum = 0;
        let last;
        colorFrame.forEach(frame => {
          let { duration: d = 1 } = frame;
          let offset = offsetSum / duration;
          offsetSum += d;
          frame.offset = offset;
          // 没有value就用默认值
          if(!frame.value) {
            frame.value = {
              aM: 100,
            };
          }
          if(frame.value.aM === undefined) {
            frame.value.aM = 100;
          }
          if(last) {
            last.da = frame.value.aM - last.value.aM;
          }
          last = frame;
        });
      }
      return item;
    });
    // 自由变形列表
    let ffdAnimationHash = item.ffdAnimationHash = {};
    item.ffdAnimationList = ffd.map(item => {
      let { name, slot, frame } = item;
      // db限制了不能出现在名字里
      ffdAnimationHash[slot + '>' + name] = item;
      if(frame) {
        let offsetSum = 0;
        let last;
        frame.forEach(frame => {
          let { vertices, duration: d = 1, offset: os } = frame;
          if(os) {
            for(let i = 0; i < os; i++) {
              vertices.unshift(0);
            }
          }
          let offset = offsetSum / duration;
          offsetSum += d;
          frame.offset = offset;
          // 顶点变形数据vertices都是偏移量，无偏移为空
          if(last) {
            let verticesLast = last.vertices;
            if(verticesLast && vertices) {
              last.dv = [];
              for(let i = 0, len = Math.max(verticesLast.length, vertices.length); i < len; i++) {
                last.dv.push((vertices[i] || 0) - (verticesLast[i] || 0));
              }
            }
            else if(verticesLast) {
              last.dv = last.vertices.map(n => -n);
            }
            else if(vertices) {
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
  let curve = frame.curve;
  if(curve) {
    return [
      `(${curve.join(',')})`,
      karas.easing.cubicBezier(curve[0], curve[1], curve[2], curve[3])
    ];
  }
  return ['linear', karas.easing.linear];
}

export default {
  parseAndLoadTex,
  parseSke,
};
