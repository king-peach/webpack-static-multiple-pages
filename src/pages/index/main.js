import './page.scss';
import _ from 'lodash';
import ImgSrc from 'images/bg.jpg';
import '../../js/common';

function component () {
  var node = document.createElement('div');

  node.innerHTML = _.join(['webpack', 'loaded', '!'], ' ');
  node.className = 'test';

  return node;
}

document.body.appendChild(component());

var img = document.createElement('img');
img.src = ImgSrc;
document.body.appendChild(img);
$('img').css({ width: '100px' });
