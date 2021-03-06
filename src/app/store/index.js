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
    lastDumpStrings: "",
    //graphics related data
    lastUncompressedSearchOffset: "00000000",
    lastSelectedCompressedOffset: 0,
    //sounds related data
    lastSelectedSongOffset: 0
};

const mutations = {
    resetState(state) {
        state.rom = Buffer.alloc(0);
        //hexview related data
        state.lastHexPosition = 0;
        //strings related data
        state.textAsByte = {};
        state.byteAsText = {};
        state.lastSearchText = "";
        state.lastSearchMatches = [];
        state.lastSearchSelectedMatch = {};
        state.lastDumpStartAddress = "";
        state.lastDumpEndAddress = "";
        state.lastDumpBreakBytes = "";
        state.lastDumpStrings = "";
        //graphics related data
        state.lastUncompressedSearchOffset = "00000000";
        state.lastSelectedCompressedOffset = 0;
        //sounds related data
        state.lastSelectedSongOffset = 0;
    },
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
    },
    setUncompressedSearchOffset(state, text) {
        state.lastUncompressedSearchOffset = text;
    },
    setSelectedCompressedOffset(state, offset) {
        state.lastSelectedCompressedOffset = offset;
    },
    setSelectedSongOffset(state, offset) {
        state.lastSelectedSongOffset = offset;
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
    lastDumpStrings: state => state.lastDumpStrings,
    lastUncompressedSearchOffset: state => state.lastUncompressedSearchOffset,
    lastSelectedCompressedOffset: state => state.lastSelectedCompressedOffset,
    lastSelectedSongOffset: state => state.lastSelectedSongOffset
};

export default new Vuex.Store({
    state,
    getters,
    mutations
});
