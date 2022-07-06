import logo from './logo.svg';
import './App.css';


function box() {
  return (
    <div className="red">Ferme</div>
  )
}


function removePicture(e) {
  e.target.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode)
}


function previewMedia(e) {
  let fileInput = e.target;
  let imageContainer = e.target.parentNode.parentNode.parentNode.lastChild;
  e.target.parentNode.parentNode.style.display = "none";

  for (let i of fileInput.files) {
    let reader = new FileReader();
    reader.onload = () => {
      let srcImg = reader.result;
      let blocPicture = document.createElement("div");
      blocPicture.className = "bloc-picture";
      blocPicture.innerHTML = `\
        <div class="picture">\
          <img src="${srcImg}"></img>\
        </div>\
      `;
      imageContainer.appendChild(blocPicture)
    }
    reader.readAsDataURL(i);
  }

}

function previewCharacter(e) {
  let fileInput = e.target;
  let imageContainer = e.target.parentNode.parentNode.parentNode.lastChild;

  for (let i of fileInput.files) {
    console.log(i);
    let reader = new FileReader();
    reader.onload = () => {
      let srcImg = reader.result;
      let blocPicture = document.createElement("div");
      blocPicture.className = "bloc-picture";
      blocPicture.innerHTML += `\
        <div class="picture">\
          <img src="${srcImg}"></img>\
        </div>\
        <div class="close">\
          <img src="close.png"></img>\
        </div>\
      `;
      blocPicture.getElementsByClassName("close")[0].onclick = (e) => { removePicture(e); };
      imageContainer.appendChild(blocPicture)
    }
    reader.readAsDataURL(i);
  }
}


function oui(e) {
  e.target.parentNode.removeChild(e.target)
}

function openNewBox() {
  var newBox = document.createElement("div");
  newBox.onclick = (e) => oui(e);
  newBox.classList = "red";
  newBox.innerHTML = "Ferme";
  document.getElementsByTagName("main")[0].appendChild(newBox);
}


function removeCharacter(e) {
  e.target.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode)
}


function addNewCharacter() {
  let charactersContainer = document.getElementById("characters");
  let newCharacter = document.createElement("div");
  let blocPictures = document.createElement("div");
  blocPictures.className = "bloc-pictures";

  newCharacter.classList = "box";
  newCharacter.innerHTML += `
    <div class="header">\
      <div class="name">\
        <label>\
          <input type="text" placeholder="Charles" size="10"></input>\
        </label>\
      </div>\
      <div class="close"><img src="close.png"></img></div>\
    </div>\
    <div class="box-bloc-pictures">\
      <div class="add">\
        <label>\
          <div class="add">\
            <div class="picture"><img src="add.png"></img></div>\
          </div>\
          <input type="file" accept="image/*" multiple></input>\
        </label>\
      </div>\
    </div>\
  `;

  newCharacter.getElementsByClassName("box-bloc-pictures")[0].appendChild(blocPictures)
  newCharacter.getElementsByClassName("close")[0].onclick = (e) => { removeCharacter(e); };
  newCharacter.getElementsByTagName("input")[1].oninput = (e) => { previewCharacter(e); };
  charactersContainer.insertBefore(newCharacter, charactersContainer.lastChild);
}


function addNewMedia() {
  let MediasContainer = document.getElementById("medias");
  let newMedia = document.createElement("div");
  let blocPictures = document.createElement("div");
  blocPictures.className = "bloc-pictures";

  newMedia.classList = "box";
  newMedia.innerHTML += '\
    <div class="header">\
      <div class="name">\
        <label>\
          <input type="text" placeholder="fête de fin d\'année" size="10"></input>\
        </label>\
      </div>\
      <div class="close"><img src="close.png"></img></div>\
    </div>\
    <div class="box-bloc-pictures">\
      <div class="add">\
        <label>\
          <div class="add">\
            <div class="picture"><img src="add.png"></img></div>\
          </div>\
          <input type="file" accept="image/*"></input>\
        </label>\
      </div>\
      <div class="bloc-pictures"></div>\
    </div>\
  ';
  newMedia.getElementsByClassName("box-bloc-pictures")[0].appendChild(blocPictures)
  newMedia.getElementsByClassName("close")[0].onclick = (e) => { removeCharacter(e); };
  newMedia.getElementsByTagName("input")[1].oninput = (e) => { previewMedia(e); };
  MediasContainer.insertBefore(newMedia, MediasContainer.lastChild);
}

function App() {
  return (
    <main>
      <div class="forms">
        <div class="bloc-form" id="characters">
          <div class="title">Personnage(s)</div>
          <div class="box">
            <div class="header">
              <div class="name">
                <label>
                  <input type="text" placeholder="Charles" size="10"></input>
                </label>
              </div>
              <div class="close" onClick={(e) => { removeCharacter(e); }}><img src="close.png"></img></div>
            </div>
            <div class="box-bloc-pictures">
              <div class="add">
                <label>
                  <div class="add">
                    <div class="picture"><img src="add.png"></img></div>
                  </div>
                  <input type="file" accept="image/*" onInput={(e) => { previewCharacter(e); }} multiple></input>
                </label>
              </div>
              <div class="bloc-pictures"></div>
            </div>
          </div>
          <div class="box">
            <div class="header">
            </div>
            <div class="box-bloc-pictures">
              <div class="add">
                <div class="picture" onClick={() => { addNewCharacter(); }}><img src="add.png"></img></div>
              </div>
            </div>
          </div>
        </div>
        <div class="bloc-form">
          <div class="title">Media(s)</div>
          <div class="box-medias" id="medias">
            <div class="box">
              <div class="header">
                <div class="name">
                  <label>
                    <input type="text" placeholder="Photo de classe" size="10"></input>
                  </label>
                </div>
                <div class="close" onClick={(e) => { removeCharacter(e); }}><img src="close.png"></img></div>
              </div>
              <div class="box-bloc-pictures">
                <div class="add">
                  <label>
                    <div class="add">
                      <div class="picture"><img src="add.png"></img></div>
                    </div>
                    <input type="file" accept="image/*" onInput={(e) => { previewMedia(e); }}></input>
                  </label>
                </div>
                <div class="bloc-pictures"></div>
              </div>
            </div>
            <div class="box">
              <div class="header" id="fakeHeader">
                <div class="name">
                  <label>
                    <input type="text" placeholder="photo de classe" size="10"></input>
                  </label>
                </div>
                <div class="close" onClick={(e) => { removeCharacter(e); }}><img src="close.png"></img></div>
              </div>
              <div class="box-bloc-pictures">
                <div class="add">
                  <div class="picture" onClick={() => { addNewMedia(); }}><img src="add.png"></img></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="rechercher">Rechercher</button>
    </main>
  );
}

export default App;
