<template>
  <li @click="toggleInfoWindow" v-show="player">
    <img :src="smallHelm" />
    <span class="position">{{ name }} {{ position.x }}, {{ position.y }}, {{ position.z }}</span>
    <div class="infoWindow" v-show="false">
      <div class="header" :class="uuid">
        <img :src="bigHelm" />
        <h1>{{ name }}</h1>
      </div>
      <div class="indicators" :class="uuid">
        <div class="indicator">
          <span>Location:</span>
          <div>{{ position.x }}, {{ position.y }}, {{ position.z }}</div>
        </div>
        <div class="indicator">
          <span>Latency:</span>
          <div>{{ latency }} ms</div>
        </div>
        <div class="indicator" v-show="hasGamemodeProperty">
          <span>Gamemode:</span>
          <div>{{ gameMode }}</div>
        </div>
        <div class="indicator" v-show="hasStatisticsProperty">
          <span>Deaths:</span>
          <div>{{ deaths }}</div>
        </div>
        <div class="indicator" v-show="hasFoodProperty">
          <span>Food:</span>
          <div class="full" v-bind:key="'f'+n" v-for="n in Math.floor(food.current / 2)">🍗</div>
          <div class="half" v-if="food.current % 2 === 1">🍗</div>
          <div class="empty" v-bind:key="'e'+n" v-for="n in Math.floor((food.max - food.current) / 2)">🍗</div>
        </div>
        <div class="indicator">
          <span>Armor: </span>
          <div class="full" v-bind:key="'f'+n" v-for="n in Math.floor(armorValue / 2)">🛡️</div>
          <div class="half" v-if="armorValue % 2 === 1">🛡️</div>
          <div class="empty" v-bind:key="'e'+n" v-for="n in Math.floor((20 - armorValue) / 2)">🛡️</div>
        </div>
        <div class="indicator" v-show="hasHealthProperty">
          <span>Health:</span>
          <div class="full" v-bind:key="'f'+n" v-for="n in Math.floor(health.current / 2)">❤️</div>
          <div class="full" v-if="health.percent % 2 >= 1.5 && health.percent % 2 <= 2  && health.current !== 20 && health.current !== 0">❤️</div>
          <div class="half" v-if="health.percent % 2 >= 1   && health.percent % 2 < 1.5 && health.current !== 20 && health.current !== 0">❤️</div>
          <div class="full" v-if="health.percent % 2 >= 0.5 && health.percent % 2 < 1   && health.current !== 20 && health.current !== 0">❤️</div>
          <div class="half" v-if="health.percent % 2 >= 0   && health.percent % 2 < 0.5 && health.current !== 20 && health.current !== 0">❤️</div>
          <div class="empty" v-bind:key="'e'+n" v-for="n in Math.floor((health.max - health.current) / 2)">❤️</div>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import { player } from './demo.js'
import axios from 'axios'

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
    },
    initPosition: {
      type: Object,
      required: true,
      default: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  },
  data () {
    return {
      player: {},
      lastUpdate: {},
      marker: undefined,
      infoWindow: undefined,
      listener: undefined,
      timeout: undefined,
      infoWindowIsOpen: false,
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
      this.addMarkerClickListener()
    }
  },
  beforeDestroy () {
    clearTimeout(this.timeout)
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
      if(window.config.demo) {
        this.player = player()
        this.timeout = setTimeout(() => {
          this.fetchPlayer()
        }, 1500)
        return
      }

      axios.get(`player/${this.uuid}`)
      .then((response) => {
        this.player = response.data
        this.timeout = setTimeout(() => {
          this.fetchPlayer()
        }, 1000)
      })
      .catch((err) => {
        // silent fail (throws an error if user disconnects between updates)
        this.timeout = setTimeout(() => {
          this.fetchPlayer()
        }, 5000)
      })
    },
    toggleInfoWindow () {
      if(typeof this.infoWindow === 'undefined') return
      let map = this.infoWindow.getMap()
      if (map !== null && typeof map !== 'undefined') {
        this.infoWindowIsOpen = false
        this.infoWindow.close()
      } else {
        this.infoWindowIsOpen = true
        this.infoWindow.open(this.marker.getMap(), this.marker)
      }
    },
    getMapLocation () {
      return overviewer.util.fromWorldToLatLng(this.position.x, this.position.y, this.position.z, overviewer.mapView.options.currentTileSet)
    },
    updateInfoWindow () {
      this.createInfoWindow()
      if(this.infoWindowIsOpen) {
        // only update .indicators to prevent reloading the bigHelm image on every update
        $('#mcmap').find(`.indicators.${this.uuid}`).html(this.$el.querySelector('.indicators').innerHTML)
        this.infoWindow.setPosition(this.getMapLocation()) // Set the InfoWindow position on the map
      }
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
    },
    addMarkerClickListener () {
      if(!google.maps.event.hasListeners(this.marker, 'click')) {
        google.maps.event.addListener(this.marker, 'click', () => {
          this.toggleInfoWindow()
        })
      }
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
        return {
          x: Math.floor(this.initPosition.x),
          y: Math.floor(this.initPosition.y),
          z: Math.floor(this.initPosition.z)
        }
      }
      return {
        x: Math.floor(this.player.location.position.x),
        y: Math.floor(this.player.location.position.y),
        z: Math.floor(this.player.location.position.z)
      }
    },
    hasHealthProperty() {
      return !!(this.player && this.player.health)
    },
    health () {
      if(!this.hasHealthProperty) {
        return { current: 0, max: 20, percent: 0 }
      }
      return {
        current: this.player.health.current || 0,
        max: this.player.health.max || 20,
        percent: this.player.health.current / this.player.health.max * 100
      }
    },
    hasFoodProperty() {
      return !!(this.player && this.player.food)
    },
    food () {
      if(!this.hasFoodProperty) {
        return { current: 0, max: 20 }
      }
      return { current: this.player.food.foodLevel || 0, max: 20 }
    },
    armorValue () {
      let sum = 0
      Object.values(['helmet', 'chestplate', 'leggings', 'boots']).forEach((v) => {
        if (typeof this.player[v] !== 'object' || this.player[v] === null) return
        let type = this.player[v].type.id.replace('minecraft:', '')
        if (typeof this.armorTypes[type] !== 'undefined') {
          sum += this.armorTypes[type]
        }
      })
      return sum
    },
    hasGamemodeProperty () {
      return !!(this.player && this.player.gameMode)
    },
    gameMode () {
      if(!this.hasGamemodeProperty) return ''
      return this.player.gameMode.id === 'minecraft:survival' ? 'Survival' : 'Creative'
    },
    hasStatisticsProperty () {
      return this.player && this.player.statistics
    },
    deaths () {
      if(!this.player || !this.player.statistics) return 0
      return this.player.statistics.deaths || 0
    },
    latency () {
      if(!this.player || !this.player.latency) return 0
      return this.player.latency || 0
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
  height: 50px;
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
