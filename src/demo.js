function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function playerList () {
  return JSON.parse(`[ {
    "uuid" : "5a7d41b8-e0fe-4e0a-8b12-5beca6ce857b",
    "name" : "r15ch13",
    "location" : {
      "position" : {
        "x" : -315.3603877780091,
        "y" : 68.0,
        "z" : 68.76903260618631
      }
    }
  } ]`)
}

function info () {
  return JSON.parse(`{
    "motd": "Live Minecraft Overviewer Demo",
    "players" : 1,
    "maxPlayers" : 30,
    "minecraftVersion" : "1.12.2"
  }`)
}

function player () {
  return JSON.parse(`{
    "uuid" : "5a7d41b8-e0fe-4e0a-8b12-5beca6ce857b",
    "name" : "r15ch13",
    "latency" : ${random(25, 40)},
    "location" : {
      "world" : {
        "uuid" : "9d52527f-690f-4bc9-8e8c-9e22fd3e1f00",
        "name" : "vanilla2017",
        "loaded" : true,
        "link" : "/api/v5/world/9d52527f-690f-4bc9-8e8c-9e22fd3e1f00"
      },
      "position" : {
        "x" : -${random(300, 320)},
        "y" : 68.0,
        "z" : ${random(65, 85)}
      }
    },
    "helmet" : {
      "quantity" : 1,
      "type" : {
        "id" : "minecraft:iron_helmet",
        "name" : "Iron Helmet"
      }
    },
    "chestplate" : {
      "quantity" : 1,
      "type" : {
        "id" : "minecraft:iron_chestplate",
        "name" : "Iron Chestplate"
      }
    },
    "leggings" : {
      "quantity" : 1,
      "type" : {
        "id" : "minecraft:iron_leggings",
        "name" : "Iron Leggings"
      }
    },
    "health" : {
      "current" : ${random(5, 19)}.0,
      "max" : 20.0
    },
    "experience" : {
      "level" : 11,
      "experience" : 9,
      "totalExperience" : 196
    },
    "food" : {
      "foodLevel" : ${random(5, 20)},
      "saturation" : 3.0,
      "exhaustion" : 3.1364381313323975
    },
    "gameMode" : {
      "id" : "minecraft:survival",
      "name" : "Survival Mode"
    }
  }`)
}

export { info, player, playerList }
