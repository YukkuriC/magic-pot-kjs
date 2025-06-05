# 魔法花盆
一个kjs小项目，旨在模仿数据包开发思路，测试使用kjs记录与注入已有简单方块，执行额外逻辑

## 游戏性目标
总目标：跳过任何需要堆时间重复劳动的游戏内容

功能|分类|交互方式|方块类型
--|--|--|--
自动骨粉|农牧业|持续|`oak_sapling`
动物强制繁殖|农牧业|持续|`cherry_sapling`
区块biome类型修改|农牧业|单次|`TODO`
自动采矿|矿业|持续|`brown_mushroom`
自动采矿取样|矿业|持续|`red_mushroom`
区块毁灭者 & 收集掉落物|矿业|持续|`warped_fungus`
整地|矿业|单次？持续？|`crimson_fungus`
生命恢复buff|战斗|单次|`poppy`
手动怪物清场|战斗|单次|`dandelion`
小连锁挖掘 & 锤子|农牧矿|左键使用|`flower_pot`

## DLC: Botania

_摸了_

功能|分类|交互方式|方块类型
--|--|--|--
单方块机器化|农牧业|持续|`pure_daisy`

## DLC: Create
借用一下方块绑定功能搞点动画加速

功能|来源|方块类型
--|--|--
加速|本体|`spout`
加速|本体|`mechanical_press`
加速|vintage improvements|`helve_hammer`

## 技术目标
总目标：探索该路线的边界

- [x] 存储坐标点&冷却
- [x] 逐方块复杂存储
- [ ] 交互自定义框选范围
- [ ] 数据结构错乱后自动纠错
