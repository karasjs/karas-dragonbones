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
      playbackRate={1} // 播放速度，默认1
      fps={60} // 播放fps，默认60
      debug={false} //展示调试绘制
    />
  </canvas>,
  '#dom'
);
root.db.animation; // WAA动画对象，karas.animate.Animation实例，可控制动画状态
```
