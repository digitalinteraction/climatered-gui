import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

//
// Import brands ~ https://fontawesome.com/icons?d=gallery&s=brands
//
import {
  faYoutube, // Introduction / Ignite talks
  faTwitter
} from '@fortawesome/free-brands-svg-icons'

//
// Import solids ~ https://fontawesome.com/icons?d=gallery&s=solid
//
import {
  faGamepad, // Games
  faComments, // Live Q&A
  faBriefcaseMedical, // Doctor patient clinics
  faFish, // Fishbowl
  faObjectGroup, // Workshop
  faStreetView, // Virtual tour
  faPeopleArrows, // Connect
  faUsers, // Panel
  faMicrophone, // Speakers / Propose a speaker
  faMicrophoneSlash,
  faPlus,
  faCalendarPlus,
  faSearch,
  faGlobe,
  faFolder,
  faTv,
  faDesktop,
  faHandPaper,
  faSave,
  faCircle,
  faCubes,
  faInfoCircle,
  faArrowLeft,
  faEnvelope,
  faUserPlus,
  faLongArrowAltRight,
  faArrowRight,
  faEye,
  faCheck,
  faUser,
  faFire,
  faPhone,
  faVideo,
  faVideoSlash,
  faExternalLinkAlt,
  faExclamationTriangle,
  faCopy,
  faUserFriends,
  faLeaf,
  faHashtag,
  faPlay,
  faStop,
  faAngleDown,
  faAngleUp
} from '@fortawesome/free-solid-svg-icons'

//
// Import regulars ~ https://fontawesome.com/icons?d=gallery&s=regular
//
// import { } from '@fortawesome/free-regular-svg-icons'

//
// Add brand icons
//
library.add(faYoutube, faTwitter)

//
// Add solid icons
//
library.add(
  faGamepad,
  faComments,
  faBriefcaseMedical,
  faFish,
  faObjectGroup,
  faStreetView,
  faPeopleArrows,
  faUsers,
  faMicrophone,
  faMicrophoneSlash,
  faPlus,
  faCalendarPlus,
  faSearch,
  faGlobe,
  faFolder,
  faTv,
  faDesktop,
  faHandPaper,
  faSave,
  faCircle,
  faCubes,
  faInfoCircle,
  faArrowLeft,
  faEnvelope,
  faUserPlus,
  faLongArrowAltRight,
  faArrowRight,
  faEye,
  faCheck,
  faUser,
  faFire,
  faPhone,
  faVideo,
  faVideoSlash,
  faExternalLinkAlt,
  faExclamationTriangle,
  faCopy,
  faUserFriends,
  faLeaf,
  faHashtag,
  faPlay,
  faStop,
  faAngleDown,
  faAngleUp
)

//
// Register the icon component globaly
//
Vue.component('fa', FontAwesomeIcon)
