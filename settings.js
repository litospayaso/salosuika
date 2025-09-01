let backgroundMusicState = true;
let soundEffetctsState = true;
const notificationArray = [];
const achievementsList = [
  {
    id: 1,
    img: 'cherry',
    min: 1,
    description: {
      EN: 'get 5000 points',
      ES: 'consigue 5000 puntos'
    }
  },
  {
    id: 2,
    img: 'strawberry',
    min: 1,
    description: {
      EN: 'get 10000 points',
      ES: 'consigue 10000 puntos'
    }
  },
  {
    id: 3,
    img: 'grape',
    min: 1,
    description: {
      EN: 'get 50000 points',
      ES: 'consigue 50000 puntos'
    }
  },
  {
    id: 4,
    img: 'orange',
    min: 1,
    description: {
      EN: 'get 75000 points',
      ES: 'consigue 75000 puntos'
    }
  },
  {
    id: 5,
    img: 'apple',
    min: 1,
    description: {
      EN: 'get 100000 points',
      ES: 'consigue 100000 puntos'
    }
  },
  {
    id: 6,
    img: 'apple',
    min: 1,
    description: {
      EN: 'Discover 5 fruits',
      ES: 'Descubre 5 frutas'
    }
  },
  {
    id: 7,
    img: 'peach',
    min: 1,
    description: {
      EN: 'Discover 7 fruits',
      ES: 'Descubre 7 frutas'
    }
  },
  {
    id: 8,
    img: 'melon',
    min: 1,
    description: {
      EN: 'Discover 9 fruits',
      ES: 'Descubre 9 frutas'
    }
  },
  {
    id: 9,
    img: 'lemon',
    min: 1,
    description: {
      EN: 'Discover 12 fruits',
      ES: 'Descubre 12 frutas'
    }
  },
  {
    id: 10,
    img: 'avocado',
    min: 1,
    description: {
      EN: 'Discover all fruits',
      ES: 'Descubre todas las frutas'
    }
  },
  {
    id: 11,
    img: 'hammer',
    replace: 'used',
    min: 1,
    description: {
      EN: 'destroy 5 fruits',
      ES: 'destruye 5 frutas'
    }
  },
  {
    id: 12,
    img: 'hammer',
    replace: 'used',    
    min: 1,
    description: {
      EN: 'destroy 15 fruits',
      ES: 'destruye 15 frutas'
    }
  },
  {
    id: 13,
    img: 'hammer',
    replace: 'used',
    min: 1,
    description: {
      EN: 'destroy 25 fruits',
      ES: 'destruye 25 frutas'
    }
  },
  {
    id: 14,
    img: 'hammer',
    replace: 'used',
    min: 1,
    description: {
      EN: 'destroy 50 fruits',
      ES: 'destruye 50 frutas'
    }
  },
  {
    id: 15,
    img: 'cherry',
    replace: 'cherry',
    min: 1,
    description: {
      EN: 'destroy 25 cherry',
      ES: 'destruye 25 cerezas'
    }
  },
  {
    id: 16,
    img: 'orange',
    replace: 'orange',
    min: 3,
    description: {
      EN: 'destroy 15 oranges',
      ES: 'destruye 15 naranjas'
    }
  },
  {
    id: 17,
    img: 'peach',
    replace: 'peach',
    min: 6,
    description: {
      EN: 'destroy 7 peaches',
      ES: 'destruye 7 melocotones'
    }
  },
  {
    id: 18,
    img: 'pinnapple',
    replace: 'used',
    min: 7,
    description: {
      EN: 'destroy 5 pineapple',
      ES: 'destruye 5 piñas'
    }
  },
  {
    id: 19,
    img: 'melon',
    replace: 'melon',
    min: 8,
    description: {
      EN: 'destroy 3 melons',
      ES: 'destruye 3 melones'
    }
  },
  {
    id: 20,
    img: 'lemon',
    replace: 'lemon',
    min: 11,
    description: {
      EN: 'destroy 1 lemon',
      ES: 'destruye 1 limón'
    }
  },
  {
    id: 21,
    img: 'hammer',
    min: 1,
    description: {
      EN: 'Get 5 hammers',
      ES: 'Consigue 5 martillos'
    }
  },
  {
    id: 22,
    img: 'hammer',
    min: 1,
    description: {
      EN: 'Get 15 hammers',
      ES: 'Consigue 15 martillos'
    }
  },
  {
    id: 23,
    img: 'hammer',
    min: 1,
    description: {
      EN: 'Get 20 hammers',
      ES: 'Consigue 20 martillos'
    }
  },
  {
    id: 24,
    img: 'hammer',
    min: 1,
    description: {
      EN: 'Get 25 hammers',
      ES: 'Consigue 25 martillos'
    }
  },
  {
    id: 25,
    img: 'hammer',
    min: 1,
    description: {
      EN: 'Get all achievements',
      ES: 'Consigue todos los logros'
    }
  },
];

const translations = {
  EN: {
    newGame: 'New game',
    score: 'Score: ',
    best: 'Record: ',
    settings: 'Settings',
    achievements: 'Achievements',
    music: 'Music',
    soundEffects: 'Sound effects',
    close: 'close',
    language: 'language',
    gameOver: 'Game over!',
    finalScore: 'final score: ',
    newRecord: '🎉 New High Score! 🎉',
    playAgain: 'Play again',
  },
  ES: {
    newGame: 'Nueva partida',
    score: 'Puntos: ',
    best: 'Record: ',
    settings: 'Ajustes',
    achievements: 'Logros',
    music: 'Música',
    soundEffects: 'Efectos de sonido',
    close: 'Cerrar',
    language: 'idioma',
    gameOver: '¡Partida terminada!',
    finalScore: 'Puntuación final: ',
    newRecord: '🎉 Nuevo récord! 🎉',
    playAgain: 'Jugar de nuevo',
  },
}

