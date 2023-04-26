kaboom({
  global: true,
  fullscreen: true,
  scale: 1.6,
  debug: true,
  clearColor: [0, 0, 0, 1]
})

const JUMP_SPEED = 350
const MOVE_SPEED = 150

loadRoot('https://i.imgur.com/')

loadSprite('mario', 'Wb1qfhK.png')
loadSprite('flower', 'uaUm9sN.png')
loadSprite('mushroom', '0wMd92p.png')
loadSprite('enemy', 'KPO3fR9.png')
loadSprite('brick', 'pogC9x5.png')
loadSprite('block', 'M6rwarW.png')
loadSprite('surprise', 'gesQ1KP.png')
loadSprite('unboxed', 'brdLpi6.png')
loadSprite('coin', 'wbKxhcd.png')
loadSprite('pipe-top-left', 'ReTPiWY.png')
loadSprite('pipe-top-right', 'hj2GK4n.png')
loadSprite('pipe-bottom-left', 'c1cYSbt.png')
loadSprite('pipe-bottom-right', 'nqQ79eI.png')

scene("game", () => {
  layers(['bg', 'obj', 'ui'], 'obj')
  const map = [
    '                                                  ',
    '                                                  ',
    '                                                  ',
    '                                                  ',
    '                                                  ',
    '                                                  ',
    '              $                   $               ',
    '                             ==?===               ',
    '             ===                        $         ',
    '                                                  ',
    '                                             <>   ',
    '                     ^   ^                   ()   ',
    '==============================    =============='
  ]

  const levelCfg = {
    width: 20,
    height: 20,
    '=': [sprite('block'), solid()],
    '^': [sprite('enemy'), solid()],
    '&': [sprite('mushroom'), solid()],
    '$': [sprite('coin'), solid()],
    '?': [sprite('surprise'), solid()],
    '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
    ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
    '<': [sprite('pipe-top-left'), solid(), scale(0.5)],
    '>': [sprite('pipe-top-right'), solid(), scale(0.5)]
  }

  const gameLevel = addLevel(map, levelCfg)

  const scoreLabel = add([
    text('test'),
    pos(25, 30),
    layer('ui'), 
    {
      value: 'test'
    }
  ])

  add([
    text('level ' + 'test'),
    pos(25, 16)
  ])

  const player = add([
    sprite('mario'),
    scale(1.2), 
    solid(), 
    pos(60, 0),
    body(),
    origin('bot')
  ])

  keyDown('right', function() {
    player.move(MOVE_SPEED, 0)
  })

  keyDown('left', function() {
    player.move(-1 * MOVE_SPEED, 0)
  })

  keyPress('space', function() {
    if(player.grounded()) {
      player.jump(JUMP_SPEED)
    }
  })

})

start("game")