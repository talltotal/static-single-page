function trim (str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '')
}
function hasClass (el, className) {
  return (el.className).indexOf(className) !== -1
}
function addClass (el, className) {
  if (!hasClass(el, className)) {
    el.className = (el.className === '') ? className : el.className + ' ' + className
  }
}
function removeClass (el, className) {
  el.className = trim((' ' + el.className + ' ').replace(' ' + className + ' ', ' '))
}
function debounce (delay, fn) {
  var lastExec = 0

  return function (index) {
    var elapsed = Number(new Date()) - lastExec
    if (elapsed > delay) {
      lastExec = Number(new Date())
      fn(index)
    }
  }
}
function processIndex (index, newIndex, len) {
  if (newIndex === 0 && index === len - 1) {
    return -1
  } else if (newIndex === len - 1 && index === 0) {
    return len
  } else if (index < newIndex - 1 && newIndex - index >= len / 2) {
    return len + 1
  } else if (index > newIndex + 1 && index - newIndex >= len / 2) {
    return -2
  }
  return index
}
function swiper () {
  const container = document.getElementById('swiper')
  const btnLeft = container.getElementsByClassName('banner-btn-left')[0]
  const btnRight = container.getElementsByClassName('banner-btn-right')[0]
  const list = ([].slice.call(container.getElementsByClassName('banner-item'), 0))
  const len = list.length
  const activeClassName = 'is-active'
  const animClassName = 'is-animating'
  const width = container.offsetWidth

  let current = 0
  let old = 0

  const handleClick = debounce(300, function (index) {
    updateIndex(index)
  })
  const updateIndex = function (newIndex) {
    if (newIndex < 0) {
      newIndex = len - 1
    } else if (newIndex >= len) {
      newIndex = 0
    }

    const oldIndex = current

    if (current !== newIndex) {
      current = newIndex
      removeClass(list[old], animClassName)
      removeClass(list[oldIndex], activeClassName)
      addClass(list[oldIndex], animClassName)
      addClass(list[newIndex], activeClassName + ' ' + animClassName)
      old = oldIndex

      list.forEach(function (item, index) {
        item.style.transform = `translateX(${(processIndex(index, newIndex, len) - newIndex) * width}px)`
      })
    }
  }

  list.forEach(function (item, index) {
    item.style.transform = `translateX(${(processIndex(index, current, len) - current) * width}px)`
  })

  btnLeft.addEventListener('click', function () {
    handleClick(current - 1)
  })
  btnRight.addEventListener('click', function () {
    handleClick(current + 1)
  })
}
swiper()
