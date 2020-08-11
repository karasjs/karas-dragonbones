# karas-dragonbones
Dragonbones component for karas.

## API
```jsx
import Dragonbones from 'karas-dragonbones';

let root = karas.render(
  <canvas width="720" height="720">
    <Dragonbones
      ref="db"
      ske={ske} // 骨骼描述json
      tex={tex} // 骨骼纹理json
      imagePath={'url'} // 可选皮肤url，默认tex中指定
      defaultAction={'name'} // 可选播放动作名称name，默认ske中指定
      defaultPause={false} // 可选暂停在第一帧，默认ske中指定
      fitSize={false} // 可选当ske指定画布尺寸时是否根据组件宽高进行缩放适配，默认false
      playbackRate={1} // 可选播放速度，默认1
      fps={60} // 可选播放fps，默认60
      debug={false} //可选展示调试绘制，默认false
    />
  </canvas>,
  '#dom'
);
```
#### 组件上的对象：
* animation: Animation WAA动画对象，karas.animate.Animation实例，可控制动画状态
#### 组件上的方法：
* action(name: String) 播放指定name的动画
* changeImage(url: String) 加载并更换指定url的皮肤
