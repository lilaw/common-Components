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

class Database {
  constructor() {
    this.tweets = []
  }

  query({ lastTweetId, pageSize }) {
    if (!lastTweetId) {
      return this.tweets.slice(0, pageSize)
    }
    for (let i = 0; i < this.tweets.length; i++) {
      const currentTweet = this.tweets[i]
      if (currentTweet.id === lastTweetId) {
        return this.tweets.slice(i + 1, i + 1 + pageSize)
      }
    }
    return []
  }

  insert(tweet) {
    this.tweets.push({
      tweet,
      id: getRandomString({ length: 10 }),
      timestamp: new Date().getTime(),
    })
  }
}
const database = new Database()

function getTweetsHandler(data) {
  const pageSize = data.pageSize
  const sortOrder = data.sortOrder
  const lastTweetId = data.lastTweetId

  if (sortOrder !== "recent") {
    throw new Error("I dont know how to handle that")
  }

  return database.query({ lastTweetId, pageSize })
}

function postTweetHandler(data) {
  database.insert(data.tweet)
}

const endpoints = {
  "/tweets": {
    get: getTweetsHandler,
    post: postTweetHandler,
  },
}

// API library

function getFunction(url, data, callback) {
  const domain = url.substring(0, url.indexOf("/"))
  const endpoint = url.substring(url.indexOf("/"), url.length)

  setTimeout(() => {
    callback(endpoints[endpoint]["get"](data))
  }, 1000)
}
function postFunction(url, data, callback) {
  const domain = url.substring(0, url.indexOf("/"))
  const endpoint = url.substring(url.indexOf("/"), url.length)
  setTimeout(() => {
    callback(endpoints[endpoint]["post"](data))
  }, 1000)
}

const api = {
  get: getFunction,
  post: postFunction,
}

// add data
function loadTestData() {
  const sampleData = []
  const sampleDataSize = 20
  for (let i = 0; i < sampleDataSize; i++) {
    const message = getRandomString({
      length: getRandomInteger({ min: 10, max: 17 }),
      includeSpaces: true,
    })
    const firstName = getRandomString({
      length: getRandomInteger({ min: 3, max: 7 }),
      includeSpaces: false,
    })
    const lastName = getRandomString({
      length: getRandomInteger({ min: 3, max: 7 }),
      includeSpaces: false,
    })
    const handle =
      "@" +
      getRandomString({
        length: getRandomInteger({ min: 4, max: 8 }),
        includeSpaces: false,
      })
    sampleData.push({
      tweet: {
        name: `${firstName} ${lastName}`,
        message,
        handle,
      },
    })
  }
  for (const data of sampleData) {
    // Do nothing with result
    api.post(HOST + "tweets", data, () => {})
  }
}

const style = css`
  .tweet {
    width: 38rem;
    position: relative;
    border: 1px solid grey;
  }

  .tweet__main {
    font-family: Helvetica;
  }

  .tweet__main__header {
  }

  .tweet__main__header__item {
    display: inline-block;
  }

  .tweet__main__header__item--name {
    font-size: 15px;
    font-weight: bold;
  }

  .tweet__main__header__item--handle,
  .tweet__main__header__item--duration {
    font-weight: 200;
    color: lightgrey;
  }

  .tweet__main__message {
    overflow-wrap: break-word;
  }

  .tweet__footer {
  }

  .tweet__footer__stats {
    display: inline-block;
    width: 4rem;
  }

  .tweet__footer__stats__item {
    display: inline-block;
  }

  .tweet__column {
    display: inline-block;
  }

  .tweet__icon {
    width: 1.5rem;
    vertical-align: middle;
  }

  .tweet__main {
    width: 25rem;
  }

  .tweet__menu {
    position: absolute;
    right: 1rem;
    top: 1rem;
  }

  .tweet__menu:hover {
    cursor: pointer;
  }

  .tweet__menu__icon {
    width: 1rem;
  }

  .avatar {
    width: 6rem;
    vertical-align: top;
    text-align: center;
  }

  .avatar__image {
    border-radius: 50%;
    width: 4rem;
    height: 4rem;
  }
`

