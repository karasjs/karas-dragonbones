import karas from 'karas';

const { math } = karas;

/**
 * 根据动画时间状态修改骨骼当前matrix
 * @param animationList 动画列表
 * @param offset 当前时间偏移量
 * @param boneHash 骨骼hash
 */
function animateBoneMatrix(animationList, offset, boneHash) {
  animationList.forEach(item => {
    let { name, list } = item;
    let bone = boneHash[name];
    // 先以静态变换样式为基础
    let { transform = {} } = bone;
    let res = {};
    res.translateX = transform.x || 0;
    res.translateY = transform.y || 0;
    res.rotateZ = transform.skX || 0;
    res.scaleX = transform.scX === undefined ? 1 : transform.scX;
    res.scaleY = transform.scY === undefined ? 1 : transform.scY;
    // 再assign动画中的变换样式
    list.forEach(frames => {
      let len = frames.length;
      let type = frames[0].type;
      let i = binarySearch(0, len - 1, offset, frames);
      let current = frames[i];
      // 是否最后一帧
      if(i === len - 1) {
        if(type === 0) {
          res.translateX = current.translateX;
          res.translateY = current.translateY;
        }
        else if(type === 1) {
          res.rotateZ = current.rotateZ;
        }
        else if(type === 2) {
          res.scaleX = current.scaleX;
          res.scaleY = current.scaleY;
        }
      }
      else {
        let next = frames[i + 1];
        let total = next.offset - current.offset;
        let percent = (offset - current.offset) / total;
        if(type === 0) {
          res.translateX = current.translateX + current.dx * percent;
          res.translateY = current.translateY + current.dy * percent;
        }
        else if(type === 1) {
          res.rotateZ = current.rotateZ + current.dz * percent;
        }
        else if(type === 2) {
          res.scaleX = current.scaleX + current.dx * percent;
          res.scaleY = current.scaleY + current.dy * percent;
        }
      }
    });
    let matrix = [1, 0, 0, 1, 0, 0];
    if(res.translateX || res.translateY) {
      let m = [1, 0, 0, 1, res.translateX || 0, res.translateY || 0];
      matrix = math.matrix.multiply(matrix, m);
    }
    if(res.rotateZ) {
      let d = math.geom.d2r(res.rotateZ);
      let sin = Math.sin(d);
      let cos = Math.cos(d);
      let m = [cos, sin, -sin, cos, 0, 0];
      matrix = math.matrix.multiply(matrix, m);
    }
    if(res.scaleX !== undefined || res.scaleY !== undefined) {
      let m = [res.scaleX === undefined ? 1 : res.scaleX, 0, 0, res.scaleY === undefined ? 1 : res.scaleY, 0, 0];
      matrix = math.matrix.multiply(matrix, m);
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
  if(i === j) {
    let frame = frames[i];
    if(frame.offset > offset) {
      return i - 1;
    }
    return i;
  }
  else {
    let middle = i + ((j - i) >> 1);
    let frame = frames[middle];
    if(frame.offset === offset) {
      return middle;
    }
    else if(frame.offset > offset) {
      return binarySearch(i, Math.max(middle - 1, i), offset, frames);
    }
    else {
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
  root.children.forEach(item => {
    mergeChildBoneMatrix(item, root.currentMatrix);
  });
}

function mergeChildBoneMatrix(bone, parentMatrix) {
  bone.currentMatrix = math.matrix.multiply(parentMatrix, bone.matrix);
  bone.children.forEach(item => {
    mergeChildBoneMatrix(item, bone.currentMatrix);
  });
}

function calSlot(slot, skinHash, bone, boneHash, texHash) {
  slot.forEach(item => {
    let { name, parent, displayIndex = 0 } = item;
    // 插槽隐藏不显示
    if(displayIndex < 0) {
      return;
    }
    let skin = skinHash[name];
    let displayTarget = skin.display[displayIndex];
    // 网格类型
    if(displayTarget.type === 'mesh') {
      let { verticesList, triangleList } = displayTarget;
      verticesList.forEach(item => {
        let { weightList } = item;
        // 有绑定骨骼的mesh，计算权重
        if(weightList) {
          let m = [0, 0, 0, 0, 0, 0];
          weightList.forEach(weight => {
            let { index, value, matrix } = weight;
            let boneMatrix = bone[index].currentMatrix;
            let offset = karas.math.matrix.multiply(boneMatrix, matrix);
            for(let i = 0; i < 6; i++) {
              m[i] += offset[i] * value;
            }
          });
          item.matrix = m;
          item.coords = math.geom.transformPoint(m, 0, 0);
        }
        // 没有绑定认为直属父骨骼
        else {
          let parentBoneMatrix = boneHash[parent].currentMatrix;
          let offsetMatrix = [1, 0, 0, 1, item.x, item.y];
          let m = karas.math.matrix.multiply(parentBoneMatrix, offsetMatrix);
          item.matrix = m;
          item.coords = math.geom.transformPoint(m, 0, 0);
        }
      });
      triangleList.forEach(item => {
        let { indexList, coords } = item;
        let source = coords[0].concat(coords[1]).concat(coords[2]);
        let target = [];
        indexList.forEach(i => {
          target = target.concat(verticesList[i].coords);
        });
        // 先交换确保3个点顺序
        let [source1, target1] = math.tar.exchangeOrder(source, target);
        let matrix;
        // 防止溢出，此时三角形不可见
        if(math.tar.isOverflow(source1, target1)) {
          matrix = [0, 0, 0, 0, 0, 0];
        }
        else {
          matrix = math.tar.transform(source1, target1);
        }
        item.matrix = matrix;
      });
    }
    // 默认图片类型
    else {
      let { transform = {} } = displayTarget;
      let tex = texHash[displayTarget.name];
      let parentBoneMatrix = boneHash[parent].currentMatrix;
      let matrix = math.matrix.identity();
      // 图片本身形变，因中心点在图片本身中心，所以无论是否有translate都要平移
      let t = [1, 0, 0, 1, (transform.x || 0) - tex.frameWidth * 0.5, (transform.y || 0) - tex.frameHeight * 0.5];
      matrix = math.matrix.multiply(matrix, t);
      // 可选旋转
      if(transform.skX) {
        let d = math.geom.d2r(transform.skX);
        let sin = Math.sin(d);
        let cos = Math.cos(d);
        let t = [cos, sin, -sin, cos, 0, 0];
        matrix = math.matrix.multiply(matrix, t);
      }
      // tfo为图片中心，可合并
      t = math.matrix.identity();
      t[4] = tex.frameWidth * 0.5;
      t[5] = tex.frameHeight * 0.5;
      matrix = math.matrix.multiply(t, matrix);
      t = math.matrix.identity();
      t[4] = -tex.frameWidth * 0.5;
      t[5] = -tex.frameHeight * 0.5;
      matrix = math.matrix.multiply(matrix, t);
      matrix = math.matrix.multiply(parentBoneMatrix, matrix);
      displayTarget.matrix = matrix;
    }
  });
}

export default {
  animateBoneMatrix,
  mergeBoneMatrix,
  calSlot,
};
