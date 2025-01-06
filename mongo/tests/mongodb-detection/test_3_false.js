function handleResize(options) {
  options.elements.forEach(function(el) {
    if (el.callback) {
      el.callback();
    }
  });
}