const DEFAULT_PAGE_SIZE = 5
const DEFAULT_SORT_ORDER = "recent"
const HOST = "host.com/"

function hydrate(callback) {
  const params = {
    pageSize: DEFAULT_PAGE_SIZE,
    sortOrder: DEFAULT_SORT_ORDER,
  }
  api.get(HOST + "tweets", params, callback)
}
loadTestData()

function List() {
  const [tweets, setTweets] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const mergeTweets = data => {
    setLoading(false)
    setTweets(prev => [...prev, ...data])
  }

  React.useEffect(() => {
    hydrate(mergeTweets)
    setLoading(true)
  }, [])

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [tweets])
  
  function onScroll(event) {
    if (loading) return
    const scrolledTo = window.innerHeight + window.pageYOffset
    const scrollLimit = document.body.offsetHeight
    const scrollThreshold = 30

    if (scrollLimit - scrolledTo <= scrollThreshold) {

      const params = {
        pageSize: DEFAULT_PAGE_SIZE,
        sortOrder: DEFAULT_SORT_ORDER,
        lastTweetId: tweets[tweets.length-1].id,
      }
      api.get(HOST + "tweets", params, mergeTweets)
      setLoading(true)
    }
  }
  return (
    <div css={style}>
      {tweets.map(({ id, tweet }) => (
        <Tweet id={id} {...tweet} />
      ))}
      {loading && <Loading />}
    </div>
  )
}

function Tweet({ name, handle, message }) {
  return (
    <div class="tweet">
      <div class="tweet__column avatar">
        <img class="avatar__image" src={"/favicon-32x32.png"} />
      </div>
      <div class="tweet__column tweet__main">
        <div class="tweet__main__header">
          <div class="tweet__main__header__item tweet__main__header__item--name">
            {name}
          </div>
          <div class="tweet__main__header__item tweet__main__header__item--badge">
            <img
              class="tweet__icon tweet__main__header__item__badge"
              src="http://educative.io/udata/nWjylg5XloB/footer_icon.svg"
            />
          </div>
          <div class="tweet__main__header__item tweet__main__header__item--handle">
            {handle}
          </div>
          <div class="tweet__main__header__item tweet__main__header__item--duration">
            7h
          </div>
        </div>
        <div class="tweet__main__message">{message}</div>
        <div class="tweet__footer">
          <div class="tweet__footer__stats">
            <img
              class="tweet__icon tweet__footer__stats__item"
              src="http://educative.io/udata/nWjylg5XloB/footer_icon.svg"
            />
            <div class="tweet__footer__stats__item">10</div>
          </div>
          <div class="tweet__footer__stats">
            <img
              class="tweet__icon tweet__footer__stats__item"
              src="http://educative.io/udata/nWjylg5XloB/footer_icon.svg"
            />
            <div class="tweet__footer__stats__item">900</div>
          </div>
          <div class="tweet__footer__stats">
            <img
              class="tweet__icon tweet__footer__stats__item"
              src="http://educative.io/udata/nWjylg5XloB/footer_icon.svg"
            />
            <div class="tweet__footer__stats__item">1.1K</div>
          </div>
          <div class="tweet__footer__stats">
            <img
              class="tweet__icon tweet__footer__stats__item"
              src="http://educative.io/udata/nWjylg5XloB/footer_icon.svg"
            />
          </div>
        </div>
      </div>
      <div class="tweet__menu">
        <img
          class="tweet__icon tweet__menu__icon"
          src="http://educative.io/udata/w66j6pMjng6/down_icon.svg"
        />
      </div>
    </div>
  )
}

function Loading() {
  return (
    <p>
      Here I am... Loading...
      <img
        className="loading__image"
        src="http://educative.io/udata/1m5lkL7p9Q0/dog.jpeg"
      />
    </p>
  )
}
export default List
