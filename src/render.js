import karas from 'karas';

const { math } = karas;

function canvasBone(ctx, matrixEvent, bone, dx, dy) {
  let { length, children, currentMatrix } = bone;
  let m = math.matrix.multiply(matrixEvent, currentMatrix);
  ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
  ctx.beginPath();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.arc(dx, dy, 5, 0, Math.PI * 2);
  ctx.moveTo(dx, dy);
  ctx.lineTo((length || 5) + dx, dy);
  ctx.closePath();
  ctx.stroke();
  children.forEach(item => {
    canvasBone(ctx, matrixEvent, item, dx, dy);
  });
}

function canvasSlot(ctx, matrixEvent, slot, skinHash, texHash, dx, dy) {
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
    else {
      ctx.globalCompositeOperation = 'source-over';
    }
    let { aM = 100 } = colorA;
    let opacity = ctx.globalAlpha;
    // 透明度
    ctx.globalAlpha *= aM / 100;
    let skin = skinHash[name];
    let displayTarget = skin.display[displayIndexA];
    let tex = texHash[displayTarget.path || displayTarget.name];
    // 网格类型
    if(displayTarget.type === 'mesh') {
      let { triangleList } = displayTarget;
      triangleList.forEach(item => {
        let { matrix, scaleCoords } = item;
        matrix = math.matrix.multiply(matrixEvent, matrix);
        // clip绘制
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
    }
    // 默认图片类型
    else {
      let { matrix } = displayTarget;
      if(matrix[0] === 0 || matrix[5] === 0) {
        return;
      }
      matrix = math.matrix.multiply(matrixEvent, matrix);
      // clip绘制
      ctx.save();
      ctx.setTransform(matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]);
      ctx.beginPath();
      ctx.moveTo(-tex.frameX + dx, -tex.frameY + dy);
      ctx.lineTo(-tex.frameX + tex.width + dx, -tex.frameY + dy);
      ctx.lineTo(-tex.frameX + tex.width + dx,  -tex.frameY + tex.height + dy);
      ctx.lineTo(-tex.frameX + dx,  -tex.frameY + tex.height + dy);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(tex.source, -tex.x - tex.frameX + dx, -tex.y - tex.frameY + dy);
      ctx.restore();
    }
    // 恢复模式
    if(blendMode) {
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = opacity;
  });
}

function canvasTriangle(ctx, matrixEvent, slot, skinHash, texHash, dx, dy) {
  slot.forEach(item => {
    let { name, displayIndex = 0, displayIndexA = displayIndex } = item;
    // 插槽隐藏不显示
    if(displayIndexA < 0) {
      return;
    }
    let skin = skinHash[name];
    let displayTarget = skin.display[displayIndexA];
    let tex = texHash[displayTarget.path || displayTarget.name];
    // 网格类型
    if(displayTarget.type === 'mesh') {
      let { verticesList, triangleList } = displayTarget;
      triangleList.forEach(item => {
        let { matrix, scaleCoords } = item;
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
      verticesList.forEach(item => {
        let { matrix, matrixF } = item;
        matrix = math.matrix.multiply(matrixEvent, matrixF || matrix);
        ctx.setTransform(matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]);
        ctx.fillStyle = '#0D6';
        ctx.beginPath();
        ctx.arc(dx, dy, 4, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      });
    }
    // 默认图片类型
    else {
      let { matrix } = displayTarget;
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
      ctx.lineTo(-tex.frameX + tex.width + dx,  -tex.frameY + tex.height + dy);
      ctx.lineTo(-tex.frameX + dx,  -tex.frameY + tex.height + dy);
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
