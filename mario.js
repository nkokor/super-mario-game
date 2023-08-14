kaboom({
  global: true,
  fullscreen: true,
  scale: 1.6,
  debug: true,
  clearColor: [0, 0, 0, 1]
})

const MUSHROOM_SPEED = 17
const ENEMY_SPEED = 25
const DEATH_FALL = 800

let JUMP_SPEED = 330
let PLAYER_SPEED = 130

let isJumping = true

loadRoot('sprites/')

loadSprite('background', 'background.png')

loadSprite('mario', 'mario.png')
loadSprite('flower', 'flower.png')
loadSprite('mushroom', 'mushroom.png')
loadSprite('enemy', 'red-enemy.png')
loadSprite('brick', 'orange-brick.png')
loadSprite('blue-brick', 'blue-brick.png')
loadSprite('block', 'red-ground.png')
loadSprite('surprise', 'red-surprise.png')
loadSprite('coin-surprise', 'red-surprise.png')
loadSprite('unboxed', 'red-unboxed.png')
loadSprite('coin', 'coin.png')
loadSprite('pipe-top-left', 'pipe-top-left.png')
loadSprite('pipe-top-right', 'pipe-top-right.png')
loadSprite('pipe-bottom-left', 'pipe-bottom-left.png')
loadSprite('pipe-bottom-right', 'pipe-bottom-right.png')
loadSprite('peach', 'peach.png')
loadSprite('happy-end', 'happy-end.png')
loadSprite('blue-ground', 'blue-ground.png')
loadSprite('blue-enemy', 'blue-enemy.png')
loadSprite('blue-surprise', 'blue-surprise.png')
loadSprite('blue-box', 'blue-box.png')
loadSprite('castle', 'castle.png')
loadSprite('boss', 'boss.png')

scene("game", ( { level, score }) => {
  layers(['bg', 'obj', 'ui'], 'obj')
  const levelMaps = [ 
   ['                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '               ?=0                              ',
    '                             $ $$ $             ',
    '                             ======             ',
    '     #=                                $        ',
    '              =====                             ',
    '                                         <>     ',
    '           $           ^ ^               ()     ',
    '=============       ==========    ==============',
    '=============       ==========    ==============',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                '
  ],
  [
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                          <>    ',
    '                                          ()    ',
    '|||                                     _____   ',
    '|||                                  $          ',
    '|||           _!_                    +          ',
    '|||                                $            ',
    '|||                                +            ',
    '|||              +               $              ',
    '|||             ++               +              ',
    '|||            +++             $                ',
    '|||           ++++             +                ',
    '|||          +++++   "  "                       ',
    '|||     ____________________                    ',
    '|||     ____________________                    ',
    '|||                                             ',
    '|||                                             ',
    '|||                                             ',
    '|||                                             ',
    '|||                                             ',
    '|||                                             '
  ],
  [
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                      X         ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '              $                         P       ',
    '              -                                 ',
    '           $  -                 $   ----------- ',
    '           -  -    B       $   ---              ',
    '        $  -  -           ---                   ',
    '        -  -  -                                 ',
    '------------------------                        ',
    '------------------------                        ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                '
  ]
]

  const levelCfg = {
    width: 20,
    height: 20,
    '=': [sprite('block'), solid()],
    '^': [sprite('enemy'), solid(), body(), 'enemy'],
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
    'P': [sprite('peach'), solid(), scale(0.074),'peach'],
    '_': [sprite('blue-ground'), solid(), scale(0.5)],
    '-': [sprite('brick'), solid()],
    '|': [sprite('blue-brick'), solid(), scale(0.8)],
    '+': [sprite('blue-box'), solid(), scale(0.5)],
    '!': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
    '"': [sprite('blue-enemy'), solid(), scale(0.5), body(), 'enemy'],
    'X': [sprite('castle'), solid(), scale(0.45), 'castle'],
    'B': [sprite('boss'), solid(), scale(0.1077), 'boss', body()]
  }

  add([
    sprite('background'),
    scale(0.7)
  ])

  const gameLevel = addLevel(levelMaps[level - 1], levelCfg)

  const scoreLabel = add([
    text('Score: ' + score),
    pos(25, 30),
    layer('ui'), 
    {
      value: score
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
        this.scale = vec2(0.3)
        JUMP_SPEED = 330
        PLAYER_SPEED = 130
        timer = 0
        isBig = false
      },
      makeBig(time) {
        this.scale = vec2(0.5)
        JUMP_SPEED = 450
        PLAYER_SPEED = 250
        timer = time
        isBig = true
      }
    }
  }

  const player = add([
    sprite('mario'),
    scale(0.3), 
    solid(), 
    pos(60, 0),
    body(),
    big(),
    origin('bot')
  ])

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

  player.collides('boss', (boss) => {
    if(isJumping) {
      destroy(boss)
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

  player.collides('castle', () => {
    go('win', {
      score: scoreLabel.value
    })
  })

  action('mushroom', (mushroom) => {
    mushroom.move(MUSHROOM_SPEED, 0)
  })

  action('boss', (boss) => {
    if(boss.grounded()) {
      boss.jump(150)
    }
  })

  player.action(() => {
    if(player.pos.y >= DEATH_FALL) {
      camPos(player.pos)
      go('lose', { score: scoreLabel.value })
    }
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
  add([sprite('happy-end'), scale(0.5), origin('center'), pos(width()/2, 170)])
  add([text('Congratulations!', 16), origin('center'), pos(width()/2, 310)])
  add([text('Thanks to you Mario and Peach can now have their happily ever after.', 13), origin('center'), pos(width()/2, 340)])
})

start("game", { 
  level: 1,
  score: 0 
})