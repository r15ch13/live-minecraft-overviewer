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
export default {
  data () {
    return {
      info: { players: 0, maxPlayers: -1 }
    }
  },
  mounted () {
    this.fetchInfo()
    overviewer.util.initialize()
  },
  methods: {
    fetchInfo () {
      this.$http.get(`api/info?key=${window.settings.webapi.key}`)
      .then((response) => {
        this.info = response.data
        document.title = this.info.motd
        setTimeout(() => {
          this.fetchInfo()
        }, 2000)
      })
      .catch((err) => {
        // silent fail (throws an error if user disconnects between updates)
        setTimeout(() => {
          this.fetchInfo()
        }, 10000)
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
