<template>
  <h3 class="session-tile-type">
    <span
      :class="['icon-and-text', 'is-official']"
      v-if="session.isOfficial"
      :title="localeType"
    >
      <span class="icon icon-small pull-right" v-if="session.isOfficial">
        <OfficialIcon />
      </span>
      <span class="text">
        {{ $t('schedule.redCrossRedCrescentMembersOnly') }}
      </span>
    </span>
    <span :class="['icon-and-text']" v-else>
      <span class="icon" :title="localeType">
        <fa :icon="typeFaIcon" class="fa-sm fa-fw" />
      </span>
      <span class="text"> {{ localeType }}</span>
    </span>
  </h3>
</template>

<script>
// Icons
import OfficialIcon from '@/icons/ifrc.svg'

export default {
  name: 'SessionType',
  components: {
    OfficialIcon
  },
  props: {
    session: {
      type: Object,
      required: true
    }
  },
  computed: {
    sessionType() {
      return this.$store.getters['api/type'](this.session.type)
    },
    typeFaIcon() {
      switch (this.sessionType.slug) {
        case 'closing-panel': {
          return ['fas', 'users']
        }
        case 'connect': {
          return ['fas', 'people-arrows']
        }
        case 'doctor-patient-clinics': {
          return ['fas', 'briefcase-medical']
        }
        case 'fishbowl': {
          return ['fas', 'fish']
        }
        case 'games': {
          return ['fas', 'gamepad']
        }
        case 'headline-feature-panel': {
          return ['fas', 'users']
        }
        case 'ignite-talk': {
          return ['fab', 'youtube']
        }
        case 'opening-panel': {
          return ['fas', 'users']
        }
        case 'plenary': {
          return ['fab', 'youtube']
        }
        case 'propose-a-speaker': {
          return ['fas', 'microphone']
        }
        case 'q-and-a': {
          return ['fas', 'comments']
        }
        case 'speaker': {
          return ['fas', 'microphone']
        }
        case 'virtual-tour': {
          return ['fas', 'street-view']
        }
        case 'workshop': {
          return ['fas', 'object-group']
        }
        case 'welcome': {
          return ['fab', 'youtube']
        }
        default: {
          return ['fas', 'comments']
        }
      }
    },
    localeType() {
      return this.sessionType?.title[this.$i18n.locale]
    }
  }
}
</script>

<style lang="scss" scoped>
h3.session-tile-type {
  color: $grey;
  font-size: 0.9em;
  font-weight: $weight-semibold;
  letter-spacing: 0.05em;
  line-height: 1.25rem;
  position: relative;
  text-transform: uppercase;

  // Flex
  display: flex;
  align-content: center;
  justify-content: flex-start;

  .icon-and-text {
    display: flex;
    align-items: center;
    &.is-official {
      color: red;
      margin: 0 -5px;
      .icon,
      .icon svg {
        margin-inline-end: 0;
        transform: scale(0.8);
      }
    }
    .icon {
      margin-inline-end: 8px;
      width: auto;
      svg {
        width: auto;
      }
    }
  }
}
</style>
