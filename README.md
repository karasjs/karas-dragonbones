# karas-dragonbones
Dragonbones component for karas.

## API
```jsx
import Dragonbones from 'karas-dragonbones';

karas.render(
  <canvas width="720" height="720">
    <Dragonbones
      ref="db"
      ske={ske} // 骨骼描述json
      tex={tex} // 骨骼纹理json
      imagePath={'url'} // 可选皮肤url，默认tex中指定
      armature={'name'} // 可选默认骨架名称name，默认ske中第一个
      action={'name'} // 可选播放动作名称name，默认ske中指定
      pause={false} // 可选暂停在第一帧，默认ske中指定
      fitSize={false} // 可选当ske指定画布尺寸时是否根据组件宽高进行缩放适配，默认false
      enlarge={0.25} // 可选mesh网格扩大裁剪像素，默认0.25
      enlargeSlot={{slot: 0.25}} // 可选单独slot名称配置mesh网格扩大裁剪像素，默认0.25
      staticCache={false} //可选开启静态帧优化，每帧渲染后缓存，默认false
      playbackRate={1} // 可选播放速度，默认1
      fps={60} // 可选播放fps，默认60
      share={false} // 可选共享计算，当同一动画同时出现多个实例时，可省略计算副本，默认false
      loadJson={Function} //如果ske或tex传入的是url需加载，则可覆盖默认的加载方法，2个参数分别为url和callback(json)
      debug={false} //可选展示调试绘制，默认false
      debugBone={false} //可选展示调试绘制骨骼，默认false
      debugSlot={false} //可选展示调试绘制插槽，默认false
    />
  </canvas>,
  '#domId'
);
```
#### 组件上的对象：
* animation: Animation WAA动画对象，karas.animate.Animation实例，可控制动画状态
#### 组件上的方法：
* armature(name: String, options?: Object) 播放指定name的骨架，可选options和props上一致
* action(name: String) 播放指定name的动画
* changeImage(url: String) 加载并更换指定url的皮肤
* setStaticCache(flag: Boolean) 设置是否开启静态帧优化
* cleanStaticCache() 清空静态帧优化的缓存
