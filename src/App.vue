<template>
  <div id="app">
    <div id="mcmap"></div>
    <div class="playerlist">
      <div class="title">Online Players ({{ info.players }}/{{ info.maxPlayers }})</div>
      <player-list></player-list>
    </div>
  </div>
</template>

<script>
import PlayerList from './PlayerList.vue'
import axios from 'axios'

export default {
  data () {
    return {
      info: { players: 0, maxPlayers: -1 },
      timeout: undefined
    }
  },
  mounted () {
    this.fetchInfo()
    overviewer.util.initialize()
  },
  beforeDestroy () {
    clearTimeout(this.timeout)
  },
  methods: {
    fetchInfo () {
      axios.get('info')
      .then((response) => {
        this.info = response.data
        document.title = this.info.motd
        this.timeout = setTimeout(() => {
          this.fetchInfo()
        }, 5000)
      })
      .catch((err) => {
        // silent fail (throws an error if user disconnects between updates)
        this.timeout = setTimeout(() => {
          this.fetchInfo()
        }, 8000)
      })
    }
  },
  components: {
    PlayerList
  }
}
</script>

<style scoped>
#app {
    width: 100%;
    height: 100%;
}

.playerlist {
    position: absolute;
    top: 120px;
    right: 15px;
    width: 300px;
    border: 1px solid white;
    color: white;
    font-family: Arial, Sans-Serif;
    background-color: #1a1a1a;
}

.title {
    text-align: center;
    font-weight: bold;
    border-bottom: 1px solid white;
    margin: 0px;
    padding: 3px;
}
</style>