const showSettingsModal = () => {
  const modal = document.getElementById('settingsModal');
  modal.style.display = 'block';
}

const hideSettingsModal = () => {
  document.getElementById('settingsModal').style.display = 'none';
}

document.getElementById('settingsBtn').addEventListener('click', () => {
  showSettingsModal();
});

document.getElementById('closeSettingsModalBtn').addEventListener('click', () => {
  hideSettingsModal();
});

document.getElementById('backgroundMusicSwitch').addEventListener('change', (event) => {
  backgroundMusicState = event.currentTarget.checked;
  localStorage.setItem('backgroundMusic', backgroundMusicState);
  updateBackgroundMusic();
});

document.getElementById('soundEffectsSwitch').addEventListener('change', (event) => {
  soundEffetctsState = event.currentTarget.checked;
  localStorage.setItem('soundEffects', backgroundMusicState);
});

document.getElementById('settingsTab').addEventListener('click', () => {
  document.getElementById('settingsTab').classList.add('active');
  document.getElementById('settingsContainer').classList.remove('d-none');
  document.getElementById('achievementsTab').classList.remove('active');
  document.getElementById('achievementsContainer').classList.add('d-none');
});

document.getElementById('achievementsTab').addEventListener('click', () => {
  document.getElementById('settingsTab').classList.remove('active');
  document.getElementById('settingsContainer').classList.add('d-none');
  document.getElementById('achievementsTab').classList.add('active');
  document.getElementById('achievementsContainer').classList.remove('d-none');
});

document.getElementById('langaugeSelect').addEventListener('change', ({target}) => {
  localStorage.setItem('language', target.value);
  updateTranslations();
});

const setCurrentValues = () => {
  backgroundMusicState = localStorage.getItem('backgroundMusic') ? localStorage.getItem('backgroundMusic') === 'true' : true;
  soundEffetctsState = localStorage.getItem('soundEffects') ? localStorage.getItem('soundEffects') === 'true' : true;

  document.getElementById('backgroundMusicSwitch').checked = backgroundMusicState;
  document.getElementById('soundEffectsSwitch').checked = soundEffetctsState;

  setTimeout(() => {
    updateBackgroundMusic();
  }, 150);
}

const updateTranslations = () => {
  const language = localStorage.getItem('language') || 'EN';
  document.getElementById('langaugeSelect').value = language;
  const transList = translations[language];
  Object.entries(transList).forEach(([id, value]) => {
    const element = document.getElementById(`${id}Text`);
    if(element) {
      element.innerHTML = value;
    }
  })
  setAchievementList();
};

window.setAchievementList = () => {
  document.getElementById('achievementsContainer').innerHTML = '';
  const language = localStorage.getItem('language') || 'EN';
  const achievements = localStorage.getItem('achievements') ? JSON.parse(localStorage.getItem('achievements')) : [];
  const fruitsDiscovered = Number(localStorage.getItem('fruitsDiscovered')) || 4;
  const achievementsCounter = localStorage.getItem('achievementsCounter') ? JSON.parse(localStorage.getItem('achievementsCounter')) : {
    used: 0,
    cherry: 0,
    orange: 0,
    peach: 0,
    pinnapple: 0,
    melon: 0,
    lemon: 0
  };
  achievementsList.forEach(achieve => {
    const replacement = achieve.replace ? ` (${achievementsCounter[achieve.replace]})` : '';
    const description = `${achieve.description[language]}${replacement}`;
    const innerText = `
        <img src="assets/${achieve.img}.png" class="achievement-img">
        <img src="assets/locked.png" class="locked-img">
        <div>${achieve.min < fruitsDiscovered ? description : 'Unlock this fruit to see the achievement'}</div>
    `;
    const achieveDiv = document.createElement('div');
    achieveDiv.classList.add('achievement-item');
    if (achievements.includes(achieve.id)) {
      achieveDiv.classList.add('unlocked');
    }
    achieveDiv.setAttribute('id',`achievement-${achieve.id}`);
    achieveDiv.innerHTML = innerText;
    document.getElementById('achievementsContainer').append(achieveDiv);
  });
};

const updateBackgroundMusic = () => {
  const audio = document.getElementById('backgroundMusic');
  if (backgroundMusicState) {
    audio.play();
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
};

window.achievementNotification = (achieveId) => {
  const language = localStorage.getItem('language') || 'EN';
  if (achieveId) {
    notificationArray.push(achieveId);
  }
  const snack = document.getElementById("snackbar");

  if(!snack.classList.contains('show')) {
    const id = notificationArray.pop();
    const achieve = achievementsList.find(e => e.id == id);
    snack.innerHTML = `
    <img src="assets/${achieve.img}.png">
    <span>${achieve.description[language]}</span>
    `;
    snack.classList.add('show');
    setTimeout(() => {
      snack.classList.remove('show');
      setTimeout(() => {
        if(notificationArray.length > 0) {
          window.achievementNotification();
        }
      }, 800);
    }, 2000);
  }
}


setCurrentValues();
updateTranslations();
window.setAchievementList();
