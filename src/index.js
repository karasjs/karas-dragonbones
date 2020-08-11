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
    if(ske && tex && karas.util.isObject(ske) && karas.util.isObject(tex)) {
      parser.parseAndLoadTex(tex, (texHash) => {
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
        } = parser.parseSke(ske, texHash);
        this.texHash = texHash;
        this.bone = bone;
        this.boneHash = boneHash;
        this.slot = slot;
        this.slotHash = slotHash;
        this.skin = skin;
        this.skinHash = skinHash;
        this.animationHash = animationHash;

        let defaultAction;
        // 优先props指定，有可能不存在
        if(props.defaultAction && animationHash[props.defaultAction]) {
          let key = props.defaultPause ? 'gotoAndStop' : 'gotoAndPlay';
          defaultAction = {
            [key]: props.defaultAction,
          };
        }
        // 不存在或没有指定使用ske文件的第一个
        else if(defaultActions && defaultActions.length) {
          defaultAction = defaultActions[0];
        }
        if(defaultAction) {
          let a = this.action(defaultAction.gotoAndPlay || defaultAction.gotoAndStop);
          if(defaultAction.gotoAndStop) {
            a.gotoAndStop(0);
          }
        }
      });
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
        }
      }
    };
    return a;
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
