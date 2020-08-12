import karas from 'karas';
import parser from './parser';
import util from './util';
import render from './render';

class Dragonbones extends karas.Component {
  componentDidMount() {
    let props = this.props;
    let { ske, tex } = props;
    if(ske.version !== '5.5') {
      throw new Error('The version' + ske.version + ' does not match 5.5');
    }
    this.ske = ske;
    this.tex = tex;
    parser.parseAndLoadTex(tex, (texHash) => {
      this.texHash = texHash;
      this.armature(props.armature, props);
    }, props);
  }

  armature(name, options = {}) {
    let op = karas.util.extend({}, options);
    op.armature = name;
    let {
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
    }
    else {
      console.warn('No action data');
    }
  }

  action(name) {
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
    fake.render = function(renderMode, ctx, defs) {
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
      }
    };
    return a;
  }

  changeImage(src) {
    if(src) {
      let tex = this.tex;
      tex.imagePath = src;
      let texHash = this.texHash;
      let img = document.createElement('img');
      img.onload = function() {
        karas.inject.IMG[src] = {
          width: tex.width,
          height: tex.height,
          state: karas.inject.LOADED,
          source: img,
          url: src,
        };
        tex.SubTexture.forEach(item => {
          let { name } = item;
          texHash[name].source = img;
        });
      };
      img.onerror = function() {
        throw new Error('Can not find tex: ' + src);
      };
      img.src = src;
    }
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
