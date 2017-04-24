<template>
  <li @click="showInfoWindow" v-show="player">
    <img :src="smallHelm" />
    <span class="position">{{ name }} {{ position.x }}, {{ position.y }}, {{ position.z }}</span>
    <div class="infoWindow" v-show="false">
      <div class="header">
        <img :src="bigHelm" />
        <h1>{{ name }}</h1>
      </div>
      <div class="indicators">
        <div class="indicator">
          <span>Location:</span>
          <div>{{ position.x }}, {{ position.y }}, {{ position.z }}</div>
        </div>
        <div class="indicator">
          <span>Latency:</span>
          <div>{{ latency }}</div>
        </div>
        <div class="indicator">
          <span>Gamemode:</span>
          <div>{{ gameMode }}</div>
        </div>
        <div class="indicator">
          <span>Deaths:</span>
          <div>{{ deaths }}</div>
        </div>
        <div class="indicator">
          <span>Food:</span>
          <div class="full" v-for="n in Math.floor(food.current / 2)">🍗</div>
          <div class="half" v-if="food.current % 2 === 1">🍗</div>
          <div class="empty" v-for="n in Math.floor((food.max - food.current) / 2)">🍗</div>
        </div>
        <div class="indicator">
          <span>Armor:</span>
          <div class="full" v-for="n in Math.floor(armor.current / 2)">🛡️</div>
          <div class="half" v-if="armor.current % 2 === 1">🛡️</div>
          <div class="empty" v-for="n in Math.floor((armor.max - armor.current) / 2)">🛡️</div>
        </div>
        <div class="indicator">
          <span>Health:</span>
          <div class="full" v-for="n in Math.floor(health.current / 2)">❤️</div>
          <div class="full" v-if="health.percent % 2 >= 1.5 && health.percent % 2 <= 2  && health.current !== 20 && health.current !== 0">❤️</div>
          <div class="half" v-if="health.percent % 2 >= 1   && health.percent % 2 < 1.5 && health.current !== 20 && health.current !== 0">❤️</div>
          <div class="full" v-if="health.percent % 2 >= 0.5 && health.percent % 2 < 1   && health.current !== 20 && health.current !== 0">❤️</div>
          <div class="half" v-if="health.percent % 2 >= 0   && health.percent % 2 < 0.5 && health.current !== 20 && health.current !== 0">❤️</div>
          <div class="empty" v-for="n in Math.floor((health.max - health.current) / 2)">❤️</div>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
      default: 'Steve'
    },
    uuid: {
      type: String,
      required: true,
      default: '00000000-0000-0000-0000-000000000000'
    }
  },
  data () {
    return {
      player: {},
      lastUpdate: {},
      marker: undefined,
      infoWindow: undefined,
      armorTypes: {
        leather_helmet: 1, leather_chestplate: 3, leather_leggings: 2, leather_boots: 1,
        chain_helmet: 2, chain_chestplate: 5, chain_leggings: 4, chain_boots: 1,
        gold_helmet: 2, gold_chestplate: 5, gold_leggings: 3, gold_boots: 1,
        iron_helmet: 2, iron_chestplate: 6, iron_leggings: 5, iron_boots: 2,
        diamond_helmet: 3, diamond_chestplate: 8, diamond_leggings: 6, diamond_boots: 3
      }
    }
  },
  mounted () {
    this.fetchPlayer()
  },
  watch: {
    player () {
      this.updateMarker()
      this.updateInfoWindow()
    }
  },
  beforeDestroy () {
    if(typeof this.infoWindow !== 'undefined') {
      this.infoWindow.close() // close the InfoWindow (probably not needed, but let's be consistant)
      this.infoWindow.setMap(null)
    }
    if(typeof this.marker !== 'undefined') {
      this.marker.setMap(null)
    }
  },
  methods: {
    fetchPlayer () {
      this.$http.get(`api/player/${this.uuid}?key=${window.settings.webapi.key}`)
      .then((response) => {
        this.player = response.data.player
        setTimeout(() => {
          this.fetchPlayer()
        }, 500)
      })
      .catch((err) => {
        // silent fail (throws an error if user disconnects between updates)
        setTimeout(() => {
          this.fetchPlayer()
        }, 10000)
      })
    },
    showInfoWindow () {
      if(typeof this.infoWindow === 'undefined') return
      let map = this.infoWindow.getMap()
      if (map !== null && typeof map !== 'undefined') {
        this.infoWindow.close()
      } else {
        this.infoWindow.open(this.marker.getMap(), this.marker)
      }
    },
    getMapLocation () {
      return overviewer.util.fromWorldToLatLng(this.position.x, this.position.y, this.position.z, overviewer.mapView.options.currentTileSet)
    },
    updateInfoWindow () {
      this.createInfoWindow()
      this.infoWindow.setContent(this.$el.querySelector('.infoWindow').innerHTML)
      this.infoWindow.setPosition(this.getMapLocation()) // Set the InfoWindow position on the map
    },
    createInfoWindow () {
      if (typeof this.infoWindow !== 'undefined') return
      this.infoWindow = new google.maps.InfoWindow({content: this.$el.querySelector('.infoWindow').innerHTML})
      return this.infoWindow
    },
    updateMarker () {
      this.createPlayerMarker()
      this.marker.setPosition(this.getMapLocation()) // Set the marker position on the map
      this.marker.setIcon(this.createMarkerImage()) // Set the icon again, with proper sizing
      return this.marker
    },
    createPlayerMarker () {
      if (typeof this.marker !== 'undefined') return
      this.marker = new google.maps.Marker({
        position: this.getMapLocation(),
        map: overviewer.map,
        title: this.name,
        icon: this.createMarkerImage(),
        visible: true,
        zIndex: 999
      })
    },
    createMarkerImage () {
      // do a little error checking, make sure the player isn't flying into outerspace. if they are, render the size based as if they were at sky, not space.
      if (this.position.y < 0) this.position.y = 0
      if (this.position.y > 256) this.position.y = 256
      let markerSize = Math.round(0.0859375 * this.position.y + 10) // http://goo.gl/sf94W thanks Wolfram|Alpha

      let size = new google.maps.Size(markerSize, markerSize)
      let markerImage = new google.maps.MarkerImage(this.bigHelm)
      markerImage.size = size
      markerImage.scaledSize = size

      return markerImage
    }
  },
  computed: {
    smallHelm () {
      return `https://minotar.net/helm/${this.name}/18`
    },
    bigHelm () {
      return `https://minotar.net/helm/${this.name}/50`
    },
    position () {
      if(!this.player || !this.player.location || !this.player.location.position) {
        return { x: 0, y: 0, z: 0 }
      }
      return {
        x: Math.floor(this.player.location.position.x),
        y: Math.floor(this.player.location.position.y),
        z: Math.floor(this.player.location.position.z)
      }
    },
    health () {
      if(!this.player || !this.player.health) {
        return { current: 0, max: 20, percent: 0 }
      }
      return {
        current: this.player.health.current || 0,
        max: this.player.health.max || 20,
        percent: this.player.health.current / this.player.health.max * 100
      }
    },
    food () {
      if(!this.player || !this.player.food) {
        return { current: 0, max: 20 }
      }
      return { current: this.player.food.foodLevel || 0, max: 20 }
    },
    armor () {
      if(!this.player || !this.player.armour) {
        return { current: 0, max: 20 }
      }
      let sum = 0
      Object.keys(this.player.armour).forEach((v, k) => {
        if (typeof this.player.armour[v] !== 'object' || this.player.armour[v] === null) return
        let type = this.player.armour[v].id.replace('minecraft:', '')
        if (typeof this.armorTypes[type] !== 'undefined') {
          sum += this.armorTypes[type]
        }
      })
      return { current: sum, max: 20 }
    },
    gameMode () {
      if(!this.player) return ''
      return this.player.gameMode === 'minecraft:survival' ? 'Survival' : 'Creative'
    },
    deaths () {
      if(!this.player || !this.player.statistics) return 0
      return this.player.statistics.deaths || 0
    },
    latency () {
      if(!this.player || !this.player.connection) return 0
      return this.player.connection.latency || 0
    }
  }
}
</script>

<style scoped>
img {
  display: inline;
  vertical-align: middle;
}
span.position {
  padding-left: 5px;
}

.infoWindow {
  min-width: 220px;
}
.indicators {
  width: 220px;
}
.header {
  height: 50px;
}
.header img {
  width: 50px;
  float: left;
}
.header h1 {
  margin: 15px 5px;
  float: left;
  width: 160px;
}
.indicator span {
  margin-right: 5px;
  min-width: 50px;
  float: left;
}
.indicator .full {
  width: 16px;
  float: left;
  text-align: center;
}
.indicator .half {
  width: 16px;
  float: left;
  text-align: center;
  filter: grayscale(70%);
}
.indicator .empty {
  width: 16px;
  float: left;
  text-align: center;
  filter: grayscale(100%);
}
</style>
