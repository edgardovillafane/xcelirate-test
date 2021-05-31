import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

export class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseDown: false,
      startPoint: null,
      endPoint: null,
      selectionBox: null,
      firstSelectedCell: false,
      allowSelectionBox: false,
    };

    this.selectElement = this.selectElement.bind(this);
    this.selectColumn = this.selectColumn.bind(this);
    this.selectBox = this.selectBox.bind(this);
    this.setStart = this.setStart.bind(this);
  }

  componentDidUpdate() {
    if (this.state.mouseDown && this.state.selectionBox !== null) {
      this.updateCollidingChildren(this.state.selectionBox);
    }
  }

  /**
   * Detect 2D box intersection
   */
  boxIntersects(boxA, boxB) {
    if (
      boxA.left <= boxB.left + boxB.width &&
      boxA.left + boxA.width >= boxB.left &&
      boxA.top <= boxB.top + boxB.height &&
      boxA.top + boxA.height >= boxB.top
    ) {
      return true;
    }
    return false;
  }

  /**
   * change className if item is selected
   * collisions with selectionBox
   */
  updateCollidingChildren(selectionBox) {
    var tmpBox = null;
    var _this = this;
    // iterating all elements asking for intersection with selection area
    var els = document.getElementsByClassName("element");
    for (var i = 0; i < els.length; i++) {
      tmpBox = {
        top: els[i].offsetTop,
        left: els[i].offsetLeft,
        width: els[i].clientWidth,
        height: els[i].clientHeight,
      };
      if (_this.boxIntersects(selectionBox, tmpBox)) {
        els[i].className = "element temp-selected";
      }
    }
  }

  /**
   * Selecting items
   * onMouseUp callback
   */
  selectElement(element) {
    this.setState({
      allowSelectionBox: false,
    });
    if (this.state.selectionBox === null) {
      // toggle unique cell selection after click or tap
      this.toggleSelection(element);
    } else {
      //updating to selected item from temp selection draw
      var els = document.getElementsByClassName("element");
      for (var i = 0; i < els.length; i++) {
        if (els[i].className === "element temp-selected")
          //using the state of first selected cell
          els[i].className = this.state.firstSelectedCell
            ? "element selected"
            : "element";
      }
    }
    this.setState({ mouseDown: false, selectionBox: null });
    this.forceUpdate();
  }

  /*
   * toggle cell status
   */
  toggleSelection(e) {
    e.preventDefault();
    e.target.className =
      e.target.className === "element selected"
        ? "element"
        : "element selected";
    this.sendData();
  }

  /*
   * selecting column by double click
   */
  selectColumn(element) {
    //getting column from element
    var col = 0;
    var id = parseInt(element.target.id);
    for (var i = 0; i < id; i++) {
      if (id !== i) {
        col++;
        if (col > 4) {
          col = 0;
        }
      }
    }
    //selecting cells of a same column
    for (var x = 0; x < 5; x++) {
      var targetCell = parseInt(col) + x * 5;
      document.getElementById(targetCell).className = "element selected";
    }
  }

  /*
   * mouseDown and touchStart callback
   * defines the start point of selection box
   */
  setStart(e) {
    e.preventDefault(e);
    var startPoint = {};
    if (this.isMobile) {
      //mobile hack
      if (typeof e.changedTouches !== "undefined") {
        var touch = e.changedTouches[0];
        startPoint = {
          x: parseInt(touch.pageX),
          y: parseInt(touch.pageY),
        };
      } else {
        //desktop values
        startPoint = {
          x: e.pageX,
          y: e.pageY,
        };
      }
      var initialSelectedCell =
        e.target.className === "element selected" ? true : false;
      this.setState({
        startPoint: startPoint,
        mouseDown: true,
        firstSelectedCell: initialSelectedCell,
      });
    }
    //waiting 1 second for longtap
    //starting selection box drawing
    setTimeout(() => {
      if (this.state.mouseDown) {
        e.target.className = "element temp-selected";
        this.setState({
          allowSelectionBox: true,
        });
      }
    }, 1000);
  }

  /*
   * mouseMove and touchMove callback
   * update the selection box coordinates
   */
  selectBox(e) {
    e.preventDefault();
    if (this.state.mouseDown && this.state.allowSelectionBox) {
      var endPoint = {};
      if (this.isMobile) {
        if (typeof e.changedTouches !== "undefined") {
          var touch = e.changedTouches[0];

          endPoint = {
            x: parseInt(touch.pageX),
            y: parseInt(touch.pageY),
          };
        } else {
          endPoint = {
            x: e.pageX,
            y: e.pageY,
          };
        }
        this.setState({
          selectionBox: this.calculateSelectionBox(
            this.state.startPoint,
            endPoint
          ),
          endPoint: endPoint,
        });
      }
    }
  }

  //verify if mobile or desktop
  isMobile() {
    return /Android|webOS|iPhone/i.test(navigator.userAgent);
  }

  /**
   * Calculate selection box dimensions
   */
  calculateSelectionBox(startPoint, endPoint) {
    if (
      typeof startPoint === "undefined" ||
      startPoint === null ||
      typeof endPoint === "undefined" ||
      endPoint === null
    ) {
      return null;
    }
    var parentNode = document.getElementById("grid");
    var left = Math.min(startPoint.x, endPoint.x) - parentNode.offsetLeft;
    var top = Math.min(startPoint.y, endPoint.y) - parentNode.offsetTop;
    var width = Math.abs(startPoint.x - endPoint.x);
    var height = Math.abs(startPoint.y - endPoint.y);
    return {
      left: left,
      top: top,
      width: width,
      height: height,
    };
  }

  
  // this post to https://postman-echo.com/post is not possible due CORS not allowed by server
  // here an alternative mock server to receive a response
  sendData() {
    fetch("https://a9876ed8-6240-4a7f-9630-6e4c0a0494b8.mock.pstmn.io", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        state: this.state,
      }),
    })
      .then((data) => console.log("Data: ", data.status))
      .catch((err) => console.error("ERROR: ", err.message));
  }

  render() {
    // generate grid
    var data = [];
    for (var i = 0; i < 25; i++) {
      data.push(
        <div
          className="element"
          key={i}
          id={i}
          onMouseUp={this.selectElement}
          onMouseDown={this.setStart}
          onDoubleClick={this.selectColumn}
          onMouseMove={this.selectBox}
          onTouchStart={this.setStart}
          onTouchMove={this.selectBox}
          onTouchEnd={this.selectElement}
        ></div>
      );
    }
    return (
      <div className="grid" id="grid">
        {data}
      </div>
    );
  }
}

ReactDOM.render(<Grid></Grid>, document.getElementById("game"));
