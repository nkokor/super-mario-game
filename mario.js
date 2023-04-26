kaboom({
  global: true,
  fullscreen: true,
  scale: 1.6,
  debug: true,
  clearColor: [0, 0, 0, 1]
})

let JUMP_SPEED = 350
let PLAYER_SPEED = 150

const MUSHROOM_SPEED = 17
const ENEMY_SPEED = 25
const DEATH_FALL = 800

let isJumping = true

loadRoot('https://i.imgur.com/')
loadSprite('mario', 'Wb1qfhK.png')
loadSprite('flower', 'uaUm9sN.png')
loadSprite('mushroom', '0wMd92p.png')
loadSprite('enemy', 'KPO3fR9.png')
loadSprite('brick', 'pogC9x5.png')
loadSprite('block', 'M6rwarW.png')
loadSprite('surprise', 'gesQ1KP.png')
loadSprite('coin-surprise', 'gesQ1KP.png')
loadSprite('unboxed', 'bdrLpi6.png')
loadSprite('coin', 'wbKxhcd.png')
loadSprite('pipe-top-left', 'ReTPiWY.png')
loadSprite('pipe-top-right', 'hj2GK4n.png')
loadSprite('pipe-bottom-left', 'c1cYSbt.png')
loadSprite('pipe-bottom-right', 'nqQ79eI.png')
loadSprite('peach', 'Hg6ttP8.png')
loadSprite('happy-end', 'rmGzaBF.png')

scene("game", ( { level, score }) => {
  layers(['bg', 'obj', 'ui'], 'obj')
  const levelMaps = [
  [
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                  $             ',
    '                             ======             ',
    '     #=        0=?=                      $      ',
    '                                                ',
    '                                             <> ',
    '           $         ^   ^                   () ',
    '==============================    =============='
  ],
  [
    '                                                 ',
    '                                                 ',
    '       ==0==?===                                 ',
    '                                                 ',
    '                                                 ',
    '       =========                                 ',
    '                                                 ',
    '                                                 ',
    '=====                                            ',
    '                                                 ',
    '                                              P  ',
    '        $           ^                      ^     ',
    '       ==================    ====================='
  ],

]

  const levelCfg = {
    width: 20,
    height: 20,
    '=': [sprite('block'), solid()],
    '^': [sprite('enemy'), solid(), 'enemy'],
    '&': [sprite('mushroom'), solid(), 'mushroom', body()],
    '$': [sprite('coin'), solid(), 'coin'],
    '?': [sprite('surprise'), solid(), 'coin-surprise'],
    '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
    ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
    '<': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe-hole'],
    '>': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe-hole'],
    '0': [sprite('surprise'), solid(), 'mushroom-surprise'],
    '/': [sprite('unboxed'), solid()],
    '#': [sprite('surprise'), solid(), 'empty'],
    'P': [sprite('peach'), solid(), scale(0.05), 'peach']
  }

  const gameLevel = addLevel(levelMaps[level - 1], levelCfg)

  const scoreLabel = add([
    text('Score: ' + score),
    pos(25, 30),
    layer('ui'), 
    {
      value: 0
    }
  ])

  add([
    text('Level ' + level),
    pos(25, 16)
  ])

  function big() {
    let timer = 0
    let isBig = false
    return {
      update() {
        if(isBig) {
          timer = timer - dt()
          if(timer <= 0) {
            this.makeSmall()
          }
        }
      },
      isBig() {
        return isBig
      },
      makeSmall() {
        this.scale = vec2(1)
        JUMP_SPEED = 350
        PLAYER_SPEED = 150
        timer = 0
        isBig = false
      },
      makeBig(time) {
        this.scale = vec2(2)
        JUMP_SPEED = 450
        PLAYER_SPEED = 250
        timer = time
        isBig = true
      }
    }
  }

  const player = add([
    sprite('mario'),
    scale(1.2), 
    solid(), 
    pos(60, 0),
    body(),
    big(),
    origin('bot')
  ])

  player.action(() => {
    if(player.pos.y >= DEATH_FALL) {
      camPos(player.pos)
      go('lose', { score: scoreLabel.value })
    }
  })

  keyDown('right', function() {
    player.move(PLAYER_SPEED, 0)
  })

  keyDown('left', function() {
    player.move(-1 * PLAYER_SPEED, 0)
  })

  keyPress('space', function() {
    if(player.grounded()) {
      isJumping = true
      player.jump(JUMP_SPEED)
    }
  })

  player.on("headbump", (obj) => {
    if(obj.is('coin-surprise')){
      gameLevel.spawn('$', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('/', obj.gridPos.sub(0, 0))
    } else if(obj.is('empty')){
      destroy(obj)
      gameLevel.spawn('/', obj.gridPos.sub(0, 0))
    } else if(obj.is('mushroom-surprise')) {
      gameLevel.spawn('&', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('/', obj.gridPos.sub(0, 0))
    }
  })

  player.collides('coin', (coin) => {
    destroy(coin)
    scoreLabel.value = scoreLabel.value + 1
    scoreLabel.text = 'Score: ' + scoreLabel.value
  })

  player.collides('mushroom', (mushroom) => {
    destroy(mushroom)
    player.makeBig(7)
  })

  player.collides('enemy', (enemy) => {
    if(isJumping) {
      destroy(enemy)
    } else {
      go('lose', {
        score: scoreLabel.value
      })
    }
  })

  player.collides('pipe-hole', () => {
    if(isJumping) {
      go('game', { 
        level: ( level + 1),
        score: scoreLabel.value 
      })
    }
  })

  player.collides('peach', () => {
    go('win', {
      score: scoreLabel.value
    })
  })

  action('mushroom', (mushroom) => {
    mushroom.move(MUSHROOM_SPEED, 0)
  })

  action('enemy', (enemy) => {
    enemy.move(-1 * ENEMY_SPEED, 0)
  })

  player.action(() => {
    if(player.grounded()) {
      isJumping = false
    }
  })

})

scene('lose', ({score}) => {
  add([text('You lose. ' + 'Score: ' + score, 24), origin('center'), pos(width()/2, height()/2)])
})

scene('win', ({score}) => {
  add([sprite('happy-end'), origin('center'), pos(width()/2, 170)])
  add([text('Congratulations!', 16), origin('center'), pos(width()/2, 290)])
  add([text('Thanks to you Mario and Peach can now have their happily ever after.', 13), origin('center'), pos(width()/2, 320)])
})

start("game", { 
  level: 1,
  score: 0 
})