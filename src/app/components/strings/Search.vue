<template>
  <div @keyup.esc="isPickingMatch=false">
    <div 
      v-if="showErrorOnSearch" 
      class="notification is-danger"
    >
      <button 
        class="delete" 
        @click="showErrorOnSearch=false"
      />
      {{ errorMessage }}
    </div>
    <p>Search for a string that exists within the game. Fuzz is the amount of "mistakes" allowed in a possible match.</p><br>
    <div class="field has-addons">
      <div class="control is-expanded">
        <input 
          v-model="searchText" 
          class="input" 
          type="text" 
          @keyup.enter="startSearch"
        >
      </div>
      <div class="control">
        <div class="select">
          <select v-model="fuzz">
            <option
              v-for="n in 10"
              :key="n.id"
              :value="n"
            >
              Fuzz: {{ n }}
            </option>
          </select>
        </div>
      </div>
      <div class="control">
        <button 
          class="button" 
          :class="{'is-loading':isSearching}" 
          @click="startSearch"
        >
          Search
        </button>
      </div>
    </div>
    <br>
    <div 
      v-if="matches.length > 0" 
      class="field"
    >
      <label class="label">
        Selected Match for "{{ lastSearchText }}"
      </label>
      <div class="control">
        <div class="select">
          <select 
            v-model="matchSelected" 
            @change="selectMatch(matchSelected)"
          >
            <option 
              v-for="match in matches" 
              :key="match.id" 
              :value="match.address"
            >
              0x{{ Number(match.address).toString(16).toUpperCase().padStart(8, '0') }} | {{ match.bytes.replace(/(.{4})/g, '$1 ').trim() }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div 
      class="modal" 
      :class="{'is-active':isPickingMatch}"
    >
      <div class="modal-background" />
      <div class="modal-content">
        <div class="box">
          <p class="has-text-grey-dark">
            There were multiple matches for the search. Please choose one to use.
          </p>
          <hr>
          <table class="table is-striped is-narrow is-hoverable is-fullwidth">
            <tbody>
              <tr 
                v-for="match in matches" 
                :key="match.id" 
                class="search-selector" 
                @click="selectMatch(match.address)"
              >
                <td>0x{{ Number(match.address).toString(16).toUpperCase().padStart(8, '0') }}</td>
                <td>{{ match.bytes.replace(/(.{4})/g, '$1 ').trim() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button 
        class="modal-close is-large" 
        aria-label="close" 
        @click="isPickingMatch=false"
      />
    </div>
  </div>
</template>


<script>
import sww from "simple-web-worker";

import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

export default {
    name: "Search",
    data: function() {
        return {
            searchText: "",
            isSearching: false,
            isPickingMatch: false,
            worker: {},
            matches: [],
            matchSelected: "",
            showErrorOnSearch: false,
            errorMessage: "",
            fuzz: 1
        };
    },
    computed: {
        ...mapGetters(["rom", "lastSearchText", "lastSearchMatches", "lastSearchSelectedMatch"])
    },
    created: function() {
        this.searchText = this.lastSearchText;
        this.matches = this.lastSearchMatches;
        this.matchSelected = this.lastSearchSelectedMatch;

        this.worker = sww.create([
            {
                message: "search",
                func: function(rom, searchText, fuzz) {
                    const maxMatches = 25;

                    let matches = [];

                    for (let i = 0; i < rom.byteLength - searchText.length; i++) {
                        let matchScore = 0;

                        for (let c = 0; c < searchText.length - 1; c++) {
                            if (
                                rom[i + c * 2] +
                  (searchText[c + 1].charCodeAt() -
                    searchText[c].charCodeAt()) ==
                rom[i + c * 2 + 2]
                            ) {
                                matchScore++;
                            }
                        }

                        if (matchScore >= searchText.length - fuzz - 1) {
                            matches.push(i);
                        }

                        if( matches.length >= maxMatches ) {
                            break;
                        } 
                    }

                    return { matches: matches, searchText: searchText };
                }
            }
        ]);
    },
    methods: {
        ...mapMutations(["setSearchText", "setSearchMatches", "setSelectedMatch"]),
        startSearch: function() {
            this.showErrorOnSearch = false;

            if( this.searchText.length < 3 ) {
                this.showErrorOnSearch = true;
                this.errorMessage = "Please enter at least 3 characters to search for.";
                return;
            }

            this.setSearchText(this.searchText);

            this.isSearching = true;
            this.matches = [];

            let context = this;

            this.worker
                .postMessage("search", [this.rom, this.searchText, this.fuzz])
                .then(results => {
                    const matches = this.matches;
                    const rom = this.rom;

                    if (results.matches.length == 0 ) {
                        this.showErrorOnSearch = true;
                        this.errorMessage = "No results found, try another string or increase the fuzz amount.";
                    }
                    else {
                        if( results.matches.length > 1 ) {
                            this.isPickingMatch = true;
                        }

                        results.matches.forEach(function(address) {
                            let matchSection = rom.slice(
                                address,
                                address + results.searchText.length * 2
                            );
                            let byteBuffer = [];

                            for (var i = 0; i < results.searchText.length * 2; i++) {
                                byteBuffer.push(context.toHexString(matchSection[i], 2));
                            }

                            matches.push({ address: address, bytes: byteBuffer.join("") });
                        });

                        if( results.matches.length == 1 ) {
                            this.selectMatch(results.matches[0]);
                        }
                    }

                    this.isSearching = false;
                    this.setSearchMatches(matches);
                });
        },
        selectMatch: function(match) {
            this.isPickingMatch = false;
            this.$emit("search-finished", match, this.searchText);
            this.matchSelected = match;
            this.setSelectedMatch( this.matchSelected );
        }
    }
};
</script>
