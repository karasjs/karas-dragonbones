import karas from 'karas';

const { math } = karas;

function canvasBone(ctx, matrixEvent, bone) {
  let { length, children, currentMatrix } = bone;
  let m = math.matrix.multiply(matrixEvent, currentMatrix);
  ctx.setTransform(...m);
  ctx.beginPath();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.moveTo(0, 0);
  ctx.lineTo(length || 5, 0);
  ctx.closePath();
  ctx.stroke();
  children.forEach(item => {
    canvasBone(ctx, matrixEvent, item);
  });
}

function canvasSlot(ctx, matrixEvent, slot, skinHash, texHash) {
  let opacity = ctx.globalAlpha;
  slot.forEach(item => {
    let { name, displayIndex = 0, displayIndexA = displayIndex, blendMode, color = {}, colorA = color } = item;
    // 插槽隐藏不显示
    if(displayIndexA < 0) {
      return;
    }
    // 叠加模式
    if(blendMode === 'add') {
      ctx.globalCompositeOperation = 'lighter';
    }
    let { aM = 100 } = colorA;
    // 透明度
    ctx.globalAlpha *= aM / 100;
    let skin = skinHash[name];
    let displayTarget = skin.display[displayIndexA];
    let tex = texHash[displayTarget.name];
    // 网格类型
    if(displayTarget.type === 'mesh') {
      let { triangleList } = displayTarget;
      triangleList.forEach(item => {
        let { matrix, scaleCoords } = item;
        // 可能缩放至0或变形为一条线无宽度不可见
        if(matrix[0] === 0 || matrix[3] === 0) {
          return;
        }
        matrix = math.matrix.multiply(matrixEvent, matrix);
        // clip绘制
        ctx.save();
        ctx.setTransform(...matrix);
        ctx.beginPath();
        ctx.moveTo(scaleCoords[0][0], scaleCoords[0][1]);
        ctx.lineTo(scaleCoords[1][0], scaleCoords[1][1]);
        ctx.lineTo(scaleCoords[2][0], scaleCoords[2][1]);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(tex.source, -tex.x, -tex.y);
        ctx.restore();
      });
    }
    // 默认图片类型
    else {
      let { matrix } = displayTarget;
      if(matrix[0] === 0 || matrix[3] === 0) {
        return;
      }
      matrix = math.matrix.multiply(matrixEvent, matrix);
      // clip绘制
      ctx.save();
      ctx.setTransform(...matrix);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(tex.width, 0);
      ctx.lineTo(tex.width, tex.height);
      ctx.lineTo(0, tex.height);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(tex.source, -tex.x, -tex.y);
      ctx.restore();
    }
    // 恢复模式
    if(blendMode) {
      ctx.globalCompositeOperation = 'source-over';
    }
  });
  // 恢复透明度
  ctx.globalAlpha = opacity;
}

function canvasTriangle(ctx, matrixEvent, slot, skinHash, texHash) {
  slot.forEach(item => {
    let { name, displayIndex = 0, displayIndexA = displayIndex } = item;
    // 插槽隐藏不显示
    if(displayIndexA < 0) {
      return;
    }
    let skin = skinHash[name];
    let displayTarget = skin.display[displayIndexA];
    // 网格类型
    if(displayTarget.type === 'mesh') {
      let { verticesList, triangleList } = displayTarget;
      triangleList.forEach(item => {
        let { matrix, scaleCoords } = item;
        matrix = math.matrix.multiply(matrixEvent, matrix);
        ctx.setTransform(...matrix);
        ctx.strokeStyle = '#39F';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(scaleCoords[0][0], scaleCoords[0][1]);
        ctx.lineTo(scaleCoords[1][0], scaleCoords[1][1]);
        ctx.lineTo(scaleCoords[2][0], scaleCoords[2][1]);
        ctx.closePath();
        ctx.stroke();
      });
      verticesList.forEach(item => {
        let { matrix } = item;
        matrix = math.matrix.multiply(matrixEvent, matrix);
        ctx.setTransform(...matrix);
        ctx.fillStyle = '#0D6';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      });
    }
    // 默认图片类型
    else {
      let { matrix } = displayTarget;
      let tex = texHash[displayTarget.name];
      matrix = math.matrix.multiply(matrixEvent, matrix);
      ctx.save();
      ctx.setTransform(...matrix);
      ctx.strokeStyle = '#F90';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(tex.width, 0);
      ctx.lineTo(tex.width, tex.height);
      ctx.lineTo(0, tex.height)
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  });
}

export default {
  canvasSlot,
  canvasTriangle,
  canvasBone,
};
