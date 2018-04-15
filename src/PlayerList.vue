<template>
  <ul >
    <li v-show="!players.length">No players online</li>
    <player-list-entry v-for="item in players" :key="item.uuid" :uuid="item.uuid" :name="item.name"></player-list-entry>
  </ul>
</template>

<script>
import PlayerListEntry from './PlayerListEntry.vue'
import axios from 'axios'

export default {
  data () {
    return {
      players: [],
      timeout: undefined
    }
  },
  mounted () {
    this.fetchPlayers()
  },
  beforeDestroy () {
    clearTimeout(this.timeout)
  },
  methods: {
    fetchPlayers () {
      axios.get(`player`)
      .then((response) => {
        this.players = response.data
        this.timeout = setTimeout(() => {
          this.fetchPlayers()
        }, 5000)
      })
      .catch((err) => {
        // silent fail (throws an error if user disconnects between updates)
        this.timeout = setTimeout(() => {
          this.fetchPlayers()
        }, 8000)
      })
    }
  },
  components: {
    PlayerListEntry
  }
}
</script>

<style scoped>
ul {
  margin: 0px;
  padding: 3px;
}
li {
  list-style: none;
  cursor: pointer;
}
</style>
