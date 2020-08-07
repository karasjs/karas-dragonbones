# karas-dragonbones
Dragonbones component for karas.

## API
```jsx
import Dragonbones from 'karas-dragonbones';

karas.render(
  <canvas>
    <Dragonbones
      ske={ske}
      tex={tex}
      playbackRate={1}
      debug={false}
    />
  </canvas>,
  '#dom'
);
```
* ske: 骨骼描述json
* tex: 骨骼纹理json
* playbackRate: 播放速度
* debug: 展示调试绘制
