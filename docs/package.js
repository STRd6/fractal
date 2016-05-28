(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, publicAPI, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = self;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, content, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    if ((content = file.content) == null) {
      throw "Malformed package. No content for file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    var fn;
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    fn = function(path) {
      var otherPackage;
      if (typeof path === "object") {
        return loadPackage(path);
      } else if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
    fn.packageWrapper = publicAPI.packageWrapper;
    fn.executePackageWrapper = publicAPI.executePackageWrapper;
    return fn;
  };

  publicAPI = {
    generateFor: generateRequireFn,
    packageWrapper: function(pkg, code) {
      return ";(function(PACKAGE) {\n  var src = " + (JSON.stringify(PACKAGE.distribution.main.content)) + ";\n  var Require = new Function(\"PACKAGE\", \"return \" + src)({distribution: {main: {content: src}}});\n  var require = Require.generateFor(PACKAGE);\n  " + code + ";\n})(" + (JSON.stringify(pkg, null, 2)) + ");";
    },
    executePackageWrapper: function(pkg) {
      return publicAPI.packageWrapper(pkg, "require('./" + pkg.entryPoint + "')");
    },
    loadPackage: loadPackage
  };

  if (typeof exports !== "undefined" && exports !== null) {
    module.exports = publicAPI;
  } else {
    global.Require = publicAPI;
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

  return publicAPI;

}).call(this);

  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2016 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "# fractal",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee": {
      "path": "main.coffee",
      "content": "width = 700\nheight = 400\n\nviewport =\n  x: -0.775\n  y: -0.1\n  width: 0.05\n  height: 0.02\n\n#viewport =\n  #x: -2.5\n  #y: -1\n  #width: 3.5\n  #height: 2\n\ncanvas = document.createElement 'canvas'\ncanvas.width = width\ncanvas.height = height\n\ndocument.body.appendChild canvas\n\ncontext = canvas.getContext '2d'\n\ncontext.fillStyle = \"white\"\ncontext.fillRect(0, 0, width, height)\n\nITERATION_MAX = 1024\n\n# scaled x coordinate of pixel (scaled to lie in the Mandelbrot X scale (-2.5, 1))\n# scaled y coordinate of pixel (scaled to lie in the Mandelbrot Y scale (-1, 1))\npixelToWorld = (px, py, viewport) ->\n  x: (px / width) * viewport.width + viewport.x\n  y: ((height - py) / height) * viewport.height + viewport.y\n\ncompute = (px, py, viewport) ->\n  {x:x0, y:y0} = pixelToWorld(px, py, viewport)\n  x = 0.0\n  y = 0.0\n  iteration = 0\n  while (x*x + y*y < 4 and iteration < ITERATION_MAX)\n    xtemp = x*x - y*y + x0\n    y = 2*x*y + y0\n    x = xtemp\n    iteration = iteration + 1\n\n  return iteration\n\nplot = (x, y, n) ->\n  ni = ITERATION_MAX - n\n  r = (ni) % 256\n  g = 0 #(n % 256)\n  b = (ni * 256 / ITERATION_MAX) | 0\n  context.fillStyle = \"rgb(#{r}, #{g}, #{b})\"\n  context.fillRect(x, y, 1, 1)\n\n[0...height].forEach (py) ->\n  [0...width].forEach (px) ->\n    n = compute(px, py, viewport)\n    plot(px, py, n)\n\ncanvas.onmousedown = (e) ->\n  {offsetX:px, offsetY:py} = e\n  \n  console.log(pixelToWorld(px, py, viewport))\ncanvas.onmousemove = (e) ->\n  ",
      "mode": "100644"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "name: \"fractal\"\nversion: \"0.0.1\"\n",
      "mode": "100644"
    },
    "fractal.txt": {
      "path": "fractal.txt",
      "content": "For each pixel (Px, Py) on the screen, do:\n{\n  x0 = scaled x coordinate of pixel (scaled to lie in the Mandelbrot X scale (-2.5, 1))\n  y0 = scaled y coordinate of pixel (scaled to lie in the Mandelbrot Y scale (-1, 1))\n  x = 0.0\n  y = 0.0\n  iteration = 0\n  max_iteration = 1000\n  while (x*x + y*y < 2*2  AND  iteration < max_iteration) {\n    xtemp = x*x - y*y + x0\n    y = 2*x*y + y0\n    x = xtemp\n    iteration = iteration + 1\n  }\n  color = palette[iteration]\n  plot(Px, Py, color)\n}\n\n(a + bi)^2 = (a^2 + (bi)^2 + 2abi)\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var ITERATION_MAX, canvas, compute, context, height, pixelToWorld, plot, viewport, width, _i, _results;\n\n  width = 700;\n\n  height = 400;\n\n  viewport = {\n    x: -0.775,\n    y: -0.1,\n    width: 0.05,\n    height: 0.02\n  };\n\n  canvas = document.createElement('canvas');\n\n  canvas.width = width;\n\n  canvas.height = height;\n\n  document.body.appendChild(canvas);\n\n  context = canvas.getContext('2d');\n\n  context.fillStyle = \"white\";\n\n  context.fillRect(0, 0, width, height);\n\n  ITERATION_MAX = 1024;\n\n  pixelToWorld = function(px, py, viewport) {\n    return {\n      x: (px / width) * viewport.width + viewport.x,\n      y: ((height - py) / height) * viewport.height + viewport.y\n    };\n  };\n\n  compute = function(px, py, viewport) {\n    var iteration, x, x0, xtemp, y, y0, _ref;\n    _ref = pixelToWorld(px, py, viewport), x0 = _ref.x, y0 = _ref.y;\n    x = 0.0;\n    y = 0.0;\n    iteration = 0;\n    while (x * x + y * y < 4 && iteration < ITERATION_MAX) {\n      xtemp = x * x - y * y + x0;\n      y = 2 * x * y + y0;\n      x = xtemp;\n      iteration = iteration + 1;\n    }\n    return iteration;\n  };\n\n  plot = function(x, y, n) {\n    var b, g, ni, r;\n    ni = ITERATION_MAX - n;\n    r = ni % 256;\n    g = 0;\n    b = (ni * 256 / ITERATION_MAX) | 0;\n    context.fillStyle = \"rgb(\" + r + \", \" + g + \", \" + b + \")\";\n    return context.fillRect(x, y, 1, 1);\n  };\n\n  (function() {\n    _results = [];\n    for (var _i = 0; 0 <= height ? _i < height : _i > height; 0 <= height ? _i++ : _i--){ _results.push(_i); }\n    return _results;\n  }).apply(this).forEach(function(py) {\n    var _i, _results;\n    return (function() {\n      _results = [];\n      for (var _i = 0; 0 <= width ? _i < width : _i > width; 0 <= width ? _i++ : _i--){ _results.push(_i); }\n      return _results;\n    }).apply(this).forEach(function(px) {\n      var n;\n      n = compute(px, py, viewport);\n      return plot(px, py, n);\n    });\n  });\n\n  canvas.onmousedown = function(e) {\n    var px, py;\n    px = e.offsetX, py = e.offsetY;\n    return console.log(pixelToWorld(px, py, viewport));\n  };\n\n  canvas.onmousemove = function(e) {};\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"name\":\"fractal\",\"version\":\"0.0.1\"};",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "https://danielx.net/editor/"
  },
  "version": "0.0.1",
  "entryPoint": "main",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "STRd6/fractal",
    "homepage": null,
    "description": "",
    "html_url": "https://github.com/STRd6/fractal",
    "url": "https://api.github.com/repos/STRd6/fractal",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});