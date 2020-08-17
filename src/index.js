import karas from 'karas';
import parser from './parser';
import util from './util';
import render from './render';

let uuid = 0;

class Dragonbones extends karas.Component {
  componentDidMount() {
    let props = this.props;
    this.staticCacheFlag = !!props.staticCache;
    this.staticCacheHash = {};
    let { ske, tex } = props;
    ske.uuid = ske.uuid || ++uuid;
    if(ske.version !== '5.5') {
      throw new Error('The version' + ske.version + ' does not match 5.5');
    }
    this.ske = karas.util.clone(ske);
    this.tex = karas.util.clone(tex);
    parser.parseAndLoadTex(this.tex, (texHash) => {
      this.texHash = texHash;
      this.armature(props.armature, props);
    }, props);
  }

  armature(name, options = {}) {
    let op = karas.util.extend({}, options);
    op.armature = name;
    let {
      name: n,
      bone,
      boneHash,
      slot,
      slotHash,
      skin,
      skinHash,
      animationHash,
      defaultActions,
      canvas,
    } = parser.parseSke(this.ske, this.texHash, op);
    this.armatureName = n;
    this.bone = bone;
    this.boneHash = boneHash;
    this.slot = slot;
    this.slotHash = slotHash;
    this.skin = skin;
    this.skinHash = skinHash;
    this.animationHash = animationHash;
    this.canvas = canvas;

    let defaultAction;
    if(options.action && animationHash[options.action]) {
      let key = options.pause ? 'gotoAndStop' : 'gotoAndPlay';
      defaultAction = {
        [key]: options.action,
      };
    }
    // 不存在或没有指定使用ske文件的第一个
    else if(defaultActions && defaultActions.length) {
      defaultAction = defaultActions[0];
    }
    if(defaultAction) {
      let a = this.action(defaultAction.gotoAndPlay || defaultAction.gotoAndStop);
      if(options.pause || defaultAction.gotoAndStop) {
        a.gotoAndStop(0);
      }
      return a;
    }
    else {
      console.warn('No action data');
    }
  }

  action(name) {
    this.actionName = name;
    let animation = this.animationHash[name];
    if(!animation) {
      throw new Error('Can not find animation: ' + name);
    }
    // 清除上次动画的影响
    if(this.animation) {
      util.clearAnimation(this.bone, this.slot);
    }
    let { boneAnimationList, slotAnimationList, ffdAnimationHash, options } = animation;
    if(!karas.util.isNil(this.props.playbackRate)) {
      options.playbackRate = this.props.playbackRate;
    }
    if(!karas.util.isNil(this.props.fps)) {
      options.fps = this.props.fps;
    }
    // 隐藏节点模拟一段不展示的动画，带动每次渲染
    let fake = this.ref.fake;
    fake.clearAnimate();
    let a = this.animation = fake.animate([
      {
        opacity: 0,
      },
      {
        opacity: 1,
      }
    ], options);
    // 劫持隐藏节点渲染，因本身display:none可以不执行原本逻辑，计算并渲染骨骼动画
    let self = this;
    let root = self.root;
    let width = root.width;
    let height = root.height;
    fake.render = function(renderMode, ctx, defs) {
      // 开启了静态帧优化优先使用缓存
      let offScreen;
      let sourceCtx;
      let key;
      if(self.staticCacheFlag) {
        offScreen = karas.inject.getCacheCanvas(width, height);
        sourceCtx = ctx;
        ctx = offScreen.ctx;
        let frame = Math.floor(a.currentTime * (self.fps || 60) / 1000);
        // ske文件uuid + 骨架名 + 动画名 + 帧数
        key = self.ske.uuid + '>' + self.armatureName + '>' + self.actionName + '>' + frame;
        let cache = self.staticCacheHash[key];
        if(cache) {
          ctx.putImageData(cache, 0, 0);
          offScreen.draw(ctx);
          sourceCtx.drawImage(offScreen.canvas, 0, 0);
          ctx.clearRect(0, 0, width, height);
          return;
        }
      }
      let offset = Math.min(1, a.currentTime / a.duration);
      util.animateBoneMatrix(boneAnimationList, offset, self.boneHash);
      util.mergeBoneMatrix(self.bone[0]);
      util.animateSlot(slotAnimationList, offset, self.slotHash);
      util.calSlot(offset, self.slot, self.skinHash, self.bone, self.boneHash, self.texHash, ffdAnimationHash);
      if(renderMode === karas.mode.CANVAS) {
        let { matrixEvent, computedStyle } = self.shadowRoot;
        // 先在dom中居中
        let left = computedStyle.marginLeft + computedStyle.borderLeftWidth + computedStyle.width * 0.5;
        let top = computedStyle.marginTop + computedStyle.borderTopWidth + computedStyle.height * 0.5;
        let t = karas.math.matrix.identity();
        t[4] = left;
        t[5] = top;
        // 画布居中
        if(self.canvas) {
          let dx = self.canvas.x || 0;
          let dy = self.canvas.y || 0;
          t[4] -= dx * 0.5;
          t[5] -= dy * 0.5;
          // 适配尺寸
          if(self.props.fitSize) {
            let sx = computedStyle.width / self.canvas.width;
            let sy = computedStyle.height / self.canvas.height;
            t[0] = sx;
            t[3] = sy;
          }
        }
        matrixEvent = karas.math.matrix.multiply(matrixEvent, t);
        render.canvasSlot(ctx, matrixEvent, self.slot, self.skinHash, self.texHash);
        // debug模式
        if(self.props.debug) {
          render.canvasTriangle(ctx, matrixEvent, self.slot, self.skinHash, self.texHash);
          render.canvasBone(ctx, matrixEvent, self.bone[0]);
        }
        else {
          if(self.props.debugBone) {
            render.canvasBone(ctx, matrixEvent, self.bone[0]);
          }
          if(self.props.debugSlot) {
            render.canvasTriangle(ctx, matrixEvent, self.slot, self.skinHash, self.texHash);
          }
        }
        // 静态帧优化将离屏内容绘入
        if(self.staticCacheFlag) {
          offScreen.draw(ctx);
          sourceCtx.drawImage(offScreen.canvas, 0, 0);
          self.staticCacheHash[key] = ctx.getImageData(0, 0, width, height);
          ctx.clearRect(0, 0, width, height);
        }
      }
    };
    return a;
  }

  changeImage(src) {
    if(src) {
      let tex = this.tex;
      tex.imagePath = src;
      let texHash = this.texHash;
      karas.inject.measureImg(src, function() {
        tex.SubTexture.forEach(item => {
          let { name } = item;
          texHash[name].source = karas.inject.IMG[src].source;
        });
      });
    }
  }

  setStaticCache(flag) {
    this.staticCacheFlag = !!flag;
  }

  cleanStaticCache() {
    this.staticCacheHash = {};
  }

  render() {
    return <div>
      <$line ref="fake" style={{
        display: 'none',
      }}/>
    </div>;
  }
}

export default Dragonbones;
