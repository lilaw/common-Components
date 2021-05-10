import * as React from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/react"

// Server

function getRandomString({ length }) {
  const characterChoices =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 "
  const characters = []
  while (characters.length < length) {
    const randomIndex = Math.floor(Math.random() * characterChoices.length)
    characters.push(characterChoices[randomIndex])
  }
  return characters.join("")
}

function getRandomInteger({ min, max }) {
  return Math.floor((Math.random() + min) * (max - min))
}

const endpoints = {
  "/": {
    get: () => "hello world",
  },
  "/autocomplete": {
    get: getAutocompleteHandler,
  },
}

// API library

function getFunction(url, data, callback) {
  const domain = url.substring(0, url.indexOf("/"))
  const endpoint = url.substring(url.indexOf("/"), url.length)

  callback(endpoints[endpoint]["get"](data))
}

const api = {
  get: getFunction,
}

function generateSuggestion(prefix) {
  const RATIO_EXACT_MATCH = 0.3
  const RATIO_AUTOCORRECT = 0.1

  if (Math.random() < RATIO_AUTOCORRECT) {
    return getRandomString({
      length: getRandomInteger({ min: 1, max: prefix.length }),
    })
  }

  if (Math.random() < RATIO_EXACT_MATCH) {
    return prefix
  }
  return (
    prefix + getRandomString({ length: getRandomInteger({ min: 1, max: 10 }) })
  )
}
function getAutocompleteHandler(data) {
  const MAX_CHARS = 10
  const NUM_AUTOCOMPLETE_RESULTS = 10
  const RATIO_AUXILLERY_DATA = 0.1

  if (data.length > MAX_CHARS) {
    return []
  }

  const results = []
  while (results.length < NUM_AUTOCOMPLETE_RESULTS) {
    const suggestion = generateSuggestion(data)

    if (results.find(result => result.suggestion === suggestion)) {
      continue
    }

    if (Math.random() < RATIO_AUXILLERY_DATA) {
      for (let i = 0; i < 2; i++) {
        results.push({
          suggestion,
          auxillery: getRandomString({
            length: getRandomInteger({ min: 5, max: 15 }),
          }),
        })
      }
    } else {
      results.push({ suggestion, auxillery: "" })
    }
  }
  return results
}













const style = css`
.search {
  --light-grey: #ccc;
  --item-hover-grey: #E6E6E6;
  --button-grey: #757575;
  --button-bg-grey: #f1f1f1;
  --microphone-width: 1.5rem;

  width: 36rem;
  margin: 0 auto;
  margin-top: 5rem;
  font-family: Arial;
}

.search--autosuggest {
  box-shadow: 1px 4px 8px #D3D3D3;
}

.search__bar {
  position: relative;
  border: 1px solid var(--light-grey);
  border-radius: 2px;
  box-shadow: 1px 4px 8px #D3D3D3;
}

.search__bar--autosuggest {
  box-shadow: none;
}

.search__bar__input {
  border: none;
  width: calc(100% - var(--microphone-width) - 0.7rem);
  padding: 0.6rem;
  padding-right: calc(var(--microphone-width) - 0.1rem);
  font-size: 16px;
  font-family: Arial;
  outline: none;
}

.search__bar__microphone {
  width: var(--microphone-width);
  position: absolute;
  right: 0.2rem;
  top: 0.5rem;
}

.search__suggestions {
  border: 1px solid var(--light-grey);
  border-top: 0;
  border-bottom: 0;
  font-size: 16px;
  font-family: Arial;
}

.search__suggestions__list {
  padding-right: 1rem;
  line-height: 1.5;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.search__suggestions__list__result {
  padding-left: 1rem;
}

.search__suggestions__list__result:hover {
  background: var(--item-hover-grey);
  cursor: default;
}

.search__actions {
  margin-top: 2rem;
  text-align: center;
}

.search__actions--autosuggest {
  margin: 0;
  border: 1px solid var(--light-grey);
  border-top: 0;
  padding: 1rem 0 0.1rem 0;
}

.search__actions__action {
  height: 2rem;
  font-size: 13px;
  font-weight: bold;
  font-family: Arial;
  color: var(--button-grey);
  background: var(--button-bg-grey);
  padding: 0.4rem 1rem;
  outline: none;
  border: none;
  margin: 0.2 0.2rem;
}

.search__actions__action:hover {
  color: black;
  box-shadow: 0 0 1px #A9A9A9;
}
`


function wrapBoldedCharacters({ inputValue, suggestion }) {
  if (suggestion.startsWith(inputValue)) {
    return <span>{suggestion.substring(
      0,
      inputValue.length
    )}<b>{suggestion.substring(inputValue.length, suggestion.length)}</b></span>
  }
  return <span><b>${suggestion}</b></span>
}



function Autocomplete() {
  const [input, setInput] = React.useState("")
  const [suggest, setSuggest] = React.useState([])
  function getValue(e) {
    setInput(e.target.value)
  }

  React.useEffect(() => {
    if (input)  setSuggest( getAutocompleteHandler(input))
    else setSuggest([])
  }, [input])

  return (
    <section css={style}>
      
    <div className="search" >
      <div className="search__bar">
        <input
          type="text"
          className="search__bar__input"
          onChange={getValue}
          value={input}
        />
      </div>
      <div className="search__suggestions">
        <ul className="search__suggestions__list">
          { Boolean(suggest.length) && suggest.map(s =>  <SuggestionItem  inputValue={input} suggestion={s.suggestion} auxillery={s.auxillery} />)}
        </ul>
      </div>
      <div className="search__actions">
        <button className="search__actions__action search__actions__action--search">
          Google search
        </button>
        <button className="search__actions__action search__actions__action--lucky">
          I'm Feeling Lucky
        </button>
      </div>
    </div>
    </section>
  )
}

function SuggestionItem({ inputValue, suggestion, auxiliaryData }) {
  const auxiliaryString = auxiliaryData ? ` - ${auxiliaryData}` : ""
  const boldProcessedSuggestion = wrapBoldedCharacters({
    inputValue: inputValue,
    suggestion,
  })
  return (
    <li class="search__suggestions__list__result">
      {boldProcessedSuggestion}
      {auxiliaryString}
    </li>
  )
}
export default Autocomplete
