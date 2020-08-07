import karas from 'karas';
import parser from './parser';
import util from './util';
import render from './render';

class Dragonbones extends karas.Component {
  componentDidMount() {
    let self = this;
    // 劫持本隐藏节点的render()，在每次渲染时绘制骨骼动画
    let shadowRoot = this.shadowRoot;
    let fake = this.ref.fake;
    let { ske, tex } = this.props;
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

        if(defaultActions && defaultActions.length) {
          let animation = animationHash[defaultActions[0].gotoAndPlay];
          let { boneAnimationList, slotAnimationList, options } = animation;
          if(!karas.util.isNil(self.props.playbackRate)) {
            options.playbackRate = self.props.playbackRate;
          }

          // 隐藏节点模拟一段不展示的动画，带动每次渲染
          let a = this.animation = fake.animate([
            {
              opacity: 0,
            },
            {
              opacity: 1,
            }
          ], options);

          // 劫持隐藏节点渲染，因本身display:none可以不执行原本逻辑，计算并渲染骨骼动画
          fake.render = function(renderMode, ctx, defs) {
            let offset = Math.min(1, a.currentTime / a.duration);
            util.animateBoneMatrix(boneAnimationList, offset, boneHash);
            util.mergeBoneMatrix(bone[0]);
            util.animateSlot(slotAnimationList, offset, slotHash);
            util.calSlot(slot, skinHash, bone, boneHash, texHash);
            if(renderMode === karas.mode.CANVAS) {
              let { matrixEvent, computedStyle } = shadowRoot;
              // 先在dom中居中
              let left = computedStyle.marginLeft + computedStyle.borderLeftWidth + computedStyle.width * 0.5;
              let top = computedStyle.marginTop + computedStyle.borderTopWidth + computedStyle.height * 0.5;
              let t = karas.math.matrix.identity();
              t[4] = left;
              t[5] = top;
              matrixEvent = karas.math.matrix.multiply(matrixEvent, t);
              render.canvasSlot(ctx, matrixEvent, slot, skinHash, texHash);
              // debug模式
              if(self.props.debug) {
                render.canvasTriangle(ctx, matrixEvent, slot, skinHash, texHash);
                render.canvasBone(ctx, matrixEvent, bone[0]);
              }
              else {
                if(self.props.debugBone) {
                  render.canvasBone(ctx, matrixEvent, bone[0]);
                }
              }
            }
          };
        }
      });
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
