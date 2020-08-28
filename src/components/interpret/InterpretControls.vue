<template>
  <div class="interpret-controls" :class="isLive && 'is-live'">
    <div class="columns">
      <div class="column">
        <!-- <details>
          <summary>
            <span
              class="controls-label is-toggle"
              v-t="'interpret.testLabel'"
            />
          </summary>
          <p>
            Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas sed
            diam eget risus varius blandit sit amet non magna. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros. Maecenas faucibus
            mollis interdum. Donec sed odio dui.
          </p>
        </details> -->
      </div>
      <div class="column">
        <Stack
          direction="vertical"
          gap="medium"
          align="center"
          v-if="canGoLive"
        >
          <button
            class="button"
            :class="startClasses"
            @click="start"
            :disabled="isLive"
          >
            {{ $t('interpret.startAction') }}
          </button>
          <p>
            <span v-if="isLive">
              <span class="live-indicator" />
              {{ $t('interpret.live') }}
            </span>
            <template v-if="!isLive">00:00:00</template>
            <template v-else>{{ timeSinceLive | friendlyTime }}</template>
          </p>
          <button
            class="button"
            :class="stopClasses"
            @click="stop"
            :disabled="!isLive"
            v-t="'interpret.stopAction'"
          />
        </Stack>

        <Stack direction="vertical" gap="medium" align="center" v-else>
          <p>{{ $t('interpret.isLive', [activeUser.name]) }}</p>
          <button class="button" :class="startClasses" @click="takeover">
            {{ $t('interpret.takeoverAction') }}
          </button>
        </Stack>
      </div>
      <div class="column">
        <Stack direction="vertical" gap="regular" align="start">
          <!-- <div>
            <p class="controls-label">
              {{ $t('interpret.takeoverActionLabel') }}
            </p>
            <div class="buttons">
              <button
                class="button is-small"
                @click="plusOne"
                :disabled="!canRequestTakeover"
              >
                {{ $tc('interpret.plusMins', 1) }}
              </button>
              <button
                class="button is-small"
                @click="plusThree"
                :disabled="!canRequestTakeover"
              >
                {{ $tc('interpret.plusMins', 3) }}
              </button>
              <button
                class="button is-small"
                @click="plusFive"
                :disabled="!canRequestTakeover"
              >
                {{ $tc('interpret.plusMins', 5) }}
              </button>
            </div>
          </div>
          <div>
            <p class="controls-label">
              {{ $t('interpret.takeoverStatusLabel') }}
            </p>
            <p>
              <template v-if="!request">
                <span class="tag is-light is-info">No requests</span>
              </template>

              <template v-if="isLive && request && request.status == 'pending'">
                <span class="tag is-warning is-info">Request pending</span>
              </template>

              <template v-if="!isLive && request">
                <div class="buttons">
                  <button class="button is-success" @click="acceptRequest">
                    Accept
                  </button>
                  <button class="button is-danger" @click="rejectRequest">
                    Reject
                  </button>
                </div>
              </template>
            </p>
          </div> -->
        </Stack>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { AudioBroadcaster, BroadcastState } from '../../audio.js'
import Stack from '@/components/Stack.vue'

export default {
  components: { Stack },
  data() {
    return {
      timeSinceLive: 0,
      broadcastState: null
    }
  },
  computed: {
    ...mapState('interpret', [
      'isLive',
      'liveStarted',
      'activeUser',
      'request'
    ]),
    ...mapState('api', ['user']),
    startClasses() {
      return this.isLive ? 'is-primary' : 'is-primary is-outlined'
    },
    stopClasses() {
      return this.isLive ? 'is-black' : 'is-light'
    },
    canGoLive() {
      return this.activeUser === null || this.isLive
    },
    canRequestTakeover() {
      return this.isLive
    }
  },
  filters: {
    /** adapted from https://stackoverflow.com/questions/3733227 */
    friendlyTime(timeInMs) {
      const duration = Math.floor(timeInMs / 1000)

      const h = Math.floor(duration / 3600)
      const m = Math.floor((duration % 3600) / 60)
      const s = Math.floor(duration % 60)

      return [h, m, s].map(n => n.toFixed(0).padStart(2, '0')).join(':')
    }
  },
  created() {
    this.broadcaster = new AudioBroadcaster(
      newState => {
        this.broadcastState = newState
      },
      arrayBuffer => {
        this.$socket.emitBinary('send-interpret', arrayBuffer)
      }
    )
  },
  mounted() {
    this.$clock.bind(this, () => {
      this.timeSinceLive = this.isLive
        ? Date.now() - this.liveStarted.getTime()
        : 0
    })

    // Make sure to stop any broadcasting if someone else took over
    this.$socket.bindEvent(this, 'interpret-started', async user => {
      if (this.isLive && this.user.sub !== user.email) {
        await this.stopBroadcast()
      }
    })

    // this.$socket.bindEvent(this, 'interpret-accepted', async user => {
    //   if (this.isLive && this.request) {

    //   }
    // })
  },
  async destroyed() {
    this.$clock.unbind(this)

    this.$socket.unbindOwner(this)

    if (this.isLive) {
      await this.stop()
    }
  },
  methods: {
    async start() {
      try {
        await this.$store.dispatch('interpret/startLive')

        await this.broadcaster.start()
      } catch (error) {
        this.broadcaster.handleStreamError(error)
        await this.$store.dispatch('interpret/stopLive')
      }
    },
    async stop() {
      await this.stopBroadcast()
      this.$store.dispatch('interpret/stopLive')
    },
    async takeover() {
      let msg = this.$t('interpret.takeoverConfirm')
      if (!window.confirm(msg)) return

      await this.start()
    },
    async stopBroadcast() {
      if (this.broadcastState === BroadcastState.active) {
        await this.broadcaster.stop()
      }
    },
    plusOne() {
      this.$store.dispatch('interpret/request', '1m')
    },
    plusThree() {
      this.$store.dispatch('interpret/request', '3m')
    },
    plusFive() {
      this.$store.dispatch('interpret/request', '5m')
    },
    acceptRequest() {
      this.$store.dispatch('interpret/respondToRequest', 'accept')
    },
    rejectRequest() {
      this.$store.dispatch('interpret/respondToRequest', 'reject')
    }
  }
}
</script>

<style lang="scss" scoped>
.interpret-controls {
  padding: 1em;
  border: 2px dashed $border;
  border-radius: $radius-large;
  background-color: $white-bis;
  margin-bottom: 1em;
  min-height: 200px;

  &.is-live {
    background-color: #feeced;
    border-color: $danger;
  }
}

.controls-label {
  color: $navy;
  text-transform: uppercase;
  font-weight: bold;

  &.is-toggle {
    cursor: pointer;
  }
}

// .button.is-primary.is-live[disabled] {
//   background-color: $primary;
//   opacity: 1;
// }

.live-indicator {
  display: inline-block;
  width: 0.8em;
  height: 0.8em;
  border-radius: 999px;
  background: #eb0000;
  margin-inline-end: 0.2em;
}
</style>