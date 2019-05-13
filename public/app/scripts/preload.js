console.log("Top Bar Preload script execution");

function injectTitleBar(imageServerUrl){
  let title = document.title;
  // Add css and HTML for the top bar.

  let backgroundColor = "#1C1C31";
  let textColor = "#FFFFFF";

  var topBarHTML = `
  <style type="text/css">
  .topBar {
      z-index: 999999999;
      box-sizing: border-box;
      height: 20px;
      top: 0;
      left:0;
      background: ${backgroundColor};
      display: flex;
      align-items: center;
      -webkit-app-region: drag;
      width: 100%;
      color: ${textColor};
      text-align: center;
      overflow: hidden;
      vertical-align: middle;
      line-height: 35px;
      margin: 0 auto;
      letter-spacing: 2px;
      font-size: 10px;
    }

    .topBar-drag {
      margin: 0 auto;
    }

    .topBar-title {
      opacity: 0.4;
    }

    .topBar-close-x {
      -webkit-app-region: no-drag;
      position: absolute;
      height: 20px;
      width: 20px;
      right: 7px;
      padding: 5px;
      opacity: 0.9;
      z-index: 1000;
      cursor: pointer;
      box-sizing: border-box;
    }

    .topBar-close-x:hover {
      background-color: #0077cc;
      opacity: 1;
      border-radius: 3px;
    }

    .topBar-close-x:active {
      background: #014f86;
    }

    .topBar-maximize {
      -webkit-app-region: no-drag;
      position: absolute;
      height: 20px;
      width: 20px;
      right: 29px;
      padding: 5px;
      opacity: 0.9;
      z-index: 1000;
      cursor: pointer;
      box-sizing: border-box;
    }

    .topBar-maximize:hover {
      -webkit-app-region: no-drag;
      background-color: #0077cc;
      opacity: 1;
      border-radius: 3px;
    }

    .topBar-maximize:active {
      background: #014f86;
    }

    .topBar-minimize {
      -webkit-app-region: no-drag;
      position: absolute;
      height: 20px;
      width: 20px;
      right: 51px;
      padding: 5px;
      opacity: 0.9;
      z-index: 1000;
      cursor: pointer;
      box-sizing: border-box;
    }

    .topBar-minimize:hover {
      background-color: #0077cc;
      opacity: 1;
      border-radius: 3px;
    }

    .topBar-minimize:active {
      background: #014f86;
    }

  </style>

  <div class="topBar">
  <div class="topBar-drag">
    <span class="topBar-title">${title}</span>
  </div>
  <img class="topBar-minimize" src="${imageServerUrl}/minimize.svg" alt="">
  <img class="topBar-maximize" src="${imageServerUrl}/maximize.svg" alt="">
  <img class="topBar-close-x" src="${imageServerUrl}/close-x.svg" alt="">
 </div>`;

 fin.desktop.Window.getCurrent().getOptions((options) => {
  if (!options.frame) {
    document.body.insertAdjacentHTML('beforebegin', topBarHTML);

    // Add event listeners to the top bar icons
    document.getElementsByClassName("topBar-minimize")[0].addEventListener('click', function () {
      fin.desktop.Window.getCurrent().minimize();
    });

    document.getElementsByClassName("topBar-close-x")[0].addEventListener('click', function () {
      fin.desktop.Window.getCurrent().close();
    });

    var maximized = false;

    document.getElementsByClassName("topBar-maximize")[0].addEventListener('click', function (e) {
      if (maximized === false) {
        fin.desktop.Window.getCurrent().maximize();
        e.srcElement.src = imageServerUrl + "/restore.svg"
        maximized = true;
      } else {
        fin.desktop.Window.getCurrent().restore();
        e.srcElement.src = imageServerUrl + "/maximize.svg"
        maximized = false;
      }
    });
  }
});

window._topBarPreload = {
  changeText: function (text) {
    document.getElementsByClassName("topBar-title").innerHTML = text;
  }
}
};

window.addEventListener('load', () => {
    var serverport;
    var target;
    fin.Window.getCurrentSync().getOptions()
    .then(opts => {
        serverPort = opts.customData;
        target = "http://localhost:" + serverPort;
        console.log("Server Port: " + serverPort);
        injectTitleBar(target);
    }).catch(err => console.log(err));
});