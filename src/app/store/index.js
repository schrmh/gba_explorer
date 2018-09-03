import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
    rom: Buffer.alloc(0),
    //hexview related data
    lastHexPosition: 0,
    //strings related data
    textAsByte : {},
    byteAsText : {},
    lastSearchText: "",
    lastSearchMatches: [],
    lastSearchSelectedMatch: {},
    lastDumpStartAddress: "",
    lastDumpEndAddress: "",
    lastDumpBreakBytes: "",
    lastDumpStrings: ""
};

const mutations = {
    setRom(state, rom) {
        state.rom = rom;
    },
    setHexPosition(state, position) {
        state.lastHexPosition = parseInt(position, 16);
    },
    addTextBytePair(state, payload) {
        state.textAsByte[payload.text] = payload.byte;
        state.byteAsText[payload.byte] = payload.text;
    },
    setSearchText(state, text) {
        state.lastSearchText = text;
    },
    setSearchMatches(state, matches) {
        state.lastSearchMatches = matches;
    },
    setSelectedMatch(state, match) {
        state.lastSearchSelectedMatch = match;
    },
    setDumpInfo(state, payload) {
        state.lastDumpStartAddress = payload.startAddress;
        state.lastDumpEndAddress = payload.endAddress;
        state.lastDumpBreakBytes = payload.breakBytes;
        state.lastDumpStrings = payload.dumpStrings;
    }
};

const getters =  {
    rom: state => state.rom,
    lastHexPosition: state => state.lastHexPosition,
    textAsByte: state => state.textAsByte,
    byteAsText: state => state.byteAsText,
    lastSearchText: state => state.lastSearchText,
    lastSearchMatches: state => state.lastSearchMatches,
    lastSearchSelectedMatch: state => state.lastSearchSelectedMatch,
    lastDumpStartAddress: state => state.lastDumpStartAddress,
    lastDumpEndAddress: state => state.lastDumpEndAddress,
    lastDumpBreakBytes: state => state.lastDumpBreakBytes,
    lastDumpStrings: state => state.lastDumpStrings
};

export default new Vuex.Store({
    state,
    getters,
    mutations
});
