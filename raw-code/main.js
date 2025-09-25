const fruitTypes = [
  { emoji: '🍒', baseRadius: 30, points: 1, color: '#551910', name: 'cherry' },
  { emoji: '🍓', baseRadius: 36, points: 3, color: '#5a1a11', name: 'strawberry' },
  { emoji: '🍇', baseRadius: 50, points: 6, color: '#2c1a28', name: 'grape' },
  { emoji: '🍊', baseRadius: 64, points: 10, color: '#c3450b', name: 'orange' },
  { emoji: '🍎', baseRadius: 70, points: 15, color: '#7c1c00', name: 'apple' },
  { emoji: '🍐', baseRadius: 76, points: 21, color: '#18270c', name: 'pear' },
  { emoji: '🍑', baseRadius: 84, points: 28, color: '#18270c', name: 'peach' },
  { emoji: '🍍', baseRadius: 90, points: 36, color: '#412614', name: 'pinnapple' },
  { emoji: '🍈', baseRadius: 102, points: 45, color: '#344012', name: 'melon' },
  { emoji: '🍉', baseRadius: 120, points: 55, color: '#032109', name: 'watermelon' },
  { emoji: '🥝', baseRadius: 135, points: 70, color: '#2d1105', name: 'kiwi' },
  { emoji: '🍋', baseRadius: 160, points: 90, color: '#6b4a0f', name: 'lemon' },
  { emoji: '🥑', baseRadius: 200, points: 120, color: '#1a3307', name: 'avocado' },
]

class SuikaGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.setupCanvas();
    this.fruits = [];
    this.currentFruit = null;
    this.nextFruitType = 0;
    this.score = 0;
    this.highScore = localStorage.getItem('suikaHighScore') || 0;
    this.gamesPlayed = Number(localStorage.getItem('gamesPlayed')) || 0;
    this.fruitsDiscovered = Number(localStorage.getItem('fruitsDiscovered')) || 4;
    this.gameOver = false;
    this.dropPosition = 0;
    this.gravity = 0.3;
    this.friction = 0.95;
    this.restitution = 0.4;
    this.allowDrop = true;
    this.hammerMode = false;
    this.hammerUses = 3 + Math.floor(this.gamesPlayed / 2);

    // Fruit types and properties
    this.fruitTypes = fruitTypes;

    // Load fruit images
    this.fruitImages = {};
    this.imagesLoaded = 0;
    this.totalImages = this.fruitTypes.length;
    this.loadFruitImages();
    this.updateDiscoveredFruits();

    this.achievementsCounter = localStorage.getItem('achievementsCounter') ? JSON.parse(localStorage.getItem('achievementsCounter')) : {
      used: 0,
      cherry: 0,
      orange: 0,
      peach: 0,
      pinnapple: 0,
      melon: 0,
      lemon: 0
    };

    this.achievements = localStorage.getItem('achievements') ? JSON.parse(localStorage.getItem('achievements')) : [];


    if(this.achievements.length >= 24 && !this.achievements.includes(25)) {
      this.addNewAchievement(25);
    }
        
    if (this.hammerUses >= 5 && !this.achievements.includes(21)) {
      this.addNewAchievement(21);
    }

    if (this.hammerUses >= 15 && !this.achievements.includes(22)) {
      this.addNewAchievement(22);
    }

    if (this.hammerUses >= 20 && !this.achievements.includes(23)) {
      this.addNewAchievement(23);
    }

    if (this.hammerUses >= 25 && !this.achievements.includes(24)) {
      this.addNewAchievement(24);
    }

    this.init();
  }

  loadFruitImages() {
    this.fruitTypes.forEach((fruit, index) => {
      const img = new Image();
      img.onload = () => {
        this.imagesLoaded++;
        if (this.imagesLoaded === this.totalImages) {
          console.log('All fruit images loaded!');
        }
      };
      img.onerror = () => {
        console.warn(`Failed to load image for ${fruit.name}`);
        this.imagesLoaded++;
      };
      img.src = `assets/${fruit.name}.png`;
      this.fruitImages[index] = img;
    });
  }

  setupCanvas() {
    // Get the game area dimensions
    const gameArea = this.canvas.parentElement;
    const gameAreaRect = gameArea.getBoundingClientRect();

    // Calculate optimal canvas size based on available space with padding
    const maxWidth = gameAreaRect.width - 40; // 20px padding on each side
    const maxHeight = gameAreaRect.height - 80; // 40px padding top/bottom + drop zone

    // Maintain aspect ratio (2:3)
    let canvasWidth = maxWidth;
    let canvasHeight = (maxWidth * 3) / 2;

    if (canvasHeight > maxHeight) {
      canvasHeight = maxHeight;
      canvasWidth = (maxHeight * 2) / 3;
    }

    // Set canvas dimensions
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.canvas.style.width = canvasWidth + 'px';
    this.canvas.style.height = canvasHeight + 'px';

    // Calculate scale factor based on canvas size (base size: 400x600)
    this.scaleFactor = Math.min(canvasWidth / 400, canvasHeight / 600);

    // Update drop position
    this.dropPosition = this.canvas.width / 2;

    // Scale fruit properties based on canvas size
    fruitTypes.forEach(fruit => {
      // Make fruits scale more aggressively with canvas size
      fruit.radius = Math.max(8, fruit.baseRadius * this.scaleFactor);
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      // this.handleResize();
    });
  }

  handleResize() {
    const oldWidth = this.canvas.width;
    const oldHeight = this.canvas.height;

    this.setupCanvas();

    // Scale existing fruits and positions
    const scaleX = this.canvas.width / oldWidth;
    const scaleY = this.canvas.height / oldHeight;

    this.fruits.forEach(fruit => {
      fruit.x *= scaleX;
      fruit.y *= scaleY;
      fruit.radius = this.fruitTypes[fruit.type].radius;
    });

    if (this.currentFruit) {
      this.currentFruit.x *= scaleX;
      this.currentFruit.y *= scaleY;
      this.currentFruit.radius = this.fruitTypes[this.currentFruit.type].radius;
    }

    this.dropPosition *= scaleX;
  }

  init() {
    this.updateHighScore();
    this.generateNextFruit();
    this.setupEventListeners();
    this.gameLoop();
    // Try to play background music
    this.setupAudio();

    // for (let i = 1; i<25; i++) {
    //   setTimeout(() => {
    //     if(this.addNewAchievement)
    //     this.addNewAchievement(i);
    //   }, 1100*i)
    // }
  }

  setupAudio() {
    const bgMusic = document.getElementById('bgMusic');
    // Create a simple ambient sound using Web Audio API as fallback
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.createAmbientSound();
    } catch (e) {
      console.log('Web Audio not supported');
    }
  }

  createAmbientSound() {
    const backgroundMusicState = localStorage.getItem('backgroundMusic') !== undefined ? localStorage.getItem('backgroundMusic') === 'true' : true;

    const backgroundMusic = document.createElement('audio');
    backgroundMusic.setAttribute('src', 'assets/music/background.mp3');
    if (backgroundMusicState) {
      backgroundMusic.setAttribute('autoplay', 'autoplay');
    }
    backgroundMusic.setAttribute('loop', 'loop');
    backgroundMusic.setAttribute('id', 'backgroundMusic');
    document.querySelector('body').append(backgroundMusic);
    backgroundMusic.Play();
  }

  setupEventListeners() {
    // Mouse controls
    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.gameOver) {
        const rect = this.canvas.getBoundingClientRect();
        this.dropPosition = Math.max(30, Math.min(this.canvas.width - 30,
          e.clientX - rect.left));
        this.updatePreview();
      }
    });

    this.canvas.addEventListener('click', () => {
      if (!this.gameOver && !this.hammerMode) {
        this.dropFruit();
      }
    });

    this.canvas.addEventListener('click', (e) => {
      e.preventDefault();
      if (!this.gameOver && this.hammerMode) {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        this.destroyFruitAt(clickX, clickY);
      }
    });

    // Touch controls for mobile
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.gameOver) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.dropPosition = Math.max(30, Math.min(this.canvas.width - 30,
          touch.clientX - rect.left));
        this.updatePreview();
      }
    });

    // this.canvas.addEventListener('touchend', (e) => {
    //   e.preventDefault();
    //   if (!this.gameOver && !this.hammerMode) {
    //     this.dropFruit();
    //   } else if (!this.gameOver && this.hammerMode) {
    //     const rect = this.canvas.getBoundingClientRect();
    //     const touch = e.changedTouches[0];
    //     const touchX = touch.clientX - rect.left;
    //     const touchY = touch.clientY - rect.top;
    //     this.destroyFruitAt(touchX, touchY);
    //   }
    // });

    // Button controls
    document.getElementById('restartBtn').addEventListener('click', () => {
      this.restart();
    });

    document.getElementById('playAgainBtn').addEventListener('click', () => {
      this.hideGameOverModal();
      this.restart();
    });

    document.getElementById('hammerBtn').addEventListener('click', () => {
      this.toggleHammerMode();
    });

  }

  generateNextFruit() {
    // Generate fruits 0-4 (smaller fruits) with higher probability
    this.nextFruitType = Math.floor(Math.random() * 4);
    this.updatePreview();
  }

  updatePreview() {
    const preview = document.getElementById('previewFruit');

    const fruit = fruitTypes[this.nextFruitType];
    // preview.textContent = fruit.emoji;
    preview.setAttribute('fruit', fruit.name);
    const canvasWidth = Number(document.querySelector('canvas').getAttribute('width'));
    let offset = (Number(window.innerWidth) - canvasWidth) / 2;
    if (window.innerWidth > 768) {
      offset -= 230
    }
    preview.style.left = `${this.dropPosition + offset}px`;
    this.updateHammerButton();
  }

  toggleHammerMode() {
    if (this.hammerUses <= 0) return; // Can't activate if no uses left

    this.hammerMode = !this.hammerMode;
    const hammerBtn = document.getElementById('hammerBtn');
    const canvas = document.getElementById('gameCanvas');

    if (this.hammerMode) {
      hammerBtn.classList.add('active');
      hammerBtn.textContent = `↩️ (${this.hammerUses})`;
      canvas.classList.add('hammer-mode');
    } else {
      hammerBtn.classList.remove('active');
      hammerBtn.textContent = `🔨 (${this.hammerUses})`;
      canvas.classList.remove('hammer-mode');
    }
  }

  destroyFruitAt(x, y) {
    for (let i = this.fruits.length - 1;i >= 0;i--) {
      const fruit = this.fruits[i];
      const dx = x - fruit.x;
      const dy = y - fruit.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= fruit.radius) {
        // Create destruction particles
        this.createDestructionParticles(x, y, fruit.color);

        const destroyedFruit = fruitTypes[fruit.type];
        console.log('%c fruit', 'background: #df03fc; color: #f8fc03', destroyedFruit);
        this.achievementsCounter[destroyedFruit.name] = this.achievementsCounter[destroyedFruit.name] ? this.achievementsCounter[destroyedFruit.name] + 1 : 1;
        this.achievementsCounter.used = this.achievementsCounter.used ? this.achievementsCounter.used + 1 : 1;
        this.updateHammerAchievents();
  

        // Play destruction sound
        this.playDestructionSound();

        // Remove the fruit
        this.fruits.splice(i, 1);

        // Consume one hammer use
        this.hammerUses--;

        // Turn off hammer mode after use
        this.toggleHammerMode();

        // Update button state
        this.updateHammerButton();
        window.setAchievementList();
        break;
      }
    }
  }

  updateHammerAchievents() {
    localStorage.setItem('achievementsCounter', JSON.stringify(this.achievementsCounter));
    if (this.achievementsCounter.used >= 5 && !this.achievements.includes(11)) {
      this.addNewAchievement(11);
    }
    if (this.achievementsCounter.used >= 15 && !this.achievements.includes(12)) {
      this.addNewAchievement(12);
    }
    if (this.achievementsCounter.used >= 25 && !this.achievements.includes(13)) {
      this.addNewAchievement(13);
    }
    if (this.achievementsCounter.used >= 50 && !this.achievements.includes(14)) {
      this.addNewAchievement(14);
    }
    if (this.achievementsCounter.cherry >= 25 && !this.achievements.includes(15)) {
      this.addNewAchievement(15);
    }
    if (this.achievementsCounter.orange >= 15 && !this.achievements.includes(16)) {
      this.addNewAchievement(16);
    }
    if (this.achievementsCounter.peach >= 7 && !this.achievements.includes(17)) {
      this.addNewAchievement(17);
    }
    if (this.achievementsCounter.pinnapple >= 5 && !this.achievements.includes(18)) {
      this.addNewAchievement(18);
    }
    if (this.achievementsCounter.melon >= 3 && !this.achievements.includes(19)) {
      this.addNewAchievement(19);
    }
    if (this.achievementsCounter.lemon >= 1 && !this.achievements.includes(20)) {
      this.addNewAchievement(20);
    }
  }

  createDestructionParticles(x, y, color) {
    for (let i = 0;i < 64;i++) {
      const particle = document.createElement('div');
      particle.className = 'destruction-particle';
      particle.style.left = `${window.innerWidth / 2}px`;
      particle.style.top = `${y + 75}px`;
      particle.style.background = color;

      const angle = (Math.PI * 2 * i) / 64;
      const velocity = 30 + Math.random() * 30;

      particle.style.setProperty('--vx', `${Math.cos(angle) * velocity}px`);
      particle.style.setProperty('--vy', `${Math.sin(angle) * velocity}px`);

      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 1500);
    }
  }

  updateHammerButton() {
    const hammerBtn = document.getElementById('hammerBtn');

    if (this.hammerUses <= 0) {
      hammerBtn.disabled = true;
      hammerBtn.textContent = '❌';
      hammerBtn.classList.add('disabled');
      // Turn off hammer mode if it's active
      if (this.hammerMode) {
        this.hammerMode = false;
        const canvas = document.getElementById('gameCanvas');
        canvas.classList.remove('hammer-mode');
        hammerBtn.classList.remove('active');
      }
    } else {
      hammerBtn.disabled = false;
      hammerBtn.classList.remove('disabled');
      if (this.hammerMode) {
        hammerBtn.textContent = `↩️ (${this.hammerUses})`;
      } else {
        hammerBtn.textContent = `🔨 (${this.hammerUses})`;
      }
    }
  }

  playDestructionSound() {
    soundEffetctsState = localStorage.getItem('soundEffects') !== undefined ? localStorage.getItem('soundEffects') === 'true' : true;
    if (this.audioContext && soundEffetctsState) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);

      gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

      oscillator.type = 'sawtooth';
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.3);
    }
  }

  dropFruit() {

    if (this.allowDrop) {
      this.allowDrop = false;

      const fruitType = this.fruitTypes[this.nextFruitType];
      this.currentFruit = {
        x: this.dropPosition,
        y: fruitType.radius,
        vx: 0,
        vy: 0,
        radius: fruitType.radius,
        type: this.nextFruitType,
        color: fruitType.color,
        emoji: fruitType.emoji,
        isDropping: true
      };

      this.generateNextFruit();

      this.fruits.push(this.currentFruit);
      // Add fruit to physics simulation after a brief delay
      setTimeout(() => {
        this.allowDrop = true;
        if (this.currentFruit) {
          this.currentFruit = null;
        }
      }, 700);
    }
  }

  updatePhysics() {
    this.fruits.forEach(fruit => {
      // Apply gravity
      fruit.vy += this.gravity;

      // Update position
      fruit.x += fruit.vx;
      fruit.y += fruit.vy;

      // Apply friction
      fruit.vx *= this.friction;
      fruit.vy *= this.friction;

      // Additional friction when fruits are close to each other
      this.fruits.forEach(otherFruit => {
        if (fruit !== otherFruit) {
          const dx = fruit.x - otherFruit.x;
          const dy = fruit.y - otherFruit.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = fruit.radius + otherFruit.radius + 5;

          if (distance < minDistance) {
            // Apply extra friction when fruits are close
            fruit.vx *= 0.92;
            fruit.vy *= 0.92;
          }
        }
      });

      // Floor collision
      if (fruit.y + fruit.radius > this.canvas.height) {
        fruit.y = this.canvas.height - fruit.radius;
        fruit.vy *= -this.restitution;
        if (Math.abs(fruit.vy) < 1) fruit.vy = 0;
      }

      // Wall collisions
      if (fruit.x - fruit.radius < 0) {
        fruit.x = fruit.radius;
        fruit.vx *= -this.restitution;
      }
      if (fruit.x + fruit.radius > this.canvas.width) {
        fruit.x = this.canvas.width - fruit.radius;
        fruit.vx *= -this.restitution;
      }

      // Remove fruits that are too high (game over condition)
      if (fruit.y < 50) {
        fruit.dangerTime = (fruit.dangerTime || 0) + 1;
        if (fruit.dangerTime > 180) { // 3 seconds at 60fps
          this.triggerGameOver();
        }
      } else {
        fruit.dangerTime = 0;
      }
    });

    // Check collisions between fruits
    this.checkCollisions();
  }

  checkCollisions() {
    for (let i = 0;i < this.fruits.length;i++) {
      for (let j = i + 1;j < this.fruits.length;j++) {
        const fruit1 = this.fruits[i];
        const fruit2 = this.fruits[j];

        const dx = fruit1.x - fruit2.x;
        const dy = fruit1.y - fruit2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = fruit1.radius + fruit2.radius;

        if (distance < minDistance) {
          // Check if fruits are the same type and can merge
          if (fruit1.type === fruit2.type && fruit1.type < this.fruitTypes.length - 1) {
            this.mergeFruits(fruit1, fruit2, i, j);
            return; // Exit to avoid index issues
          } else {
            // Handle collision (bouncing)
            this.handleCollision(fruit1, fruit2, dx, dy, distance, minDistance);
          }
        }
      }
    }
  }

  mergeFruits(fruit1, fruit2, index1, index2) {

    // Calculate merge position
    const mergeX = (fruit1.x + fruit2.x) / 2;
    const mergeY = (fruit1.y + fruit2.y) / 2;

    // Create new fruit of next type
    const newType = fruit1.type + 1;
    const newFruitType = this.fruitTypes[newType];

    console.log('%c this.fruitsDiscovered', 'background: #df03fc; color: #f8fc03', this.fruitsDiscovered);

    if (newType + 1 > this.fruitsDiscovered) {
      this.fruitsDiscovered = newType + 1;
      localStorage.setItem('fruitsDiscovered', this.fruitsDiscovered);
      if (this.fruitsDiscovered >= 5 && !this.achievements.includes(6)) {
        this.addNewAchievement(6);
      }
      if (this.fruitsDiscovered >= 7 && !this.achievements.includes(7)) {
        this.addNewAchievement(7);
      }
      if (this.fruitsDiscovered >= 9 && !this.achievements.includes(8)) {
        this.addNewAchievement(8);
      }
      if (this.fruitsDiscovered >= 12 && !this.achievements.includes(9)) {
        this.addNewAchievement(9);
      }
      if (this.fruitsDiscovered == 13 && !this.achievements.includes(10)) {
        this.addNewAchievement(10);
      }
      this.updateDiscoveredFruits();
    }

    const newFruit = {
      x: mergeX,
      y: mergeY,
      vx: 0,
      vy: -2, // Small upward velocity for visual effect
      radius: newFruitType.radius,
      type: newType,
      color: newFruitType.color,
      emoji: newFruitType.emoji,
      isNew: true
    };

    // Add score
    this.score += newFruitType.points * 10;
    this.updateScore();

    // Create particle effect
    this.createParticles(mergeX, mergeY, fruit1.color);

    // Remove old fruits and add new one
    this.fruits.splice(Math.max(index1, index2), 1);
    this.fruits.splice(Math.min(index1, index2), 1);
    this.fruits.push(newFruit);

    // Play merge sound effect
    this.playMergeSound();
  }

  handleCollision(fruit1, fruit2, dx, dy, distance, minDistance) {
    // Separate overlapping fruits
    const overlap = minDistance - distance;
    const separationX = (dx / distance) * overlap * 0.5;
    const separationY = (dy / distance) * overlap * 0.5;

    fruit1.x += separationX;
    fruit1.y += separationY;
    fruit2.x -= separationX;
    fruit2.y -= separationY;

    // Calculate collision response
    const normalX = dx / distance;
    const normalY = dy / distance;

    const relativeVelocityX = fruit1.vx - fruit2.vx;
    const relativeVelocityY = fruit1.vy - fruit2.vy;

    const velocityAlongNormal = relativeVelocityX * normalX + relativeVelocityY * normalY;

    if (velocityAlongNormal > 0) return; // Objects separating

    const impulse = 2 * velocityAlongNormal / 2; // Assuming equal mass

    fruit1.vx -= impulse * normalX * this.restitution;
    fruit1.vy -= impulse * normalY * this.restitution;
    fruit2.vx += impulse * normalX * this.restitution;
    fruit2.vy += impulse * normalY * this.restitution;
  }

  createParticles(x, y, color) {
    for (let i = 0;i < 64;i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${window.innerWidth / 2 + (Math.random() - 0.65) * 100}px`;
      particle.style.top = `${y + 75 + (Math.random() - 0.65) * 100}px`;
      particle.style.background = color;

      const angle = (Math.PI * 2 * i) / 24;
      const velocity = 20 + Math.random() * 20;

      particle.style.setProperty('--vx', `${Math.cos(angle) * velocity}px`);
      particle.style.setProperty('--vy', `${Math.sin(angle) * velocity}px`);

      setTimeout(() => {
        document.body.appendChild(particle);
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 1000);
      }, Math.random() * 500);

    }
  }

  playMergeSound() {
    const soundEffetctsState = localStorage.getItem('soundEffects') !== undefined ? localStorage.getItem('soundEffects') === 'true' : true;
    if (this.audioContext && soundEffetctsState) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

      oscillator.type = 'sine';
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.2);
    }
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw fruits
    this.fruits.forEach(fruit => {
      this.ctx.save();

      // Draw fruit shadow
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      this.ctx.beginPath();
      this.ctx.arc(fruit.x + 2, fruit.y + 2, fruit.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw fruit image
      const fruitImage = this.fruitImages[fruit.type];
      if (fruitImage && fruitImage.complete) {
        // Calculate image size to cover the whole circle (slightly larger than radius)
        const imageSize = fruit.radius * 2.2; // Make image 10% larger on each side
        const imageX = fruit.x - fruit.radius;
        const imageY = fruit.y - fruit.radius;

        // Add circular clipping to ensure perfect circle shape
        this.ctx.beginPath();
        this.ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
        this.ctx.clip();

        // Draw the fruit image centered and covering the whole circle
        const offsetX = imageX - (imageSize - fruit.radius * 2) / 2;
        const offsetY = imageY - (imageSize - fruit.radius * 2) / 2;
        this.ctx.drawImage(fruitImage, offsetX, offsetY, imageSize, imageSize);
      } else {
        // Fallback to gradient circle and emoji if image not loaded
        const gradient = this.ctx.createRadialGradient(
          fruit.x - fruit.radius * 0.3, fruit.y - fruit.radius * 0.3, 0,
          fruit.x, fruit.y, fruit.radius
        );
        gradient.addColorStop(0, this.lightenColor(fruit.color, 40));
        gradient.addColorStop(1, fruit.color);

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw fruit emoji as fallback
        this.ctx.font = `${fruit.radius * 1.2}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(fruit.emoji, fruit.x, fruit.y);
      }

      // Draw colored border around fruit
      this.ctx.strokeStyle = fruit.color;
      this.ctx.lineWidth = 5;
      this.ctx.beginPath();
      this.ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
      this.ctx.stroke();

      // Highlight new fruits
      if (fruit.isNew) {
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(fruit.x, fruit.y, fruit.radius + 5, 0, Math.PI * 2);
        this.ctx.stroke();
        fruit.isNew = false;
      }

      // Danger indicator for fruits too high
      if (fruit.dangerTime > 60) {
        this.ctx.strokeStyle = '#FF4444';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(fruit.x, fruit.y, fruit.radius + 3, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      this.ctx.restore();
    });

    // Draw drop preview
    if (!this.gameOver && !this.currentFruit) {
      this.ctx.save();
      this.ctx.fillStyle = 'rgba(255, 107, 157, 0.3)';
      this.ctx.strokeStyle = '#FF6B9D';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([5, 5]);
      this.ctx.beginPath();
      this.ctx.moveTo(this.dropPosition, 0);
      this.ctx.lineTo(this.dropPosition, this.canvas.height);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  updateScore() {
    document.getElementById('score').textContent = this.score;
    if (this.score >= 5000 && !this.achievements.includes(1)) {
      this.addNewAchievement(1);
    }
    if (this.score >= 10000 && !this.achievements.includes(2)) {
      this.addNewAchievement(2);
    }
    if (this.score >= 50000 && !this.achievements.includes(3)) {
      this.addNewAchievement(3);
    }
    if (this.score >= 75000 && !this.achievements.includes(4)) {
      this.addNewAchievement(4);
    }
    if (this.score >= 100000 && !this.achievements.includes(5)) {
      this.addNewAchievement(5);
    }
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('suikaHighScore', this.highScore);
      this.updateHighScore();
    }
  }

  updateDiscoveredFruits() {
    document.querySelector('#fruitChain').innerHTML = '';
    for (let i = 0;i < this.fruitsDiscovered;i++) {
      const span = document.createElement('span');
      const fruitDiscovered = this.fruitTypes[i];
      span.classList.add('preview-fruit');
      span.classList.add('inherit');
      span.setAttribute('fruit', fruitDiscovered.name);
      document.querySelector('#fruitChain').append(span);
    }
  }

  addNewAchievement(id) {
    this.achievements.push(id);
    localStorage.setItem('achievements', JSON.stringify(this.achievements))
    window.achievementNotification(id);
    window.setAchievementList();
    if(this.achievements.length >= 24 && !this.achievements.includes(25)) {
      this.addNewAchievement(25);
    }
  }

  updateHighScore() {
    document.getElementById('highScore').textContent = this.highScore;
  }

  triggerGameOver() {
    this.gameOver = true;
    this.gamesPlayed++;
    localStorage.setItem('gamesPlayed', this.gamesPlayed)
    this.showGameOverModal();
  }

  showGameOverModal() {
    const modal = document.getElementById('gameOverModal');
    const finalScore = document.getElementById('finalScore');
    const newRecord = document.getElementById('newRecord');

    finalScore.textContent = this.score;

    if (this.score >= this.highScore && this.score > 0) {
      newRecord.style.display = 'block';
    } else {
      newRecord.style.display = 'none';
    }

    modal.style.display = 'block';
  }

  hideGameOverModal() {
    document.getElementById('gameOverModal').style.display = 'none';
  }

  restart() {
    this.fruits = [];
    this.currentFruit = null;
    this.score = 0;
    this.gameOver = false;
    this.dropPosition = this.canvas.width / 2;
    this.hammerMode = false;
    this.hammerUses = 3 + Math.floor(this.gamesPlayed / 2);

    if (this.hammerUses >= 5 && !this.achievements.includes(21)) {
      this.addNewAchievement(21);
    }

    if (this.hammerUses >= 15 && !this.achievements.includes(22)) {
      this.addNewAchievement(22);
    }

    if (this.hammerUses >= 20 && !this.achievements.includes(23)) {
      this.addNewAchievement(23);
    }

    if (this.hammerUses >= 25 && !this.achievements.includes(24)) {
      this.addNewAchievement(24);
    }

    if(this.achievements.length >= 24 && !this.achievements.includes(25)) {
      this.addNewAchievement(25);
    }

    const hammerBtn = document.getElementById('hammerBtn');
    const canvas = document.getElementById('gameCanvas');
    hammerBtn.classList.remove('active');
    hammerBtn.classList.remove('disabled');
    hammerBtn.disabled = false;
    canvas.classList.remove('hammer-mode');
    this.updateScore();
    this.updateHammerButton();
    this.generateNextFruit();
  }

  gameLoop() {
    if (!this.gameOver) {
      this.updatePhysics();
    }
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
  new SuikaGame();
});

// Add some CSS animations for particles
const style = document.createElement('style');
style.textContent = `
    .particle {
        animation: particle-float 1s ease-out forwards;
    }
    
    @keyframes particle-float {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(0);
        }
    }
`;
document.head.appendChild(style);