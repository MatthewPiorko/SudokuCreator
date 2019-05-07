let setListener = function() {
  let input = window.document.getElementById('alphabet')
  let button = window.document.getElementById('regenerate')

  button.onclick = function() {

    console.log(`./?alphabet=${encodeURI(input.value)}`);
    window.location = `./?alphabet=${encodeURI(input.value)}`
  }
}

window.onload = setListener;