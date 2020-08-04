import karas from 'karas';

const { math } = karas;

function canvasBone(ctx, sx, sy, matrixEvent, bone) {
  let { length, children, currentMatrix } = bone;
  let m = math.matrix.multiply(matrixEvent, currentMatrix);
  ctx.setTransform(...m);
  ctx.beginPath();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.arc(sx, sy, 5, 0, Math.PI * 2);
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx + length || 5, sy);
  ctx.closePath();
  ctx.stroke();
  children.forEach(item => {
    canvasBone(ctx, sx, sy, matrixEvent, item);
  });
}

function canvasSlot(ctx, sx, sy, matrixEvent, slot, skinHash, texHash) {
  let opacity = ctx.globalAlpha;
  slot.forEach(item => {
    let { name, parent, displayIndex = 0, color: { aM = 100 } = {} } = item;
    // 插槽隐藏不显示
    if(displayIndex < 0) {
      return;
    }
    // 透明度
    if(aM < 100) {
      ctx.globalAlpha *= aM / 100;
    }
    let skin = skinHash[name];
    let displayTarget = skin.display[displayIndex];
    let tex = texHash[displayTarget.name];
    // 网格类型
    if(displayTarget.type === 'mesh') {
      let { triangleList } = displayTarget;
      triangleList.forEach(item => {
        let { matrix, scaleCoords } = item;
        matrix = math.matrix.multiply(matrixEvent, matrix);
        // clip绘制
        ctx.save();
        ctx.setTransform(...matrix);
        ctx.beginPath();
        ctx.closePath();
        ctx.moveTo(sx + scaleCoords[0][0], sy + scaleCoords[0][1]);
        ctx.lineTo(sx + scaleCoords[1][0], sy + scaleCoords[1][1]);
        ctx.lineTo(sx + scaleCoords[2][0], sy + scaleCoords[2][1]);
        ctx.clip();
        ctx.drawImage(tex.source, sx - tex.x, sy - tex.y);
        ctx.restore();
      });
    }
    // 默认图片类型
    else {
      let { matrix } = displayTarget;
      matrix = math.matrix.multiply(matrixEvent, matrix);
      // clip绘制
      ctx.save();
      ctx.setTransform(...matrix);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + tex.frameWidth, sy);
      ctx.lineTo(sx + tex.frameWidth, sy + tex.frameHeight);
      ctx.lineTo(sx, sy + tex.frameHeight);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(tex.source, sx - tex.x, sy - tex.y);
      ctx.restore();
    }
    // 恢复透明度
    if(aM < 100) {
      ctx.globalAlpha = opacity;
    }
  });
}

function canvasTriangle(ctx, sx, sy, matrixEvent, slot, skinHash, texHash) {
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
      triangleList.forEach(item => {
        let { matrix, scaleCoords } = item;
        matrix = math.matrix.multiply(matrixEvent, matrix);
        ctx.setTransform(...matrix);
        ctx.strokeStyle = '#39F';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx + scaleCoords[0][0], sy + scaleCoords[0][1]);
        ctx.lineTo(sx + scaleCoords[1][0], sy + scaleCoords[1][1]);
        ctx.lineTo(sx + scaleCoords[2][0], sy + scaleCoords[2][1]);
        ctx.closePath();
        ctx.stroke();
      });
      verticesList.forEach(item => {
        let { matrix } = item;
        matrix = math.matrix.multiply(matrixEvent, matrix);
        ctx.setTransform(...matrix);
        ctx.fillStyle = '#0D6';
        ctx.beginPath();
        ctx.arc(sx, sy, 4, 0, Math.PI * 2);
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
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + tex.frameWidth, sy);
      ctx.lineTo(sx + tex.frameWidth, sy + tex.frameHeight);
      ctx.lineTo(sx, sy + tex.frameHeight)
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
