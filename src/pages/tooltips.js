import * as React from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/react"

const tooltip = css`
  .tooltip {
    --tool-tip-color: #323230;
    --tool-tip-divider-color: #666;
    user-select: none;
    position: absolute;
  }

  .tooltip__head {
    background: var(--tool-tip-color);
    text-align: center;
    border-radius: 5px;
    padding: 0.5rem;
    > * {
      margin-right: 5px;
    }
  }

  .tooltip__tail {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid var(--tool-tip-color);
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }

  .tooltip__icon {
    vertical-align: bottom;
    display: inline-block;
    width: 25px;
    height: 25px;
    text-align: center;
  }

  .tooltip__divider {
    display: inline-block;
    width: 0.1rem;
    height: 80%;
    vertical-align: top;
    border-left: 1px solid var(--tool-tip-divider-color);
  }

  .tooltip__icon__svg {
    width: 100%;
    height: 100%;
    fill: white;
  }

  .article {
    margin: 0 auto;
    width: 500px;
  }
`
function calPosition(toolTipNode) {
  const selection = document.getSelection()
  const anchorNode = selection.anchorNode
  const focusNode = selection.focusNode

  const toolTipWidth = toolTipNode.offsetWidth
  const toolTipHeight = toolTipNode.offsetHeight

  const rangeRects = selection.getRangeAt(0).getClientRects()

  const parentElement = anchorNode.parentElement
  const y = rangeRects[0].y
  const x =
    rangeRects.length > 1
      ? parentElement.offsetLeft + parentElement.offsetWidth / 2
      : rangeRects[0].x + rangeRects[0].width / 2

  toolTipNode.style.top = `${y - toolTipHeight}px`
  toolTipNode.style.left = `${x - toolTipWidth / 2}px`
}

function Tooltip() {
  // can display
  const [displayTooltip, setDisplayTooltip] = React.useState(false)
  // if current has some text is selected
  const [isElected, setIsElected] = React.useState(false)
  const tooltipRef = React.useRef(null)
  React.useEffect(() => {
    document.addEventListener("selectionchange", hsaTextSelected)
    return () => {
      document.current.removeEventListener("selectionchange", hsaTextSelected)
    }
  }, [])

  function hsaTextSelected(e) {
    const selection = document.getSelection()
    const startNode = selection.anchorNode
    const endNode = selection.focusNode
    if (selection.type !== "Range") {
      // no text is selcted
      return
    }
    if (startNode !== endNode) {
      // Cross-paragraph selection
      return
    }
    console.log({ startNode, endNode, qu: startNode == endNode, isElected })

    setIsElected(true)
  }

  function hiddenTooltop() {
    console.log({ isElected, displayTooltip })
    if (isElected) {
      setDisplayTooltip(true)
      // I had show tooltip for those selectd text, on other text need tooltip
      // so I set to false
      setIsElected(false)
      calPosition(tooltipRef.current)
    } else {
      setDisplayTooltip(false)
    }
  }

  return (
    <section css={tooltip}>
      <ToolTipLayout displayTooltip={displayTooltip} tooltipRef={tooltipRef} />

      <div className="article" onMouseUp={hiddenTooltop}>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          eget sem pellentesque, ultricies dolor egestas, malesuada mauris.
          Fusce lorem felis, egestas tincidunt purus et, sodales luctus lectus.
          Praesent a congue eros. Interdum et malesuada fames ac ante ipsum
          primis in faucibus. Mauris vitae malesuada urna. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Ut in mauris justo. Curabitur
          rutrum, est nec viverra rutrum, dolor est volutpat dolor, vitae auctor
          urna nulla nec nibh. Nunc convallis libero luctus purus auctor, sed
          aliquet lectus fermentum. Nunc a massa ac sapien viverra consequat.
        </div>
        <div>
          Aliquam arcu mi, vehicula a sodales ut, dictum sit amet ex. Sed nec
          enim sed elit dapibus porta at eu felis. Quisque faucibus vel sem in
          bibendum. Nulla dictum, nunc in mattis tincidunt, nisi sapien blandit
          metus, ut bibendum tortor metus non nunc. Duis eu ultricies risus,
          quis mollis magna. Duis efficitur congue ante ut imperdiet. Vestibulum
          at sodales eros. Etiam id dictum ligula.
        </div>
      </div>
    </section>
  )
}


function ToolTipLayout({ displayTooltip, tooltipRef }) {
  return (
    <div
      className="tooltip"
      css={css`
        visibility: ${displayTooltip ? "inital" : "hidden"};
      `}
      ref={tooltipRef}
    >
      <div className="tooltip__head">
        <div className="tooltip__icon">
          <svg className="tooltip__icon__svg">
            <path
              d="M19.074 21.117c-1.244 0-2.432-.37-3.532-1.096a7.792 7.792 0 0 1-.703-.52c-.77.21-1.57.32-2.38.32-4.67 0-8.46-3.5-8.46-7.8C4 7.7 7.79 4.2 12.46 4.2c4.662 0 8.457 3.5 8.457 7.803 0 2.058-.85 3.984-2.403 5.448.023.17.06.35.118.55.192.69.537 1.38 1.026 2.04.15.21.172.48.058.7a.686.686 0 0 1-.613.38h-.03z"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
        <div className="tooltip__icon">
          <svg className="tooltip__icon__svg">
            <path
              d="M19.074 21.117c-1.244 0-2.432-.37-3.532-1.096a7.792 7.792 0 0 1-.703-.52c-.77.21-1.57.32-2.38.32-4.67 0-8.46-3.5-8.46-7.8C4 7.7 7.79 4.2 12.46 4.2c4.662 0 8.457 3.5 8.457 7.803 0 2.058-.85 3.984-2.403 5.448.023.17.06.35.118.55.192.69.537 1.38 1.026 2.04.15.21.172.48.058.7a.686.686 0 0 1-.613.38h-.03z"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
        <div className="tooltip__icon">
          <svg className="tooltip__icon__svg">
            <path
              d="M19.074 21.117c-1.244 0-2.432-.37-3.532-1.096a7.792 7.792 0 0 1-.703-.52c-.77.21-1.57.32-2.38.32-4.67 0-8.46-3.5-8.46-7.8C4 7.7 7.79 4.2 12.46 4.2c4.662 0 8.457 3.5 8.457 7.803 0 2.058-.85 3.984-2.403 5.448.023.17.06.35.118.55.192.69.537 1.38 1.026 2.04.15.21.172.48.058.7a.686.686 0 0 1-.613.38h-.03z"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
        <div className="tooltip__divider"></div>
        <div className="tooltip__icon">
          <svg className="tooltip__icon__svg">
            <path
              d="M19.074 21.117c-1.244 0-2.432-.37-3.532-1.096a7.792 7.792 0 0 1-.703-.52c-.77.21-1.57.32-2.38.32-4.67 0-8.46-3.5-8.46-7.8C4 7.7 7.79 4.2 12.46 4.2c4.662 0 8.457 3.5 8.457 7.803 0 2.058-.85 3.984-2.403 5.448.023.17.06.35.118.55.192.69.537 1.38 1.026 2.04.15.21.172.48.058.7a.686.686 0 0 1-.613.38h-.03z"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
      <div className="tooltip__tail"></div>
    </div>
  )
}

export default Tooltip