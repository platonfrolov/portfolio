function displayText(text) {
    var textContainer = document.querySelector('.text-container');
    var textElement = document.getElementById('text');
  
    textElement.innerText = text;
    textContainer.classList.remove('text-content');
    void textContainer.offsetWidth; 
    textContainer.classList.add('text-content');
  }
  
  function startAnimation() {
    var texts = ["23 years old", "a Data Scientist", "a Tennis Player", "a Tech Enthusiast"]; 
    var currentIndex = 0;
  
    function updateText() {
        displayText(texts[currentIndex]);
        currentIndex = (currentIndex + 1) % texts.length;
        setTimeout(updateText, 4990);
    }
    updateText();
  }
  
  startAnimation();

function Waves(cvs, options) {

    var paused = true,
        rafid;
    
    this.isOK = false;
    
    self.defaults = {
        accuracy: 3,
        speed: 0.16,
        offset: 246,
        height: 30,
        color: 0xFFFFFF,
        bgColor: 0xFFFFFF,
        size: 1000,
        segments: 40,
        camera: {
            perspective: 70,
            position: { x: 450, y: 40, z: 0 },
            lookAt: { x: 0, y: 0, z: 50 }
        },
        fog: {
            enabled: true,
            density: 0.005,
        },
        renderCallback: function (s) { }
    };
    
    this.isPaused = function () {
        return paused;
    };
    this.dots = [];
    
    function extend(destination, source) {
        for (var property in source) {
            if (typeof source[property] === 'object')
                destination[property] = extend(destination[property], source[property]);
            else
                destination[property] = source[property];
        }
        return destination;
    }
    
    function addEvent(elem, type, eventHandle) {
        if (elem == null || elem == undefined) return;
        if (elem.addEventListener) {
            elem.addEventListener(type, eventHandle, false);
        } else if (elem.attachEvent) {
            elem.attachEvent("on" + type, eventHandle);
        } else {
            elem["on" + type] = eventHandle;
        }
    };
    
    function getDevicePixelRatio() {
        var ratio = 1;
        if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI) {
            ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
        }
        else if (window.devicePixelRatio !== undefined) {
            ratio = window.devicePixelRatio;
        }
        return ratio;
    }
    
    function OnResizeCVS() {
        var pixelRatio = 1 / getDevicePixelRatio();
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth * pixelRatio * this.options.accuracy, window.innerHeight * pixelRatio * this.options.accuracy, false);
    }
    
    function init() {
        this.options = extend(self.defaults, options);
    
        if (!!!window.WebGLRenderingContext) return false;
    
        try {
            this.renderer = new THREE.WebGLRenderer({ canvas: cvs, antialias: true });
            this.renderer.setClearColor(this.options.bgColor);

            this.scene = new THREE.Scene();
    
            if (this.options.fog.enabled)
                this.scene.fog = new THREE.FogExp2(this.options.bgColor, this.options.fog.density);
    

            this.camera = new THREE.PerspectiveCamera(this.options.camera.perspective, window.innerWidth / window.innerHeight, 1, 10000);
            this.camera.position.set(this.options.camera.position.x, this.options.camera.position.y, this.options.camera.position.z);
            this.lookAt = new THREE.Vector3(this.options.camera.lookAt.x, this.options.camera.lookAt.y, this.options.camera.lookAt.z);
            this.camera.lookAt(this.lookAt);
            this.scene.add(this.camera);
    
 
            addEvent(window, 'resize', OnResizeCVS);
            OnResizeCVS();
    

            var material = new THREE.MeshBasicMaterial({
                color: this.options.color,
                wireframe: true,
            });
            var geometry = new THREE.PlaneGeometry(this.options.size, this.options.size * 2, this.options.segments, this.options.segments * 2);
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.rotation.x = Math.PI / 2;
            this.scene.add(this.mesh);
        } catch (e) {
            return false;
        }
        return true;
    }
    this.isOK = init();
    
    function animate() {
        rafid = requestAnimationFrame(animate);
        waves(Date.now() / 1000);
        this.options.renderCallback(this);
        this.renderer.render(this.scene, this.camera);
    }
    
    function waves(time) {
        var verts = this.mesh.geometry.attributes.position;
    
        for (var i = 0, len = verts.count; i < len; i++) {
            var x = verts.getX(i);
            var y = verts.getY(i);
            var z = Math.sin(x * Math.PI / this.options.offset + time * this.options.speed) *
                    Math.cos(y * Math.PI / this.options.offset + time * this.options.speed) *
                    this.options.height;
            verts.setZ(i, z);
        }
        this.mesh.geometry.attributes.position.needsUpdate = true;
    }
    
    this.toggle = function (run) {
        if (!this.isOK) return false;
    
        if (run === undefined)
            this.toggle(!paused);
    
        else if (!!run && paused) {
            paused = false;
            animate();
        }
        else if (!!!run) {
            paused = true;
            cancelAnimationFrame(rafid);
        }
        return true;
    }
    }
    
    (function() {
    var cvs = document.getElementById('cvs');
    var mouseX = 0;
    
    document.onmousemove = function (e) {
    mouseX = e.clientX;
    };
    
    var waves = new Waves(cvs, {
      color: 0xBBBBBB,
      renderCallback: function (v) {
          var targetX = mouseX / window.innerWidth * 200 - 100;
          v.lookAt.z += (-targetX - v.lookAt.z) / 100;
          v.camera.lookAt(v.lookAt);
      }
    });
    
    waves.toggle(true);
    })();